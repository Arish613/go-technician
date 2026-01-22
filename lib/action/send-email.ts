"use server"
import * as Brevo from "@getbrevo/brevo";

interface ComplaintFormData {
  name: string;
  email: string;
  phoneNumber: string;
  city: string;
  complaintType: string;
  bookingId: string | undefined;
  description: string;
}

interface ContactFormData {
  name: string;
  email: string;
  phoneNumber: string;
  city: string;
  service: string;
  message: string;
}

export async function sendEmailForComplaint(formData: ComplaintFormData) {
  try {
    if (
      !process.env.BREVO_API_KEY ||
      !process.env.SMTP_EMAIL ||
      !process.env.RECEIVER_MAIL
    ) {
      return {
        status: 500,
        message: "Brevo API key or SMTP email is not configured.",
      };
    }

    const senderEmail = process.env.SMTP_EMAIL;
    const receiverEmail = process.env.RECEIVER_MAIL;

    const apiInstance = new Brevo.TransactionalEmailsApi();

    apiInstance.setApiKey(
      Brevo.TransactionalEmailsApiApiKeys.apiKey,
      process.env.BREVO_API_KEY
    );
    const emailContent = `
   <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New Complaint Submission</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333333; margin: 0; padding: 0; background-color: #f4f4f4;">
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
        <tr>
            <td align="center" style="padding: 20px 0;">
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="max-width: 600px; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
                    <tr>
                        <td align="center" style="background-color: #007bff; padding: 20px; border-top-left-radius: 8px; border-top-right-radius: 8px;">
                            <h1 style="margin: 0; font-size: 22px; color: #ffffff; font-weight: bold;">
                                🔔 New Complaint Received
                            </h1>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 30px 25px;">
                            <h2 style="font-size: 18px; color: #007bff; margin-top: 0; margin-bottom: 20px; border-bottom: 1px solid #eeeeee; padding-bottom: 10px;">
                                Complaint Information
                            </h2>
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="font-size: 14px;">
                                <tr>
                                    <td style="padding: 8px 0; border-bottom: 1px dashed #e9ecef; width: 40%; font-weight: bold; color: #555555;">Name:</td>
                                    <td style="padding: 8px 0; border-bottom: 1px dashed #e9ecef; width: 60%; color: #333333; word-break: break-all;">${formData.name}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 8px 0; border-bottom: 1px dashed #e9ecef; width: 40%; font-weight: bold; color: #555555;">Email:</td>
                                    <td style="padding: 8px 0; border-bottom: 1px dashed #e9ecef; width: 60%; color: #333333; word-break: break-all;">
                                        <a href="mailto:${formData.email}" style="color: #007bff; text-decoration: none;">${formData.email}</a>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding: 8px 0; border-bottom: 1px dashed #e9ecef; width: 40%; font-weight: bold; color: #555555;">Phone:</td>
                                    <td style="padding: 8px 0; border-bottom: 1px dashed #e9ecef; width: 60%; color: #333333; word-break: break-all;">${formData.phoneNumber}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 8px 0; border-bottom: 1px dashed #e9ecef; width: 40%; font-weight: bold; color: #555555;">City:</td>
                                    <td style="padding: 8px 0; border-bottom: 1px dashed #e9ecef; width: 60%; color: #333333; word-break: break-all;">${formData.city}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 8px 0; border-bottom: 1px dashed #e9ecef; width: 40%; font-weight: bold; color: #555555;">Type:</td>
                                    <td style="padding: 8px 0; border-bottom: 1px dashed #e9ecef; width: 60%; color: #333333; word-break: break-all;">${formData.complaintType}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 8px 0; width: 40%; font-weight: bold; color: #555555;">Description:</td>
                                    <td style="padding: 8px 0; width: 60%; color: #333333; word-break: break-all;">${formData.description}</td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>`;

    const sendSmtpEmail = new Brevo.SendSmtpEmail();
    sendSmtpEmail.sender = { name: "Go Technicians", email: senderEmail };
    sendSmtpEmail.to = [{ email: receiverEmail }];
    sendSmtpEmail.subject = "Go Technicians Support - Complaint";
    sendSmtpEmail.htmlContent = emailContent;

    await apiInstance.sendTransacEmail(sendSmtpEmail);
    return { status: 200, message: "Email sent successfully" };
  } catch (error) {
    console.log("Error sending contact email:", error);
    return { status: 500, message: "Error sending email." };
  }
}

