import { NextRequest, NextResponse } from "next/server";
import { SupportServerService } from "@/modules/support/server/support-service";
import { adminAuth, adminDb } from "@/lib/firebase-admin";
import { sendTicketReplyEmail } from "@/lib/email";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { ticketId, message, attachments, isPrivateNote, email } = body;

    const authHeader = req.headers.get('authorization');
    const token = authHeader?.split('Bearer ')[1];
    let session: any = null;
    
    if (token) {
      try {
        session = await adminAuth.verifyIdToken(token);
      } catch (e) {
        console.warn("Invalid token for support message");
      }
    }

    const userId = session?.uid || 'guest';
    const role = session?.tier === 'Admin' ? 'Agent' : 'User';

    if (!ticketId || !message) {
      return NextResponse.json({ error: "Ticket ID and message are required." }, { status: 400 });
    }

    const ticketRef = adminDb.collection("supportTickets").doc(ticketId);
    const ticketDoc = await ticketRef.get();
    if (!ticketDoc.exists) {
      return NextResponse.json({ error: "Ticket not found." }, { status: 404 });
    }
    const ticketData = ticketDoc.data()!;

    // Add message
    const ticketMessage = await SupportServerService.addMessage(
      ticketId,
      userId,
      role,
      message,
      attachments,
      isPrivateNote && role === 'Agent' // only agents can add private notes
    );

    // If it's not a private note, handle email notifications and status updates
    if (!isPrivateNote) {
      if (role === 'Agent') {
        let newStatus = ticketData.status;
        if (ticketData.status === 'Open' || ticketData.status === 'Waiting for User') {
          newStatus = 'Investigating';
        }
        await ticketRef.update({
          status: newStatus,
          updatedAt: Date.now()
        });

        try {
          await sendTicketReplyEmail({
            toEmail: ticketData.email || email,
            toName: ticketData.name || "Client",
            ticketId,
            subject: ticketData.subject,
            replyMessage: message.trim(),
            senderName: session?.name || "Utool Support Team",
            isAdminReply: true,
          });
        } catch (emailErr) {
          console.error("Failed to send reply email to user:", emailErr);
        }
      } else {
        let newStatus = ticketData.status;
        if (ticketData.status === 'Resolved' || ticketData.status === 'Closed') {
          newStatus = 'Open';
        }
        await ticketRef.update({
          status: newStatus,
          updatedAt: Date.now()
        });

        try {
          const adminEmail = process.env.ADMIN_NOTIFY_EMAIL || process.env.ADMIN_MAIL || "support@utool.in";
          await sendTicketReplyEmail({
            toEmail: adminEmail,
            toName: "Utool Admin",
            ticketId,
            subject: ticketData.subject,
            replyMessage: message.trim(),
            senderName: ticketData.name || ticketData.email || "User",
            isAdminReply: false,
          });
        } catch (emailErr) {
          console.error("Failed to send reply email to admin:", emailErr);
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: ticketMessage
    });
  } catch (error: any) {
    console.error("Support message creation error:", error);
    return NextResponse.json(
      { error: "Internal server error while sending message" },
      { status: 500 }
    );
  }
}
