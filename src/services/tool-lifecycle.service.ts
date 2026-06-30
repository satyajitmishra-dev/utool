import { adminDb } from "@/lib/firebase-admin";
import { RegistryTool } from "@/types/tool-registry";
import { TOOL_REGISTRY, getDefaultToolStatus } from "@/config/tool-registry";

export interface ToolMetadata {
  id: string; // matches tool slug
  status: "Live" | "In Progress" | "Testing" | "Planned" | "Beta" | "Deprecated" | "Broken" | "Hidden";
  priority: "Critical" | "High" | "Medium" | "Low";
  completion: number; // 0-100
  frontend: boolean;
  backend: boolean;
  api: boolean;
  mobile: boolean;
  seo: boolean;
  tested: boolean;
  productionReady: boolean;
  lastUpdated: string; // ISO string
  estimatedCompletion?: string; // YYYY-MM-DD
  developerNotes: string;
  version: string;
  features: { name: string; completed: boolean }[];
  ext?: Record<string, any>;
}

export interface ToolAuditLog {
  id?: string;
  toolId: string;
  toolName: string;
  adminEmail: string;
  adminUid: string;
  timestamp: string; // ISO string
  previousValues: Partial<ToolMetadata>;
  newValues: Partial<ToolMetadata>;
  reason: string;
}

// Memory cache for tool metadata
let cache: {
  data: Record<string, ToolMetadata> | null;
  timestamp: number;
} = {
  data: null,
  timestamp: 0,
};

let activePromise: Promise<Record<string, ToolMetadata>> | null = null;

const CACHE_TTL = 30 * 1000; // 30 seconds cache TTL

export function clearToolCache() {
  cache.data = null;
  cache.timestamp = 0;
  activePromise = null;
}

/**
 * Fetches all dynamic metadata overrides from Firestore
 */
export async function getToolMetadataMap(): Promise<Record<string, ToolMetadata>> {
  const now = Date.now();
  if (cache.data && now - cache.timestamp < CACHE_TTL) {
    return cache.data;
  }

  if (activePromise) {
    return activePromise;
  }

  activePromise = (async () => {
    const metadataMap: Record<string, ToolMetadata> = {};
    try {
      if (!adminDb) {
        console.warn("adminDb is not initialized. Using default tool registry statuses.");
        return {};
      }
      const snapshot = await adminDb.collection("tool_metadata").get();
      snapshot.docs.forEach((doc) => {
        metadataMap[doc.id] = doc.data() as ToolMetadata;
      });

      // Update cache
      cache.data = metadataMap;
      cache.timestamp = Date.now();
    } catch (error: any) {
      if (error?.message?.includes("Quota exceeded") || error?.code === 8) {
        console.warn("[Lifecycle] Firestore quota exceeded. Falling back to default tool statuses.");
      } else {
        console.error("Failed to fetch tool metadata from Firestore:", error);
      }
      // Cache empty results (or keep previous cache data if present) to prevent spamming Firestore
      cache.data = cache.data || {};
      cache.timestamp = Date.now();
    } finally {
      activePromise = null;
    }
    return cache.data || metadataMap;
  })();

  return activePromise;
}

/**
 * Combines the static TOOL_REGISTRY with dynamic Firestore lifecycle metadata.
 * Returns the full list of merged RegistryTool items.
 */
export async function getMergedToolRegistry(): Promise<RegistryTool[]> {
  const metadataMap = await getToolMetadataMap();

  return TOOL_REGISTRY.map((staticTool) => {
    // Generate default lifecycle status fields for this tool
    const defaultStatus = getDefaultToolStatus(staticTool);

    // Merge static tool definition with default status, then override with Firestore values if present
    const override = metadataMap[staticTool.slug] || {};
    
    // Extensible properties fallback
    return {
      ...staticTool,
      ...defaultStatus,
      ...override,
      // Ensure IDs and slugs remain correct
      id: staticTool.id,
      slug: staticTool.slug,
      name: staticTool.name,
      category: staticTool.category,
      description: staticTool.description,
      primaryTag: staticTool.primaryTag,
      iconTag: staticTool.iconTag,
    } as RegistryTool;
  });
}

/**
 * Get a single merged tool by its slug
 */
export async function getMergedToolBySlug(slug: string): Promise<RegistryTool | null> {
  const allTools = await getMergedToolRegistry();
  const found = allTools.find((t) => t.slug === slug);
  return found || null;
}

/**
 * Update a specific tool's metadata in Firestore
 */
