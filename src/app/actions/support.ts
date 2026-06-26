"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { adminDb, adminAuth } from "@/lib/firebase-admin";
import { getAuthUser } from "@/lib/auth-server";
import { FieldValue } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";
import {
  sendTicketReceiptEmail,
  sendAdminNotificationEmail,
  sendTicketReplyEmail,
  sendFeedbackReceiptEmail,
} from "@/lib/email";

// Helper to check if user is an admin
export async function isAdmin(uid: string): Promise<boolean> {
  if (!uid) return false;

  try {
    const userRecord = await adminAuth.getUser(uid);
    if (userRecord.email && userRecord.email.toLowerCase() === "satyajitmishra1412@gmail.com") {
      return true;
    }
  } catch (err) {
    console.error("[Auth Admin check] Auth error:", err);
  }

  return false;
}

// Helper to upload screenshots to Firebase Storage
async function uploadScreenshot(file: File | null): Promise<string> {
  if (!file || file.size === 0) return "";
  try {
    const bucket = getStorage().bucket();
    const uniqueId = Math.random().toString(36).substring(2, 11);
    const filename = `support_screenshots/${Date.now()}_${uniqueId}_${file.name.replace(/[^a-zA-Z0-9.]/g, "_")}`;
    const fileRef = bucket.file(filename);

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    await fileRef.save(buffer, {
      metadata: {
        contentType: file.type,
      },
    });

    // Make the file publicly readable or get long-lived signed URL
    const [signedUrl] = await fileRef.getSignedUrl({
      action: "read",
      expires: "03-09-2491", // Far future (year 2491)
    });

    return signedUrl;
  } catch (error) {
    console.error("[Upload Screenshot] Failed to upload to Storage:", error);
    // Return a mock placeholder URL if storage isn't initialized or failed
    return "";
  }
}

// ==========================================
// 1. REVIEW SYSTEM ACTIONS
// ==========================================

const reviewSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(50),
  email: z.string().email("Invalid email address"),
  rating: z.coerce.number().min(1).max(5),
  message: z.string().min(5, "Message must be at least 5 characters").max(2000),
  toolSlug: z.string().min(1, "Tool slug is required"),
});

export async function submitReviewAction(prevState: any, formData: FormData) {
  try {
    const rawData = {
      name: formData.get("name"),
      email: formData.get("email"),
      rating: formData.get("rating"),
      message: formData.get("message"),
      toolSlug: formData.get("toolSlug"),
    };

    const validated = reviewSchema.parse(rawData);
    const user = await getAuthUser();
    const screenshotFile = formData.get("screenshot") as File | null;

    let screenshotUrl = "";
    if (screenshotFile && screenshotFile.size > 0) {
      screenshotUrl = await uploadScreenshot(screenshotFile);
    }

    const reviewId = adminDb.collection("reviews").doc().id;
    const reviewData: Record<string, any> = {
      name: validated.name,
      email: validated.email,
      rating: validated.rating,
      message: validated.message,
      toolSlug: validated.toolSlug,
      createdAt: FieldValue.serverTimestamp(),
    };

    if (user) {
      reviewData.uid = user.uid;
      reviewData.photoURL = user.picture || null;
    }

    if (screenshotUrl) {
      reviewData.screenshotUrl = screenshotUrl;
    }

    // Save under reviews/ collection
    await adminDb.collection("reviews").doc(reviewId).set(reviewData);

    revalidatePath(`/tools/${validated.toolSlug}`);
    return { success: true, message: "Thank you! Your review has been submitted." };
  } catch (error) {
    console.error("[Review Action Error]:", error);
    if (error instanceof z.ZodError) {
      return { success: false, error: (error as any).errors[0].message };
    }
    return { success: false, error: "An unexpected error occurred. Please try again." };
  }
}

// ==========================================
// 2. SUPPORT TICKET SYSTEM ACTIONS
// ==========================================

const ticketSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(50),
  email: z.string().email("Invalid email address"),
  toolSlug: z.string().optional(),
  issueType: z.enum(["bug_report", "billing", "feature_request", "tool_error", "general"]),
  subject: z.string().min(4, "Subject must be at least 4 characters").max(150),
  message: z.string().min(10, "Message must be at least 10 characters").max(5000),
  priority: z.enum(["low", "medium", "high"]),
});

