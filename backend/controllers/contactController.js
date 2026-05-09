const { sendEmail, contactAdminEmailHTML, contactConfirmEmailHTML } = require('../utils/sendEmail');

exports.sendContactMessage = async (req, res) => {
  const { name, email, subject, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ message: 'Name, email and message are required.' });
  }

  try {
    /* 1 — Notify admin with full message details */
    await sendEmail({
      to: process.env.EMAIL_USER,
      subject: `📬 New Contact Message: ${subject || 'General Enquiry'} — from ${name}`,
      html: contactAdminEmailHTML(name, email, subject, message),
    });

    /* 2 — Send confirmation receipt to the sender */
    await sendEmail({
      to: email,
      subject: `✅ We received your message — Job Portal ATS`,
      html: contactConfirmEmailHTML(name, subject),
    });

    res.status(200).json({ message: 'Message sent successfully.' });
  } catch (err) {
    console.error('Contact email error:', err);
    res.status(500).json({ message: 'Failed to send message. Please try again.' });
  }
};
