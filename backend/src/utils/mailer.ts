import nodemailer from 'nodemailer';

const SMTP_USER = process.env.SMTP_USER || 'gruhani214@gmail.com';
const SMTP_PASS = process.env.SMTP_PASS || 'mock_pass';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false,
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASS,
  },
});

const FROM_EMAIL = 'gruhani214@gmail.com';

const isMockSmtp = !SMTP_PASS || SMTP_PASS === 'mock_pass';

export async function sendOtpEmailHtml(toEmail: string, otp: string, orderId: string): Promise<boolean> {
  console.log(`\n📧 [EMAIL OTP SIMULATOR] Order #${orderId} OTP for ${toEmail}: 👉 ${otp} 👈\n`);

  if (isMockSmtp) {
    return true;
  }

  try {
    const htmlContent = `
      <div style='font-family:Arial; max-width:500px; margin:auto;'>
        <h2 style='color:#e91e63;'>Gruhani 🛒</h2>
        <p>Your OTP for <b>Order #${orderId}</b> is:</p>
        <div style='font-size:32px; font-weight:bold; color:#333; letter-spacing:8px; padding:20px; background:#f5f5f5; text-align:center; border-radius:8px;'>
          ${otp}
        </div>
        <p style='color:#888; font-size:12px;'>Valid for 5 days till order delivery | for reset password valid for 10 minutes. Do not share.</p>
      </div>
    `;

    await transporter.sendMail({
      from: FROM_EMAIL,
      to: toEmail,
      subject: `Gruhani Order OTP - #${orderId}`,
      html: htmlContent,
    });
    return true;
  } catch (error) {
    console.warn('SMTP Mail delivery skipped (using simulated console log above):', (error as any)?.message);
    return true;
  }
}

export async function sendForgotPasswordOtp(toEmail: string, name: string, otp: string): Promise<boolean> {
  console.log(`\n📧 [EMAIL OTP SIMULATOR] Forgot Password OTP for ${name} (${toEmail}): 👉 ${otp} 👈\n`);

  if (isMockSmtp) {
    return true;
  }

  try {
    const htmlContent = `
      <div style='font-family:Arial; max-width:500px; margin:auto;'>
        <h2 style='color:#e91e63;'>Gruhani 🛒</h2>
        <p>Hi <b>${name}</b>,</p>
        <p>Your OTP to reset your password is:</p>
        <div style='font-size:32px; font-weight:bold; color:#333; letter-spacing:8px; padding:20px; background:#f5f5f5; text-align:center; border-radius:8px;'>
          ${otp}
        </div>
        <p style='color:#888; font-size:12px; margin-top:16px;'>Valid for 10 minutes. Do not share with anyone.</p>
        <p>Team Gruhani</p>
      </div>
    `;

    await transporter.sendMail({
      from: FROM_EMAIL,
      to: toEmail,
      subject: 'Gruhani - Password Reset OTP 🔐',
      html: htmlContent,
    });
    return true;
  } catch (error) {
    console.warn('SMTP Mail delivery skipped (using simulated console log above):', (error as any)?.message);
    return true;
  }
}

export async function sendSellerOrderUpdateEmail(toEmail: string, sellerName: string, orderId: string, status: string): Promise<boolean> {
  console.log(`\n📧 [SELLER EMAIL SIMULATOR] Order #${orderId} update to ${status} sent to ${sellerName} (${toEmail})\n`);

  if (isMockSmtp) {
    return true;
  }

  try {
    const htmlContent = `
      <div style='font-family:Arial; max-width:500px; margin:auto;'>
        <h2 style='color:#4CAF50;'>Gruhani Seller Panel 🏪</h2>
        <p>Hi <b>${sellerName}</b>,</p>
        <p>Order #${orderId} status has been updated to: ${status}</p>
        <div style='padding:16px; background:#f5f5f5; border-radius:8px;'>
          <b>Order ID:</b> #${orderId}
        </div>
        <p style='color:#888; font-size:12px; margin-top:16px;'>Manage your orders from the dashboard.</p>
        <p>Team Gruhani</p>
      </div>
    `;

    await transporter.sendMail({
      from: FROM_EMAIL,
      to: toEmail,
      subject: `Order Update #${orderId}`,
      html: htmlContent,
    });
    return true;
  } catch (error) {
    console.warn('Seller email delivery skipped:', (error as any)?.message);
    return true;
  }
}
