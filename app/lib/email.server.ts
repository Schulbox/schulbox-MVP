// app/lib/email.server.ts
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendMail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) {
  await resend.emails.send({
    from: "Schulbox <noreply@schulbox.at>", // nur mit verified Domain
    to,
    subject,
    html,
  });
}
