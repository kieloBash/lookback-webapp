import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const domain = process.env.NEXT_PUBLIC_APP_URL;

const APP_NAME = process.env.APP_NAME;

export const sendInventoryNotification = async (
  email: string,
  items: { name: string; sku: string; quantity: number }[]
) => {
  const itemsList = items
    .map(
      (item) =>
        `<li>${item.name} (${item.sku}) - Quantity: ${item.quantity}</li>`
    )
    .join("");

  await resend.emails.send({
    from: `${APP_NAME} <onboarding@resend.dev>`,
    to: [email],
    subject: `${APP_NAME}: Inventory Restock Notification!`,
    html: `<p>
      <h1>Inventory Restock Notification</h1>
      <ul>${itemsList}</ul>
    </p>`,
  });
};

export const sendVerificationEmail = async (email: string, token: string) => {
  const confirmLink = `${domain}/auth/new-verification?token=${token}`;

  await resend.emails.send({
    from: `${APP_NAME} <onboarding@resend.dev>`,
    to: [email],
    subject: `${APP_NAME}: Confirm your email!`,
    html: `<p><a href="${confirmLink}">Click</a> to confirm email.</p>`,
  });
};

export const sendForgotPasswordEmail = async (email: string, token: string) => {
  const resetLink = `${domain}/auth/new-password?token=${token}`;

  await resend.emails.send({
    from: "resetpassword@purrfect.isproj.org",
    to: email,
    subject: "PURRFECT: Forgot password!",
    html: `<p><a href="${resetLink}">Click</a> to reset password.</p>`,
  });
};

export const sendContactUs = async (
  email: string,
  name: string,
  message: string,
  phone: string
) => {
  await resend.emails.send({
    from: "inquiries@purrfect.isproj.org",
    to: email,
    subject: "PURRFECT: Inquiries",
    html: `
    <h2>Hello we have received your inquiry!</h2>
    <p>
      Name: ${name}<br/>
      Contact Number: +63${phone}<br/>
      Email: ${email}<br/>
      Message: ${message}<br/>
    </p>
    <h3>Thanks for your feedback!</h3>
    `,
  });
  await resend.emails.send({
    from: "inquiries@purrfect.isproj.org",
    to: process.env.RESEND_EMAIL ?? "",
    subject: "PURRFECT INQUIRY",
    html: `
    <h2>An inquiry made this ${new Date().toLocaleDateString()}</h2>
    <p>
      Name: ${name}<br/>
      Contact Number: +63${phone}<br/>
      Email: ${email}<br/>
      Message: ${message}<br/>
    </p>
    `,
  });
};
