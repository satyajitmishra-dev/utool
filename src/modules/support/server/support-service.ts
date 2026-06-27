import { adminDb } from "@/lib/firebase-admin";
import { SupportTicket, TicketMessage } from "../types";
import { v4 as uuidv4 } from "uuid";

const TICKETS_COLLECTION = "supportTickets";
const MESSAGES_COLLECTION = "ticketMessages";

export class SupportServerService {
  /**
   * Create a new support ticket (conversation)
   */
  static async createTicket(
    data: Omit<SupportTicket, 'id' | 'createdAt' | 'updatedAt' | 'status'>
  ): Promise<SupportTicket> {
    const id = uuidv4();
    const now = Date.now();
    
    const ticket: SupportTicket = {
      ...data,
      id,
      status: 'Open',
      createdAt: now,
      updatedAt: now,
    };

    await adminDb.collection(TICKETS_COLLECTION).doc(id).set(ticket);
    return ticket;
  }

  /**
   * Add a message to an existing ticket
   */
  static async addMessage(
    ticketId: string,
    senderId: string | 'AI',
    senderRole: 'User' | 'Agent' | 'AI',
    message: string,
    attachments?: string[],
    isPrivateNote = false
  ): Promise<TicketMessage> {
    const id = uuidv4();
    const now = Date.now();

    const ticketMessage: TicketMessage = {
      id,
      ticketId,
      senderId,
      senderRole,
      message,
      attachments: attachments || [],
      isPrivateNote,
      createdAt: now,
    };

    await adminDb.collection(MESSAGES_COLLECTION).doc(id).set(ticketMessage);
    
    // Update the ticket's updatedAt timestamp
    await adminDb.collection(TICKETS_COLLECTION).doc(ticketId).update({
      updatedAt: now
    });

    return ticketMessage;
  }

  /**
   * Fetch tickets for a user
   */
  static async getUserTickets(userId: string): Promise<SupportTicket[]> {
    const snapshot = await adminDb
      .collection(TICKETS_COLLECTION)
      .where("userId", "==", userId)
      .orderBy("updatedAt", "desc")
      .get();

    return snapshot.docs.map(doc => doc.data() as SupportTicket);
  }

  /**
   * Fetch messages for a ticket
   */
  static async getTicketMessages(ticketId: string): Promise<TicketMessage[]> {
    const snapshot = await adminDb
      .collection(MESSAGES_COLLECTION)
      .where("ticketId", "==", ticketId)
      .orderBy("createdAt", "asc")
      .get();

    return snapshot.docs.map(doc => doc.data() as TicketMessage);
  }
}