export async function submitTicketAction(prevState: any, formData: FormData) {
  try {
    const rawData = {
      name: formData.get("name"),
      email: formData.get("email"),
      toolSlug: formData.get("toolSlug") || undefined,
      issueType: formData.get("issueType"),
      subject: formData.get("subject"),
      message: formData.get("message"),
      priority: formData.get("priority"),
    };

    const validated = ticketSchema.parse(rawData);
    const user = await getAuthUser();
    const screenshotFile = formData.get("screenshot") as File | null;

    let screenshotUrl = "";
    if (screenshotFile && screenshotFile.size > 0) {
      screenshotUrl = await uploadScreenshot(screenshotFile);
    }

    const ticketId = adminDb.collection("support_tickets").doc().id;
    const ticketData: Record<string, any> = {
      uid: user?.uid || null,
      name: validated.name,
      email: validated.email,
      toolSlug: validated.toolSlug || null,
      issueType: validated.issueType,
      subject: validated.subject,
      message: validated.message,
      screenshotUrl: screenshotUrl || null,
      priority: validated.priority,
      status: "open",
      createdAt: FieldValue.serverTimestamp(),
      replies: [],
      timeline: [
        {
          id: `created-${Date.now()}`,
          type: "created",
          actorName: validated.name,
          actorRole: "user",
          message: "created the ticket",
          createdAt: new Date().toISOString(),
        }
      ],
    };

    await adminDb.collection("support_tickets").doc(ticketId).set(ticketData);

    // Send Receipt Email to User
    await sendTicketReceiptEmail({
      toEmail: validated.email,
      toName: validated.name,
      ticketId,
      subject: validated.subject,
      issueType: validated.issueType,
      priority: validated.priority,
      message: validated.message,
    });

    // Notify Admins
    await sendAdminNotificationEmail({
      ticketId,
      clientName: validated.name,
      clientEmail: validated.email,
      subject: validated.subject,
      issueType: validated.issueType,
      priority: validated.priority,
      message: validated.message,
    });

    revalidatePath("/dashboard/support");
    return { success: true, ticketId, message: "Support ticket created successfully!" };
  } catch (error) {
    console.error("[Ticket Action Error]:", error);
    if (error instanceof z.ZodError) {
      return { success: false, error: (error as any).errors[0].message };
    }
    return { success: false, error: "An unexpected error occurred. Please try again." };
  }
}

// ==========================================
// 3. TICKET REPLY ACTIONS
// ==========================================

