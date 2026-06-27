import { get, set, del } from "idb-keyval";

export interface HandoffFile {
  name: string;
  type: string;
  data: ArrayBuffer;
}

export async function setHandoffFile(name: string, type: string, data: ArrayBuffer): Promise<void> {
  try {
    await set("utool_handoff_file", { name, type, data });
  } catch (error) {
    console.error("Failed to set handoff file in IndexedDB", error);
  }
}

export async function getHandoffFile(): Promise<File | null> {
  try {
    const handoff = await get<HandoffFile>("utool_handoff_file");
    if (!handoff) return null;
    
    // Convert ArrayBuffer back to a browser File object
    const blob = new Blob([handoff.data], { type: handoff.type });
    return new File([blob], handoff.name, { type: handoff.type });
  } catch (error) {
    console.error("Failed to get handoff file from IndexedDB", error);
    return null;
  }
}

export async function clearHandoffFile(): Promise<void> {
  try {
    await del("utool_handoff_file");
  } catch (error) {
    console.error("Failed to clear handoff file in IndexedDB", error);
  }
}