export async function updateToolMetadata(
  toolId: string,
  updates: Partial<ToolMetadata>,
  adminUid: string,
  adminEmail: string,
  reason: string = "Manual update"
): Promise<ToolMetadata> {
  if (!adminDb) {
    throw new Error("adminDb not initialized.");
  }

  const docRef = adminDb.collection("tool_metadata").doc(toolId);
  const docSnap = await docRef.get();
  
  const staticTool = TOOL_REGISTRY.find((t) => t.slug === toolId);
  if (!staticTool) {
    throw new Error(`Tool with slug/id '${toolId}' not found in registry.`);
  }

  const defaultStatus = getDefaultToolStatus(staticTool) as ToolMetadata;
  const previousValues = docSnap.exists ? (docSnap.data() as ToolMetadata) : defaultStatus;

  const newValues = {
    ...previousValues,
    ...updates,
    id: toolId,
    lastUpdated: new Date().toISOString(),
  };

  // 1. Write the metadata update to Firestore
  await docRef.set(newValues, { merge: true });

  // 2. Write an audit log entry
  const auditLogRef = adminDb.collection("tool_audit_logs").doc();
  const auditEntry: ToolAuditLog = {
    toolId,
    toolName: staticTool.name,
    adminEmail,
    adminUid,
    timestamp: new Date().toISOString(),
    previousValues: getDiff(previousValues, newValues, Object.keys(updates)),
    newValues: updates,
    reason,
  };
  await auditLogRef.set(auditEntry);

  // Clear in-memory cache
  clearToolCache();

  return newValues as ToolMetadata;
}

/**
 * Perform a bulk update across multiple tools
 */
export async function bulkUpdateToolMetadata(
  toolIds: string[],
  updates: Partial<ToolMetadata>,
  adminUid: string,
  adminEmail: string,
  reason: string = "Bulk update"
): Promise<{ success: boolean; count: number }> {
  if (!adminDb) {
    throw new Error("adminDb not initialized.");
  }

  const batch = adminDb.batch();
  const timestamp = new Date().toISOString();

  for (const toolId of toolIds) {
    const docRef = adminDb.collection("tool_metadata").doc(toolId);
    const docSnap = await docRef.get();
    
    const staticTool = TOOL_REGISTRY.find((t) => t.slug === toolId);
    if (!staticTool) continue;

    const defaultStatus = getDefaultToolStatus(staticTool) as ToolMetadata;
    const previousValues = docSnap.exists ? (docSnap.data() as ToolMetadata) : defaultStatus;

    const newValues = {
      ...previousValues,
      ...updates,
      id: toolId,
      lastUpdated: timestamp,
    };

    batch.set(docRef, newValues, { merge: true });

    // Write audit log inside the loop
    const auditLogRef = adminDb.collection("tool_audit_logs").doc();
    const auditEntry: ToolAuditLog = {
      toolId,
      toolName: staticTool.name,
      adminEmail,
      adminUid,
      timestamp,
      previousValues: getDiff(previousValues, newValues, Object.keys(updates)),
      newValues: updates,
      reason,
    };
    batch.set(auditLogRef, auditEntry);
  }

  await batch.commit();
  
  // Clear in-memory cache
  clearToolCache();

  return { success: true, count: toolIds.length };
}

/**
 * Gets audit logs for a tool
 */
export async function getToolAuditLogs(toolId: string): Promise<ToolAuditLog[]> {
  if (!adminDb) return [];
  try {
    const snapshot = await adminDb
      .collection("tool_audit_logs")
      .where("toolId", "==", toolId)
      .get();

    const logs = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as ToolAuditLog[];

    // Sort in memory by timestamp descending to avoid needing a Firestore composite index
    logs.sort((a, b) => {
      const timeA = typeof a.timestamp === "number" 
        ? a.timestamp 
        : (a.timestamp as any)?.toDate?.()?.getTime() || (a.timestamp ? new Date(a.timestamp).getTime() : 0);
      const timeB = typeof b.timestamp === "number" 
        ? b.timestamp 
        : (b.timestamp as any)?.toDate?.()?.getTime() || (b.timestamp ? new Date(b.timestamp).getTime() : 0);
      return timeB - timeA;
    });

    return logs.slice(0, 50);
  } catch (error) {
    console.error(`Failed to fetch audit logs for tool ${toolId}:`, error);
    return [];
  }
}

/**
 * Returns fields that have changed for previous values representation
 */
function getDiff(prev: any, next: any, keys: string[]): Record<string, any> {
  const diff: Record<string, any> = {};
  keys.forEach((key) => {
    if (prev[key] !== undefined) {
      diff[key] = prev[key];
    }
  });
  return diff;
}
