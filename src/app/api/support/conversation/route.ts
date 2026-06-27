import { NextRequest, NextResponse } from "next/server";
import { SupportServerService } from "@/modules/support/server/support-service";
import { adminAuth } from "@/lib/firebase-admin";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { category, subject, message, toolSlug, metadata, email, isGuest } = body;

    const authHeader = req.headers.get('authorization');
    const token = authHeader?.split('Bearer ')[1];
    let session: any = null;
    
    if (token) {
      try {
        session = await adminAuth.verifyIdToken(token);
      } catch (e) {
        console.warn("Invalid token for support ticket");
      }
    }

    const userId = session?.uid || null;
    const userEmail = session?.email || email || null;
    const tier = session?.tier || (isGuest ? 'Guest' : 'Free'); 
    const priority = tier === 'Pro' ? 'High' : 'Medium';


    const cleanMetadata = metadata ? Object.fromEntries(Object.entries(metadata).filter(([_, v]) => v !== undefined)) : null;

    // 1. Create the Support Ticket (Conversation)
    const ticketData: any = {
      userId,
      email: userEmail,
      tier,
      category,
      priority,
      subject,
    };
    
    if (toolSlug) ticketData.toolSlug = toolSlug;
    if (cleanMetadata) ticketData.metadata = cleanMetadata;

    const ticket = await SupportServerService.createTicket(ticketData);

    // 2. Add the initial message to the conversation
    const ticketMessage = await SupportServerService.addMessage(
      ticket.id,
      userId || 'guest',
      'User',
      message
    );

    return NextResponse.json({
      success: true,
      ticket,
      message: ticketMessage
    });
  } catch (error: any) {
    console.error("Support conversation creation error:", error);
    return NextResponse.json(
      { error: "Internal server error while creating conversation" },
      { status: 500 }
    );
  }
}
