import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async (req) => {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  let email, message;
  try {
    ({ email, message } = await req.json());
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid request body' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  if (!email || !message) {
    return new Response(JSON.stringify({ error: 'Email and message are required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return new Response(JSON.stringify({ error: 'Invalid email address' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    console.log('[contact] Attempting to send email', { to: 'will@imbashardtech.com', from: 'hello@imbashardtech.com', replyTo: email });

    const result = await resend.emails.send({
      from: 'hello@imbashardtech.com',
      to: 'will@imbashardtech.com',
      subject: `New inquiry from ${email}`,
      html: `<p><strong>Email:</strong> ${email}</p><p><strong>Message:</strong><br>${message}</p>`
    });

    console.log('[contact] Resend response:', JSON.stringify(result));

    if (result.error) {
      console.error('[contact] Resend returned an error:', JSON.stringify(result.error));
      return new Response(JSON.stringify({ error: 'Failed to send email' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err) {
    console.error('[contact] Unexpected error:', err.message, err.stack);
    return new Response(JSON.stringify({ error: 'Failed to send email' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

export const config = {
  path: '/api/contact'
};