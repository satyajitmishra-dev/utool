import { Resend } from "resend";

// We initialize Resend lazily or conditionally to avoid build errors if env var is missing
const getResendClient = () => {
  return new Resend(process.env.RESEND_API_KEY || "dummy_key");
};

interface SendMailParams {
  to: string;
  subject: string;
  html: string;
  replyTo?: string;
}

export async function sendEmail({ to, subject, html, replyTo }: SendMailParams) {
  const apiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.RESEND_FROM_EMAIL || "support@utool.in";
  const fromName = process.env.RESEND_FROM_NAME || "Utool Workspace";

  if (!apiKey) {
    console.warn(
      `[Email Service] RESEND_API_KEY is not defined. Email simulation logged below:\n` +
      `--------------------------------------------------\n` +
      `TO: ${to}\n` +
      `SUBJECT: ${subject}\n` +
      `REPLY-TO: ${replyTo || "none"}\n` +
      `BODY: (HTML omitted for brevity, inspect programmatically)\n` +
      `--------------------------------------------------`
    );
    return { success: true, simulated: true };
  }

  try {
    const resend = getResendClient();
    const { data, error } = await resend.emails.send({
      from: `${fromName} <${fromEmail}>`,
      to: [to],
      subject,
      html,
      replyTo: replyTo,
    });

    if (error) {
      console.error("[Email Service] Resend API error:", error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error("[Email Service] Failed to send email via Resend:", error);
    return { success: false, error };
  }
}

/**
 * Generates the wrapper shell for premium emails
 */
function getEmailWrapper(contentHtml: string) {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Utool Workspace</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
    
    body {
      margin: 0;
      padding: 0;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      background-color: #050505;
      color: #f3f4f6;
      -webkit-font-smoothing: antialiased;
    }
    .wrapper {
      width: 100%;
      background-color: #050505;
      background-image: radial-gradient(circle at 50% 0%, rgba(99, 102, 241, 0.15) 0%, transparent 50%);
      padding: 40px 20px;
      box-sizing: border-box;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background: #0a0a0a;
      border: 1px solid #1a1a1a;
      border-radius: 24px;
      overflow: hidden;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.7);
    }
    .header-bar {
      height: 4px;
      background: linear-gradient(90deg, #6366f1, #a855f7, #ec4899);
    }
    .content {
      padding: 48px 40px 32px;
    }
    .logo {
      font-size: 24px;
      font-weight: 800;
      letter-spacing: -0.04em;
      color: #ffffff;
      text-decoration: none;
      display: inline-block;
      margin-bottom: 32px;
    }
    .logo span {
      background: linear-gradient(135deg, #818cf8, #c084fc);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    h1 {
      font-size: 26px;
      font-weight: 700;
      letter-spacing: -0.03em;
      color: #ffffff;
      margin-top: 0;
      margin-bottom: 24px;
      line-height: 1.2;
    }
    p {
      font-size: 16px;
      line-height: 1.6;
      color: #a1a1aa;
      margin-top: 0;
      margin-bottom: 24px;
    }
    .card {
      background: linear-gradient(180deg, #121212 0%, #0d0d0d 100%);
      border: 1px solid #222222;
      border-radius: 16px;
      padding: 28px;
      margin-bottom: 32px;
      box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.05);
    }
    .meta-grid {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 20px;
    }
    .meta-grid td {
      padding: 10px 0;
      font-size: 14px;
      vertical-align: top;
      border-bottom: 1px solid #1a1a1a;
    }
    .meta-grid tr:last-child td {
      border-bottom: none;
    }
    .meta-label {
      color: #71717a;
      width: 120px;
      font-weight: 500;
    }
    .meta-value {
      color: #e4e4e7;
      font-weight: 500;
    }
    .badge {
      display: inline-block;
      padding: 4px 10px;
      font-size: 12px;
      font-weight: 600;
      border-radius: 20px;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    .badge-open { background: rgba(99, 102, 241, 0.1); color: #818cf8; border: 1px solid rgba(99, 102, 241, 0.2); }
    .badge-progress { background: rgba(245, 158, 11, 0.1); color: #fbbf24; border: 1px solid rgba(245, 158, 11, 0.2); }
    .badge-resolved { background: rgba(16, 185, 129, 0.1); color: #34d399; border: 1px solid rgba(16, 185, 129, 0.2); }
    
    .badge-high { background: rgba(239, 68, 68, 0.1); color: #f87171; border: 1px solid rgba(239, 68, 68, 0.2); }
    .badge-medium { background: rgba(245, 158, 11, 0.1); color: #fbbf24; border: 1px solid rgba(245, 158, 11, 0.2); }
    .badge-low { background: rgba(107, 114, 128, 0.1); color: #9ca3af; border: 1px solid rgba(107, 114, 128, 0.2); }

    .button {
      display: inline-block;
      background: #ffffff;
      color: #000000 !important;
      text-decoration: none;
      padding: 14px 28px;
      font-size: 15px;
      font-weight: 600;
      border-radius: 12px;
      transition: all 0.2s ease;
      text-align: center;
    }
    .message-box {
      background: #000000;
      border: 1px solid #222;
      border-left: 4px solid #818cf8;
      padding: 20px;
      border-radius: 8px 12px 12px 8px;
      color: #e4e4e7;
      margin: 20px 0 0 0;
      font-size: 15px;
      line-height: 1.6;
    }
    .footer {
      padding: 0 40px 48px;
      text-align: center;
      font-size: 13px;
      color: #52525b;
      border-top: 1px solid #1a1a1a;
      padding-top: 32px;
    }
    .footer a {
      color: #a1a1aa;
      text-decoration: underline;
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="container">
      <div class="header-bar"></div>
      <div class="content">
        <a href="https://utool.in" class="logo">U<span>tool</span></a>
        ${contentHtml}
      </div>
      <div class="footer">
        &copy; ${new Date().getFullYear()} Utool Workspace.<br>
        This is an automated operational notification. Need help? Contact us at <a href="mailto:support@utool.in">support@utool.in</a>.
      </div>
    </div>
  </div>
</body>
</html>
  `;
}

/**
 * Email sent to the user when a support ticket is created
 */
export async function sendTicketReceiptEmail({
  toEmail,
  toName,
  ticketId,
  subject,
  issueType,
  priority,
  message,
}: {
  toEmail: string;
  toName: string;
  ticketId: string;
  subject: string;
  issueType: string;
  priority: string;
  message: string;
}) {
  const badgeClass = `badge-${priority.toLowerCase()}`;
  const displayPriority = priority.toUpperCase();
  const dashboardUrl = `https://utool.in/dashboard/support`;

  const html = getEmailWrapper(`
    <h1>Support Ticket Received</h1>
    <p>Hi ${toName},</p>
    <p>Our support engineering team has received your ticket and we are looking into it. You will receive an email update here whenever we reply, or you can track progress directly in your support workspace.</p>
    
    <div class="card">
      <table class="meta-grid">
        <tr>
          <td class="meta-label">Ticket ID</td>
          <td class="meta-value" style="font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;">#${ticketId}</td>
        </tr>
        <tr>
          <td class="meta-label">Subject</td>
          <td class="meta-value">${subject}</td>
        </tr>
        <tr>
          <td class="meta-label">Issue Type</td>
          <td class="meta-value" style="text-transform: capitalize;">${issueType.replace("_", " ")}</td>
        </tr>
        <tr>
          <td class="meta-label">Priority</td>
          <td class="meta-value">
            <span class="badge ${badgeClass}">${displayPriority}</span>
          </td>
        </tr>
        <tr>
          <td class="meta-label">Status</td>
          <td class="meta-value">
            <span class="badge badge-open">OPEN</span>
          </td>
        </tr>
      </table>
      
      <p style="margin-bottom: 8px; margin-top: 24px; font-weight: 600; color: #ffffff; font-size: 14px;">Your Message:</p>
      <div class="message-box">${message.replace(/\n/g, "<br>")}</div>
    </div>
    
    <div style="text-align: center; margin-top: 40px; margin-bottom: 16px;">
      <a href="${dashboardUrl}" class="button">View Ticket Workspace</a>
    </div>
  `);

  return sendEmail({
    to: toEmail,
    subject: `[Support Ticket #${ticketId}] Re: ${subject}`,
    html: html,
  });
}

/**
 * Email sent when there is a new reply on a ticket
 */
export async function sendTicketReplyEmail({
  toEmail,
  toName,
  ticketId,
  subject,
  replyMessage,
  senderName,
  isAdminReply,
}: {
  toEmail: string;
  toName: string;
  ticketId: string;
  subject: string;
  replyMessage: string;
  senderName: string;
  isAdminReply: boolean;
}) {
  const dashboardUrl = `https://utool.in/dashboard/support`;
  const senderTitle = isAdminReply ? `${senderName} (Utool Support)` : senderName;

  const html = getEmailWrapper(`
    <h1>Update on Ticket #${ticketId}</h1>
    <p>Hi ${toName},</p>
    <p>A new reply has been added to your support ticket regarding <strong>${subject}</strong>.</p>
    
    <div class="card">
      <p style="margin-bottom: 8px; font-weight: 600; color: #ffffff; font-size: 14px;">Reply from ${senderTitle}:</p>
      <div class="message-box" style="border-left-color: ${isAdminReply ? "#a855f7" : "#10b981"}; background: #000;">
        ${replyMessage.replace(/\n/g, "<br>")}
      </div>
    </div>
    
    <p>To reply to this message, please visit your support workspace. For security and tracking, direct email replies are not monitored.</p>
    
    <div style="text-align: center; margin-top: 40px; margin-bottom: 16px;">
      <a href="${dashboardUrl}" class="button">Open Workspace</a>
    </div>
  `);

  return sendEmail({
    to: toEmail,
    subject: `[Support Ticket #${ticketId}] New Reply: ${subject}`,
    html: html,
  });
}

/**
 * Admin Notification Email for new tickets
 */
export async function sendAdminNotificationEmail({
  ticketId,
  clientName,
  clientEmail,
  subject,
  issueType,
  priority,
  message,
}: {
  ticketId: string;
  clientName: string;
  clientEmail: string;
  subject: string;
  issueType: string;
  priority: string;
  message: string;
}) {
  const badgeClass = `badge-${priority.toLowerCase()}`;
  const adminEmail = process.env.ADMIN_NOTIFY_EMAIL || "support@utool.in";
  const adminUrl = `https://utool.in/admin/support`;

  const html = getEmailWrapper(`
    <h1>🚨 New Ticket Submitted</h1>
    <p>A workspace client has submitted a new support ticket.</p>
    
    <div class="card">
      <table class="meta-grid">
        <tr>
          <td class="meta-label">Ticket ID</td>
          <td class="meta-value" style="font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;">#${ticketId}</td>
        </tr>
        <tr>
          <td class="meta-label">From</td>
          <td class="meta-value">${clientName} (${clientEmail})</td>
        </tr>
        <tr>
          <td class="meta-label">Subject</td>
          <td class="meta-value">${subject}</td>
        </tr>
        <tr>
          <td class="meta-label">Issue Type</td>
          <td class="meta-value" style="text-transform: capitalize;">${issueType.replace("_", " ")}</td>
        </tr>
        <tr>
          <td class="meta-label">Priority</td>
          <td class="meta-value">
            <span class="badge ${badgeClass}">${priority.toUpperCase()}</span>
          </td>
        </tr>
      </table>
      
      <p style="margin-bottom: 8px; margin-top: 24px; font-weight: 600; color: #ffffff; font-size: 14px;">Message Content:</p>
      <div class="message-box">${message.replace(/\n/g, "<br>")}</div>
    </div>
    
    <div style="text-align: center; margin-top: 40px; margin-bottom: 16px;">
      <a href="${adminUrl}" class="button">Open Admin Panel</a>
    </div>
  `);

  return sendEmail({
    to: adminEmail,
    subject: `🚨 [NEW TICKET] #${ticketId} (${priority.toUpperCase()}) - ${subject}`,
    html: html,
    replyTo: clientEmail,
  });
}

/**
 * Email sent to the user when they submit a feature request / feedback
 */
export async function sendFeedbackReceiptEmail({
  toEmail,
  toName,
  featureName,
}: {
  toEmail: string;
  toName: string;
  featureName: string;
}) {
  const dashboardUrl = `https://utool.in/tools`;

  const html = getEmailWrapper(`
    <h1>Thanks for your feedback!</h1>
    <p>Hi ${toName},</p>
    <p>We've successfully received your feature request for <strong>${featureName}</strong>.</p>
    
    <div class="card">
      <p style="margin-bottom: 8px; font-weight: 600; color: #ffffff; font-size: 14px;">What happens next?</p>
      <p style="margin: 0; font-size: 15px; color: #a1a1aa; line-height: 1.6;">
        Our product team reviews every single request. If your idea gathers enough community upvotes or aligns with our roadmap, we'll build it. Utool grows based on what you need.
      </p>
    </div>
    
    <div style="text-align: center; margin-top: 40px; margin-bottom: 16px;">
      <a href="${dashboardUrl}" class="button">Explore Tools</a>
    </div>
  `);

  return sendEmail({
    to: toEmail,
    subject: `We got your feature request: ${featureName}`,
    html: html,
  });
}
