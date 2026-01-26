"use server"
import * as Brevo from "@getbrevo/brevo";

interface ComplaintFormData {
  name: string;
  email: string;
  phoneNumber: string;
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

interface BookingItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface BookingFormData {
  items: BookingItem[];
  contact: {
    phone: string;
    email: string;
  };
  address: {
    region: string;
    flatNo: string;
    landmark: string;
  };
  schedule: {
    date: string;
    time: string;
  };
  totalPrice: number;
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

export async function sendBookingEmail(formData: BookingFormData) {
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
    const customerEmailAddress = formData.contact.email;

    const apiInstance = new Brevo.TransactionalEmailsApi();
    apiInstance.setApiKey(
      Brevo.TransactionalEmailsApiApiKeys.apiKey,
      process.env.BREVO_API_KEY
    );

    // Generate service items HTML
    const serviceItemsHtml = formData.items
      .map(
        (item) => `
      <tr>
        <td style="padding: 12px 0; border-bottom: 1px solid #e9ecef; color: #333333;">${item.name}</td>
        <td style="padding: 12px 0; border-bottom: 1px solid #e9ecef; color: #333333; text-align: center;">${item.quantity}</td>
        <td style="padding: 12px 0; border-bottom: 1px solid #e9ecef; color: #333333; text-align: right;">₹${item.price}</td>
        <td style="padding: 12px 0; border-bottom: 1px solid #e9ecef; color: #333333; text-align: right; font-weight: bold;">₹${item.price * item.quantity}</td>
      </tr>
    `
      )
      .join("");

    // Email content for admin
    const adminEmailContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New Service Booking</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333333; margin: 0; padding: 0; background-color: #f4f4f4;">
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
        <tr>
            <td align="center" style="padding: 20px 0;">
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="max-width: 650px; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
                    <tr>
                        <td align="center" style="background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%); padding: 30px; border-top-left-radius: 8px; border-top-right-radius: 8px;">
                            <h1 style="margin: 0; font-size: 24px; color: #ffffff; font-weight: bold;">
                                🎉 New Service Booking Received
                            </h1>
                        </td>
                    </tr>
                    
                    <!-- Booking Details -->
                    <tr>
                        <td style="padding: 30px 25px;">
                            <h2 style="font-size: 18px; color: #2563eb; margin-top: 0; margin-bottom: 20px; border-bottom: 2px solid #2563eb; padding-bottom: 10px;">
                                📋 Services Booked
                            </h2>
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="font-size: 14px;">
                                <thead>
                                    <tr style="background-color: #f8fafc;">
                                        <th style="padding: 12px 0; text-align: left; font-weight: bold; color: #555555; border-bottom: 2px solid #2563eb;">Service</th>
                                        <th style="padding: 12px 0; text-align: center; font-weight: bold; color: #555555; border-bottom: 2px solid #2563eb;">Qty</th>
                                        <th style="padding: 12px 0; text-align: right; font-weight: bold; color: #555555; border-bottom: 2px solid #2563eb;">Price</th>
                                        <th style="padding: 12px 0; text-align: right; font-weight: bold; color: #555555; border-bottom: 2px solid #2563eb;">Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${serviceItemsHtml}
                                    <tr>
                                        <td colspan="3" style="padding: 15px 0 8px 0; text-align: right; font-size: 16px; font-weight: bold; color: #333333;">Grand Total:</td>
                                        <td style="padding: 15px 0 8px 0; text-align: right; font-size: 18px; font-weight: bold; color: #2563eb;">₹${formData.totalPrice}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </td>
                    </tr>

                    <!-- Customer Contact Details -->
                    <tr>
                        <td style="padding: 0 25px 30px 25px;">
                            <h2 style="font-size: 18px; color: #2563eb; margin-top: 0; margin-bottom: 20px; border-bottom: 2px solid #2563eb; padding-bottom: 10px;">
                                👤 Customer Information
                            </h2>
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="font-size: 14px;">
                                <tr>
                                    <td style="padding: 8px 0; border-bottom: 1px dashed #e9ecef; width: 30%; font-weight: bold; color: #555555;">Email:</td>
                                    <td style="padding: 8px 0; border-bottom: 1px dashed #e9ecef; width: 70%; color: #333333;">
                                        <a href="mailto:${formData.contact.email}" style="color: #2563eb; text-decoration: none;">${formData.contact.email}</a>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding: 8px 0; border-bottom: 1px dashed #e9ecef; font-weight: bold; color: #555555;">Phone:</td>
                                    <td style="padding: 8px 0; border-bottom: 1px dashed #e9ecef; color: #333333;">${formData.contact.phone}</td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <!-- Service Address -->
                    <tr>
                        <td style="padding: 0 25px 30px 25px;">
                            <h2 style="font-size: 18px; color: #2563eb; margin-top: 0; margin-bottom: 20px; border-bottom: 2px solid #2563eb; padding-bottom: 10px;">
                                📍 Service Address
                            </h2>
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="font-size: 14px;">
                                <tr>
                                    <td style="padding: 8px 0; border-bottom: 1px dashed #e9ecef; width: 30%; font-weight: bold; color: #555555;">Region/City:</td>
                                    <td style="padding: 8px 0; border-bottom: 1px dashed #e9ecef; width: 70%; color: #333333;">${formData.address.region}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 8px 0; border-bottom: 1px dashed #e9ecef; font-weight: bold; color: #555555;">Address:</td>
                                    <td style="padding: 8px 0; border-bottom: 1px dashed #e9ecef; color: #333333;">${formData.address.flatNo}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 8px 0; font-weight: bold; color: #555555;">Landmark:</td>
                                    <td style="padding: 8px 0; color: #333333;">${formData.address.landmark}</td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <!-- Schedule -->
                    <tr>
                        <td style="padding: 0 25px 30px 25px;">
                            <h2 style="font-size: 18px; color: #2563eb; margin-top: 0; margin-bottom: 20px; border-bottom: 2px solid #2563eb; padding-bottom: 10px;">
                                📅 Booking Schedule
                            </h2>
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="font-size: 14px;">
                                <tr>
                                    <td style="padding: 8px 0; border-bottom: 1px dashed #e9ecef; width: 30%; font-weight: bold; color: #555555;">Date:</td>
                                    <td style="padding: 8px 0; border-bottom: 1px dashed #e9ecef; width: 70%; color: #333333;">${formData.schedule.date}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 8px 0; font-weight: bold; color: #555555;">Time Slot:</td>
                                    <td style="padding: 8px 0; color: #333333;">${formData.schedule.time}</td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td align="center" style="background-color: #f8fafc; padding: 20px; border-bottom-left-radius: 8px; border-bottom-right-radius: 8px;">
                            <p style="margin: 0; font-size: 12px; color: #666666;">
                                This is an automated notification from Go Technicians booking system.
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>`;

    // Customer confirmation email
    const customerEmailContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Booking Confirmation</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333333; margin: 0; padding: 0; background-color: #f4f4f4;">
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
        <tr>
            <td align="center" style="padding: 20px 0;">
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="max-width: 650px; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
                    <tr>
                        <td align="center" style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 30px; border-top-left-radius: 8px; border-top-right-radius: 8px;">
                            <h1 style="margin: 0; font-size: 24px; color: #ffffff; font-weight: bold;">
                                ✅ Booking Confirmed!
                            </h1>
                            <p style="margin: 10px 0 0 0; color: #ffffff; font-size: 14px;">Thank you for choosing Go Technicians</p>
                        </td>
                    </tr>
                    
                    <tr>
                        <td style="padding: 30px 25px; text-align: center;">
                            <p style="font-size: 16px; color: #333333; margin: 0 0 20px 0;">
                                Your service booking has been confirmed. Our team will reach out to you shortly.
                            </p>
                        </td>
                    </tr>

                    <!-- Services Booked -->
                    <tr>
                        <td style="padding: 0 25px 30px 25px;">
                            <h2 style="font-size: 18px; color: #10b981; margin-top: 0; margin-bottom: 20px; border-bottom: 2px solid #10b981; padding-bottom: 10px;">
                                Your Booked Services
                            </h2>
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="font-size: 14px;">
                                <thead>
                                    <tr style="background-color: #f8fafc;">
                                        <th style="padding: 12px; text-align: left; font-weight: bold; color: #555555; border-bottom: 2px solid #10b981;">Service</th>
                                        <th style="padding: 12px; text-align: center; font-weight: bold; color: #555555; border-bottom: 2px solid #10b981;">Qty</th>
                                        <th style="padding: 12px; text-align: right; font-weight: bold; color: #555555; border-bottom: 2px solid #10b981;">Amount</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${formData.items
                                      .map(
                                        (item) => `
                                      <tr>
                                        <td style="padding: 12px; border-bottom: 1px solid #e9ecef; color: #333333;">${item.name}</td>
                                        <td style="padding: 12px; border-bottom: 1px solid #e9ecef; color: #333333; text-align: center;">${item.quantity}</td>
                                        <td style="padding: 12px; border-bottom: 1px solid #e9ecef; color: #333333; text-align: right;">₹${item.price * item.quantity}</td>
                                      </tr>
                                    `
                                      )
                                      .join("")}
                                    <tr>
                                        <td colspan="2" style="padding: 15px 12px 8px 12px; text-align: right; font-size: 16px; font-weight: bold; color: #333333;">Total Amount:</td>
                                        <td style="padding: 15px 12px 8px 12px; text-align: right; font-size: 18px; font-weight: bold; color: #10b981;">₹${formData.totalPrice}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </td>
                    </tr>

                    <!-- Schedule Details -->
                    <tr>
                        <td style="padding: 0 25px 30px 25px;">
                            <h2 style="font-size: 18px; color: #10b981; margin-top: 0; margin-bottom: 20px; border-bottom: 2px solid #10b981; padding-bottom: 10px;">
                                📅 Scheduled For
                            </h2>
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="font-size: 14px;">
                                <tr>
                                    <td style="padding: 8px 0; border-bottom: 1px dashed #e9ecef; width: 30%; font-weight: bold; color: #555555;">Date:</td>
                                    <td style="padding: 8px 0; border-bottom: 1px dashed #e9ecef; width: 70%; color: #333333;">${formData.schedule.date}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 8px 0; font-weight: bold; color: #555555;">Time:</td>
                                    <td style="padding: 8px 0; color: #333333;">${formData.schedule.time}</td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <!-- Service Address -->
                    <tr>
                        <td style="padding: 0 25px 30px 25px;">
                            <h2 style="font-size: 18px; color: #10b981; margin-top: 0; margin-bottom: 20px; border-bottom: 2px solid #10b981; padding-bottom: 10px;">
                                📍 Service Location
                            </h2>
                            <p style="margin: 0; font-size: 14px; color: #333333; line-height: 1.8;">
                                ${formData.address.flatNo}<br>
                                ${formData.address.landmark}<br>
                                ${formData.address.region}
                            </p>
                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td align="center" style="background-color: #f8fafc; padding: 20px; border-bottom-left-radius: 8px; border-bottom-right-radius: 8px;">
                            <p style="margin: 0 0 10px 0; font-size: 14px; color: #333333;">
                                Need help? Contact us at <a href="mailto:${senderEmail}" style="color: #10b981; text-decoration: none;">${senderEmail}</a>
                            </p>
                            <p style="margin: 0; font-size: 12px; color: #666666;">
                                © 2026 Go Technicians. All rights reserved.
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>`;

    // Send admin email
    const adminEmail = new Brevo.SendSmtpEmail();
    adminEmail.sender = { name: "Go Technicians", email: senderEmail };
    adminEmail.to = [{ email: receiverEmail }];
    adminEmail.subject = `New Service Booking - ₹${formData.totalPrice} | ${formData.schedule.date}`;
    adminEmail.htmlContent = adminEmailContent;

    // Send customer confirmation email
    const customerConfirmationEmail = new Brevo.SendSmtpEmail();
    customerConfirmationEmail.sender = { name: "Go Technicians", email: senderEmail };
    customerConfirmationEmail.to = [{ email: customerEmailAddress }];
    customerConfirmationEmail.subject = "Booking Confirmation - Go Technicians";
    customerConfirmationEmail.htmlContent = customerEmailContent;

    // Send both emails
    await apiInstance.sendTransacEmail(adminEmail);
    await apiInstance.sendTransacEmail(customerConfirmationEmail);

    return { status: 200, message: "Booking emails sent successfully" };
  } catch (error) {
    console.log("Error sending booking email:", error);
    return { status: 500, message: "Error sending booking email." };
  }
}