export async function replyToTicketAction(ticketId: string, replyMessage: string) {
  try {
    if (!replyMessage || replyMessage.trim().length < 2) {
      return { success: false, error: "Reply message must be at least 2 characters." };
    }

    const user = await getAuthUser();
    if (!user) {
      return { success: false, error: "You must be logged in to reply." };
    }

    const ticketRef = adminDb.collection("support_tickets").doc(ticketId);
    const ticketDoc = await ticketRef.get();

    if (!ticketDoc.exists) {
      return { success: false, error: "Ticket not found." };
    }

    const ticketData = ticketDoc.data()!;
    const userIsAdmin = await isAdmin(user.uid);

    // Enforce authorization: user must own the ticket or be admin
    if (ticketData.uid !== user.uid && !userIsAdmin) {
      return { success: false, error: "Unauthorized." };
    }

    const newReply = {
      senderId: user.uid,
      senderName: user.name || user.email || "User",
      senderEmail: user.email || "",
      message: replyMessage.trim(),
      isAdmin: userIsAdmin,
      createdAt: new Date().toISOString(), // Use ISO string for serializable timeline array
    };

    const newEvent = {
      id: `reply-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      type: "reply",
      actorName: user.name || user.email || (userIsAdmin ? "Support Agent" : "User"),
      actorRole: userIsAdmin ? "admin" : "user",
      message: replyMessage.trim(),
      createdAt: new Date().toISOString(),
    };

    // Update Firestore array and flip status if user replies to resolved
    const updateData: Record<string, any> = {
      replies: FieldValue.arrayUnion(newReply),
      timeline: FieldValue.arrayUnion(newEvent),
    };

    if (userIsAdmin && ticketData.status === "open") {
      updateData.status = "in_progress";
      const progressEvent = {
        id: `status-${Date.now()}-inprogress`,
        type: "status_change",
        actorName: user.name || "Support System",
        actorRole: "admin",
        message: "changed status to in progress",
        createdAt: new Date().toISOString(),
      };
      updateData.timeline = FieldValue.arrayUnion(newEvent, progressEvent);
    } else if (!userIsAdmin && ticketData.status === "resolved") {
      updateData.status = "open"; // Reopen if user posts a reply
      const reopenEvent = {
        id: `status-${Date.now()}-open`,
        type: "status_change",
        actorName: user.name || user.email || "User",
        actorRole: "user",
        message: "reopened the ticket",
        createdAt: new Date().toISOString(),
      };
      updateData.timeline = FieldValue.arrayUnion(newEvent, reopenEvent);
    }

    await ticketRef.update(updateData);

    // Send Email Notifications
    if (userIsAdmin) {
      // Notify the client
      await sendTicketReplyEmail({
        toEmail: ticketData.email,
        toName: ticketData.name,
        ticketId,
        subject: ticketData.subject,
        replyMessage: replyMessage.trim(),
        senderName: user.name || "Utool Support Team",
        isAdminReply: true,
      });
    } else {
      // Notify admin
      const adminEmail = process.env.ADMIN_NOTIFY_EMAIL || "support@utool.in";
      await sendTicketReplyEmail({
        toEmail: adminEmail,
        toName: "Utool Admin",
        ticketId,
        subject: ticketData.subject,
        replyMessage: replyMessage.trim(),
        senderName: ticketData.name,
        isAdminReply: false,
      });
    }

    revalidatePath("/dashboard/support");
    revalidatePath("/admin/support");
    return { success: true, message: "Reply posted successfully!" };
  } catch (error) {
    console.error("[Ticket Reply Action Error]:", error);
    return { success: false, error: "Failed to post reply. Please try again." };
  }
}

// ==========================================
// 4. TICKET STATUS TRANSITION (ADMIN ONLY)
// ==========================================

export async function updateTicketStatusAction(ticketId: string, status: "open" | "in_progress" | "resolved") {
  try {
    const user = await getAuthUser();
    if (!user || !(await isAdmin(user.uid))) {
      return { success: false, error: "Unauthorized. Admin privileges required." };
    }

    const newEvent = {
      id: `status-${Date.now()}-${status}`,
      type: "status_change",
      actorName: user.name || "Support Lead",
      actorRole: "admin",
      message: `changed status to ${status.replace("_", " ")}`,
      createdAt: new Date().toISOString(),
    };

    await adminDb.collection("support_tickets").doc(ticketId).update({
      status,
      updatedAt: FieldValue.serverTimestamp(),
      timeline: FieldValue.arrayUnion(newEvent),
    });

    revalidatePath("/dashboard/support");
    revalidatePath("/admin/support");
    return { success: true, message: `Ticket status updated to ${status}.` };
  } catch (error) {
    console.error("[Status Update Error]:", error);
    return { success: false, error: "Failed to update ticket status." };
  }
}

// ==========================================
// 5. TOOL FEEDBACK POLL ACTIONS
// ==========================================

export async function submitFeedbackAction(toolSlug: string, response: boolean) {
  try {
    if (!toolSlug) return { success: false, error: "Tool slug is required." };

    const user = await getAuthUser();
    const feedbackId = adminDb.collection("tool_feedback").doc().id;

    await adminDb.collection("tool_feedback").doc(feedbackId).set({
      toolSlug,
      uid: user?.uid || null,
      response,
      createdAt: FieldValue.serverTimestamp(),
    });

    return { success: true, message: "Thank you for your feedback!" };
  } catch (error) {
    console.error("[Feedback Action Error]:", error);
    return { success: false, error: "Failed to submit feedback." };
  }
}

// ==========================================
// 6. FEATURE REQUEST & UPVOTE ACTIONS
// ==========================================

const featureRequestSchema = z.object({
  name: z.string().min(2, "Name is required").max(50),
  email: z.string().email("Invalid email"),
  toolName: z.string().min(2, "Requested tool name is required").max(100),
  description: z.string().min(10, "Provide a description of at least 10 characters").max(2000),
});

export async function submitFeatureRequestAction(prevState: any, formData: FormData) {
  try {
    const rawData = {
      name: formData.get("name"),
      email: formData.get("email"),
      toolName: formData.get("toolName"),
      description: formData.get("description"),
    };

    const validated = featureRequestSchema.parse(rawData);
    const user = await getAuthUser();

    const requestId = adminDb.collection("feature_requests").doc().id;
    await adminDb.collection("feature_requests").doc(requestId).set({
      uid: user?.uid || null,
      name: validated.name,
      email: validated.email,
      toolName: validated.toolName,
      description: validated.description,
      votes: 1,
      votedUids: user?.uid ? [user.uid] : [], // Pre-vote for auth user
      createdAt: FieldValue.serverTimestamp(),
    });

    // Send thank you email to the user
    await sendFeedbackReceiptEmail({
      toEmail: validated.email,
      toName: validated.name,
      featureName: validated.toolName,
    });

    revalidatePath("/tools");
    return { success: true, message: "Feature request submitted successfully!" };
  } catch (error) {
    console.error("[Feature Request Error]:", error);
    if (error instanceof z.ZodError) {
      return { success: false, error: (error as any).errors[0].message };
    }
    return { success: false, error: "Failed to submit feature request." };
  }
}

export async function voteFeatureRequestAction(requestId: string) {
  try {
    const user = await getAuthUser();
    if (!user) {
      return { success: false, error: "You must be logged in to upvote feature requests." };
    }

    const docRef = adminDb.collection("feature_requests").doc(requestId);
    const requestDoc = await docRef.get();

    if (!requestDoc.exists) {
      return { success: false, error: "Feature request not found." };
    }

    const data = requestDoc.data()!;
    const votedUids = data.votedUids || [];

    if (votedUids.includes(user.uid)) {
      return { success: false, error: "You have already upvoted this feature request." };
    }

    await docRef.update({
      votes: FieldValue.increment(1),
      votedUids: FieldValue.arrayUnion(user.uid),
    });

    return { success: true, message: "Upvoted successfully!" };
  } catch (error) {
    console.error("[Vote Feature Error]:", error);
    return { success: false, error: "Failed to process upvote." };
  }
}

// ==========================================
// 7. DELETE SPAM/TICKET ACTIONS (ADMIN ONLY)
// ==========================================

export async function deleteTicketAction(ticketId: string) {
  try {
    const user = await getAuthUser();
    if (!user || !(await isAdmin(user.uid))) {
      return { success: false, error: "Unauthorized. Admin privileges required." };
    }

    await adminDb.collection("support_tickets").doc(ticketId).delete();

    revalidatePath("/dashboard/support");
    revalidatePath("/admin/support");
    return { success: true, message: "Ticket deleted successfully." };
  } catch (error) {
    console.error("[Delete Ticket Error]:", error);
    return { success: false, error: "Failed to delete ticket." };
  }
}

// ==========================================
// 8. SYSTEM REVIEWS ACTIONS (ADMIN ONLY)
// ==========================================

export async function fetchSystemReviewsAction() {
  try {
    const user = await getAuthUser();
    if (!user || !(await isAdmin(user.uid))) {
      return { success: false, error: "Unauthorized. Admin privileges required." };
    }

    const snapshot = await adminDb
      .collection("reviews")
      .orderBy("createdAt", "desc")
      .get();

    const reviews = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        uid: data.uid || null,
        name: data.name,
        email: data.email,
        rating: data.rating,
        message: data.message,
        toolSlug: data.toolSlug,
        screenshotUrl: data.screenshotUrl || null,
        createdAt: data.createdAt ? data.createdAt.toDate().toISOString() : new Date().toISOString(),
      };
    });

    return { success: true, reviews };
  } catch (error) {
    console.error("[Fetch System Reviews Error]:", error);
    return { success: false, error: "Failed to load system reviews." };
  }
}

export async function deleteReviewAction(reviewId: string) {
  try {
    const user = await getAuthUser();
    if (!user || !(await isAdmin(user.uid))) {
      return { success: false, error: "Unauthorized. Admin privileges required." };
    }

    await adminDb.collection("reviews").doc(reviewId).delete();

    return { success: true, message: "Review deleted successfully." };
  } catch (error) {
    console.error("[Delete Review Error]:", error);
    return { success: false, error: "Failed to delete review." };
  }
}
