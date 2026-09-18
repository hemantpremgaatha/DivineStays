import "server-only";

type NewLeadNotification = {
  name: string;
  phone: string;
  propertyName: string;
  budgetBand: string | null;
  roomType: string | null;
  institute: string | null;
  moveInDate: string | null;
  source: string;
};

function formatLeadEmail(lead: NewLeadNotification): { subject: string; text: string } {
  const subject = `New lead: ${lead.name} — ${lead.propertyName}`;
  const lines = [
    `Name: ${lead.name}`,
    `Phone: ${lead.phone}`,
    `Property: ${lead.propertyName}`,
    `Budget: ${lead.budgetBand ?? "Not specified"}`,
    `Room type: ${lead.roomType ?? "Not specified"}`,
    `Institute: ${lead.institute ?? "Not specified"}`,
    `Move-in date: ${lead.moveInDate ?? "Not specified"}`,
    `Source: ${lead.source}`,
    "",
    "Open the admin dashboard to update this lead's status.",
  ];
  return { subject, text: lines.join("\n") };
}

// Fire-and-forget: a lead must save even if notification delivery fails or isn't configured.
export function notifyNewLead(lead: NewLeadNotification): void {
  sendLeadEmail(lead).catch((err) => {
    console.error("Failed to send lead notification email:", err);
  });
}

async function sendLeadEmail(lead: NewLeadNotification): Promise<void> {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const to = process.env.ADMIN_NOTIFY_EMAIL;

  if (!host || !user || !pass || !to) {
    console.warn("Lead notification email skipped: SMTP_HOST/SMTP_USER/SMTP_PASS/ADMIN_NOTIFY_EMAIL not fully configured.");
    return;
  }

  const nodemailer = await import("nodemailer");
  const port = Number(process.env.SMTP_PORT ?? "465");
  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });

  const { subject, text } = formatLeadEmail(lead);
  await transporter.sendMail({
    from: `DivineStays <${user}>`,
    to,
    subject,
    text,
  });
}