export async function sendContactFormEmail(formData: ContactFormData) {
  try {
    if (
      !process.env.BREVO_API_KEY ||
      !process.env.SMTP_EMAIL ||
      !process.env.RECEIVER_MAIL
    ) {
      return {
        status: 500,
        message: "Brevo API key or SMTP email is not configured.",
      };
    }

    const senderEmail = process.env.SMTP_EMAIL;
    const receiverEmail = process.env.RECEIVER_MAIL;

    const apiInstance = new Brevo.TransactionalEmailsApi();
    apiInstance.setApiKey(
      Brevo.TransactionalEmailsApiApiKeys.apiKey,
      process.env.BREVO_API_KEY
    );

    const emailContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New Contact Form Submission</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333333; margin: 0; padding: 0; background-color: #f4f4f4;">
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
        <tr>
            <td align="center" style="padding: 20px 0;">
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="max-width: 600px; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
                    <tr>
                        <td align="center" style="background-color: #2563eb; padding: 20px; border-top-left-radius: 8px; border-top-right-radius: 8px;">
                            <h1 style="margin: 0; font-size: 22px; color: #ffffff; font-weight: bold;">
                                📧 New Contact Form Submission
                            </h1>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 30px 25px;">
                            <h2 style="font-size: 18px; color: #2563eb; margin-top: 0; margin-bottom: 20px; border-bottom: 1px solid #eeeeee; padding-bottom: 10px;">
                                Contact Information
                            </h2>
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="font-size: 14px;">
                                <tr>
                                    <td style="padding: 8px 0; border-bottom: 1px dashed #e9ecef; width: 40%; font-weight: bold; color: #555555;">Name:</td>
                                    <td style="padding: 8px 0; border-bottom: 1px dashed #e9ecef; width: 60%; color: #333333; word-break: break-all;">${formData.name}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 8px 0; border-bottom: 1px dashed #e9ecef; width: 40%; font-weight: bold; color: #555555;">Email:</td>
                                    <td style="padding: 8px 0; border-bottom: 1px dashed #e9ecef; width: 60%; color: #333333; word-break: break-all;">
                                        <a href="mailto:${formData.email}" style="color: #2563eb; text-decoration: none;">${formData.email}</a>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding: 8px 0; border-bottom: 1px dashed #e9ecef; width: 40%; font-weight: bold; color: #555555;">Phone:</td>
                                    <td style="padding: 8px 0; border-bottom: 1px dashed #e9ecef; width: 60%; color: #333333; word-break: break-all;">${formData.phoneNumber}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 8px 0; border-bottom: 1px dashed #e9ecef; width: 40%; font-weight: bold; color: #555555;">City:</td>
                                    <td style="padding: 8px 0; border-bottom: 1px dashed #e9ecef; width: 60%; color: #333333; word-break: break-all;">${formData.city}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 8px 0; border-bottom: 1px dashed #e9ecef; width: 40%; font-weight: bold; color: #555555;">Service:</td>
                                    <td style="padding: 8px 0; border-bottom: 1px dashed #e9ecef; width: 60%; color: #333333; word-break: break-all;">${formData.service}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 8px 0; width: 40%; font-weight: bold; color: #555555;">Message:</td>
                                    <td style="padding: 8px 0; width: 60%; color: #333333; word-break: break-all;">${formData.message}</td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>`;

    const sendSmtpEmail = new Brevo.SendSmtpEmail();
    sendSmtpEmail.sender = { name: "Go Technicians", email: senderEmail };
    sendSmtpEmail.to = [{ email: receiverEmail }];
    sendSmtpEmail.subject = "Go Technicians - New Contact Request";
    sendSmtpEmail.htmlContent = emailContent;

    await apiInstance.sendTransacEmail(sendSmtpEmail);
    return { status: 200, message: "Email sent successfully" };
  } catch (error) {
    console.log("Error sending contact form email:", error);
    return { status: 500, message: "Error sending email." };
  }
}