export type UserTier = 'Guest' | 'Free' | 'Pro' | 'Admin';

export type TicketCategory = 
  | 'General'
  | 'Billing'
  | 'Bug Report'
  | 'Feature Request'
  | 'Conversion Failed';

export type TicketStatus = 'Open' | 'Investigating' | 'Waiting for User' | 'Resolved' | 'Closed';

export type TicketPriority = 'Low' | 'Medium' | 'High' | 'Critical';

export interface SupportTicket {
  id: string;
  userId: string | null;
  email: string | null;
  name?: string | null;
  screenshotUrl?: string | null;
  tier: UserTier;
  category: TicketCategory;
  status: TicketStatus;
  priority: TicketPriority;
  subject: string;
  toolSlug?: string;
  metadata?: {
    browser?: string;
    os?: string;
    conversionId?: string;
    inputFormat?: string;
    outputFormat?: string;
    screenResolution?: string;
    url?: string;
    errorLogs?: string;
  };
  createdAt: number;
  updatedAt: number;
  assignedAgentId?: string;
  unreadCount?: number;
}

export interface TicketMessage {
  id: string;
  ticketId: string;
  senderId: string | 'AI';
  senderRole: 'User' | 'Agent' | 'AI';
  message: string;
  attachments?: string[];
  isPrivateNote?: boolean;
  createdAt: number;
}

export interface ToolReview {
  id: string;
  toolSlug: string;
  userId: string | null;
  isGuest: boolean;
  rating: number;
  reviewText?: string;
  recommend: boolean;
  screenshots?: string[];
  status: 'pending' | 'published' | 'rejected';
  createdAt: number;
}
