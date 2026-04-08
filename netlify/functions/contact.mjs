import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async (req) => {
  const { email, message } = await req.json();

  await resend.emails.send({
    from: 'contact@imbashardtech.com',
    to: 'will@imbashardtech.com',
    subject: `New inquiry from ${email}`,
    html: `<p><strong>Email:</strong> ${email}</p><p><strong>Message:</strong><br>${message}</p>`
  });

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
};

export const config = {
  path: '/api/contact'
};