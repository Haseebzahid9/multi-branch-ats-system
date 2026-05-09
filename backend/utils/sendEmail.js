const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendEmail = async ({ to, subject, html }) => {
  const mailOptions = {
    from: `"Job Portal ATS" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
  };
  return transporter.sendMail(mailOptions);
};

/* ── Existing recruitment email templates ── */

const shortlistEmailHTML = (candidateName, jobTitle, branch) => `
<div style="font-family:sans-serif;max-width:600px;margin:auto;background:#0d1f2d;color:#e0e0e0;border-radius:12px;overflow:hidden">
  <div style="background:linear-gradient(135deg,#3a6b47,#2d5438);padding:32px;text-align:center">
    <h1 style="color:#fff;margin:0;font-size:24px">Job Portal ATS</h1>
    <p style="color:rgba(255,255,255,.8);margin:8px 0 0">Multi-Branch Recruitment System</p>
  </div>
  <div style="padding:32px">
    <h2 style="color:#5dd88a;margin-top:0">Congratulations, ${candidateName}!</h2>
    <p>Your application for <strong style="color:#fff">${jobTitle}</strong> at our <strong style="color:#fff">${branch}</strong> branch has been <strong style="color:#5dd88a">shortlisted</strong>.</p>
    <p>Our HR team will contact you shortly with further instructions.</p>
    <div style="background:#1a2e3a;border-left:4px solid #3a6b47;padding:16px;border-radius:8px;margin:24px 0">
      <p style="margin:0"><strong>Next Steps:</strong><br/>Our recruitment team will reach out to schedule an interview. Keep your contact information up to date.</p>
    </div>
    <p>Questions? Contact us at <a href="mailto:f230644@cfd.nu.edu.pk" style="color:#5dd88a">f230644@cfd.nu.edu.pk</a> or call <strong>03184006367</strong>.</p>
  </div>
  <div style="background:#0a1820;padding:16px;text-align:center;font-size:12px;color:#666">
    © 2026 Job Portal ATS | Developed by Haseeb Zahid
  </div>
</div>`;

const rejectionEmailHTML = (candidateName, jobTitle) => `
<div style="font-family:sans-serif;max-width:600px;margin:auto;background:#0d1f2d;color:#e0e0e0;border-radius:12px;overflow:hidden">
  <div style="background:linear-gradient(135deg,#3a6b47,#2d5438);padding:32px;text-align:center">
    <h1 style="color:#fff;margin:0;font-size:24px">Job Portal ATS</h1>
    <p style="color:rgba(255,255,255,.8);margin:8px 0 0">Multi-Branch Recruitment System</p>
  </div>
  <div style="padding:32px">
    <h2 style="color:#fff;margin-top:0">Dear ${candidateName},</h2>
    <p>Thank you for applying for <strong style="color:#fff">${jobTitle}</strong> and taking the time to go through our recruitment process.</p>
    <p>After careful review, we regret to inform you that your application has not been selected for this position at this time.</p>
    <p>We encourage you to apply for future opportunities on our portal.</p>
    <p>Questions? Contact us at <a href="mailto:f230644@cfd.nu.edu.pk" style="color:#5dd88a">f230644@cfd.nu.edu.pk</a>.</p>
  </div>
  <div style="background:#0a1820;padding:16px;text-align:center;font-size:12px;color:#666">
    © 2026 Job Portal ATS | Developed by Haseeb Zahid
  </div>
</div>`;

const interviewEmailHTML = (candidateName, jobTitle, date, time, location, message) => `
<div style="font-family:sans-serif;max-width:600px;margin:auto;background:#0d1f2d;color:#e0e0e0;border-radius:12px;overflow:hidden">
  <div style="background:linear-gradient(135deg,#3a6b47,#2d5438);padding:32px;text-align:center">
    <h1 style="color:#fff;margin:0;font-size:24px">Job Portal ATS</h1>
    <p style="color:rgba(255,255,255,.8);margin:8px 0 0">Multi-Branch Recruitment System</p>
  </div>
  <div style="padding:32px">
    <h2 style="color:#5dd88a;margin-top:0">Interview Invitation</h2>
    <p>Dear <strong style="color:#fff">${candidateName}</strong>, you have been invited to an interview for <strong style="color:#fff">${jobTitle}</strong>.</p>
    <div style="background:#1a2e3a;border-radius:10px;padding:20px;margin:20px 0">
      <p style="margin:0 0 10px"><strong style="color:#5dd88a">Date:</strong> ${new Date(date).toLocaleDateString('en-PK', { weekday:'long', year:'numeric', month:'long', day:'numeric' })}</p>
      <p style="margin:0 0 10px"><strong style="color:#5dd88a">Time:</strong> ${time}</p>
      <p style="margin:0"><strong style="color:#5dd88a">Location:</strong> ${location}</p>
    </div>
    ${message ? `<div style="background:#1a2e3a;border-left:4px solid #3a6b47;padding:16px;border-radius:8px"><p style="margin:0"><strong>Note from HR:</strong><br/>${message}</p></div>` : ''}
    <p style="margin-top:20px">Please confirm your attendance by replying to this email or calling <strong>03184006367</strong>.</p>
  </div>
  <div style="background:#0a1820;padding:16px;text-align:center;font-size:12px;color:#666">
    © 2026 Job Portal ATS | Developed by Haseeb Zahid
  </div>
</div>`;

/* ── Contact form email templates ── */

/* Email sent TO the admin when someone fills the contact form */
const contactAdminEmailHTML = (name, email, subject, message) => `
<div style="font-family:'Segoe UI',Arial,sans-serif;max-width:620px;margin:auto;background:#0d1f2d;color:#e0e0e0;border-radius:14px;overflow:hidden;box-shadow:0 8px 32px rgba(0,0,0,.5)">

  <!-- Header -->
  <div style="background:linear-gradient(135deg,#3a6b47,#2d5438);padding:36px 32px;text-align:center">
    <div style="width:56px;height:56px;background:rgba(255,255,255,.15);border-radius:14px;display:inline-flex;align-items:center;justify-content:center;margin-bottom:14px">
      <span style="font-size:24px">📬</span>
    </div>
    <h1 style="color:#fff;margin:0;font-size:22px;font-weight:800;letter-spacing:-.5px">New Contact Message</h1>
    <p style="color:rgba(255,255,255,.75);margin:8px 0 0;font-size:14px">Job Portal ATS — Contact Form Submission</p>
  </div>

  <!-- Body -->
  <div style="padding:36px 32px">

    <p style="margin:0 0 24px;color:#8fa3b0;font-size:15px;line-height:1.7">
      Someone submitted a message through the contact form on <strong style="color:#e8edf2">Job Portal ATS</strong>. Details below:
    </p>

    <!-- Sender info box -->
    <div style="background:#162433;border:1px solid rgba(255,255,255,.08);border-radius:12px;padding:22px 24px;margin-bottom:24px">
      <table style="width:100%;border-collapse:collapse">
        <tr>
          <td style="padding:8px 0;border-bottom:1px solid rgba(255,255,255,.06);width:120px">
            <span style="font-size:12px;font-weight:700;color:#5a7080;text-transform:uppercase;letter-spacing:.06em">From</span>
          </td>
          <td style="padding:8px 0;border-bottom:1px solid rgba(255,255,255,.06)">
            <strong style="color:#e8edf2;font-size:15px">${name}</strong>
          </td>
        </tr>
        <tr>
          <td style="padding:8px 0;border-bottom:1px solid rgba(255,255,255,.06)">
            <span style="font-size:12px;font-weight:700;color:#5a7080;text-transform:uppercase;letter-spacing:.06em">Email</span>
          </td>
          <td style="padding:8px 0;border-bottom:1px solid rgba(255,255,255,.06)">
            <a href="mailto:${email}" style="color:#5dd88a;font-size:15px;text-decoration:none">${email}</a>
          </td>
        </tr>
        <tr>
          <td style="padding:8px 0">
            <span style="font-size:12px;font-weight:700;color:#5a7080;text-transform:uppercase;letter-spacing:.06em">Subject</span>
          </td>
          <td style="padding:8px 0">
            <span style="color:#e8edf2;font-size:15px">${subject || '(No subject provided)'}</span>
          </td>
        </tr>
      </table>
    </div>

    <!-- Message box -->
    <div style="margin-bottom:28px">
      <p style="font-size:12px;font-weight:700;color:#5a7080;text-transform:uppercase;letter-spacing:.06em;margin:0 0 10px">Message</p>
      <div style="background:#162433;border-left:4px solid #3a6b47;border-radius:0 10px 10px 0;padding:20px 22px;color:#c8d8e4;font-size:15px;line-height:1.8;white-space:pre-wrap">${message}</div>
    </div>

    <!-- Reply button -->
    <div style="text-align:center;margin-top:8px">
      <a href="mailto:${email}?subject=Re: ${subject || 'Your message to Job Portal ATS'}"
         style="display:inline-block;background:linear-gradient(135deg,#3a6b47,#2d5438);color:#fff;text-decoration:none;padding:13px 32px;border-radius:999px;font-weight:700;font-size:14px;letter-spacing:.02em">
        ↩ Reply to ${name}
      </a>
    </div>

  </div>

  <!-- Footer -->
  <div style="background:#0a1820;padding:18px 24px;text-align:center;border-top:1px solid rgba(255,255,255,.06)">
    <p style="margin:0;font-size:12px;color:#5a7080">
      © 2026 <strong style="color:#8fa3b0">Job Portal ATS</strong> — Establishment Division, Islamabad, Pakistan
    </p>
    <p style="margin:6px 0 0;font-size:12px;color:#5a7080">
      Developed by <strong style="color:#8fa3b0">Haseeb Zahid</strong> &nbsp;|&nbsp; 03184006367
    </p>
  </div>

</div>`;

/* Confirmation email sent TO the person who filled the form */
const contactConfirmEmailHTML = (name, subject) => `
<div style="font-family:'Segoe UI',Arial,sans-serif;max-width:620px;margin:auto;background:#0d1f2d;color:#e0e0e0;border-radius:14px;overflow:hidden;box-shadow:0 8px 32px rgba(0,0,0,.5)">

  <!-- Header -->
  <div style="background:linear-gradient(135deg,#3a6b47,#2d5438);padding:36px 32px;text-align:center">
    <div style="width:56px;height:56px;background:rgba(255,255,255,.15);border-radius:14px;display:inline-flex;align-items:center;justify-content:center;margin-bottom:14px">
      <span style="font-size:26px">✅</span>
    </div>
    <h1 style="color:#fff;margin:0;font-size:22px;font-weight:800;letter-spacing:-.5px">Message Received!</h1>
    <p style="color:rgba(255,255,255,.75);margin:8px 0 0;font-size:14px">Job Portal ATS — Support Team</p>
  </div>

  <!-- Body -->
  <div style="padding:36px 32px">

    <h2 style="color:#5dd88a;margin:0 0 16px;font-size:20px;font-weight:800">Hi ${name},</h2>
    <p style="margin:0 0 18px;color:#8fa3b0;font-size:15px;line-height:1.75">
      Thank you for reaching out to us. We have successfully received your message and our team will get back to you as soon as possible.
    </p>

    <!-- Confirmation box -->
    <div style="background:#162433;border:1px solid rgba(93,216,138,.18);border-radius:12px;padding:22px 24px;margin-bottom:28px">
      <p style="margin:0 0 8px;font-size:12px;font-weight:700;color:#5a7080;text-transform:uppercase;letter-spacing:.06em">Your Message Subject</p>
      <p style="margin:0;color:#e8edf2;font-size:15px;font-weight:600">${subject || 'General Enquiry'}</p>
    </div>

    <!-- Timeline -->
    <div style="margin-bottom:28px">
      <p style="margin:0 0 16px;font-size:13px;font-weight:700;color:#5a7080;text-transform:uppercase;letter-spacing:.06em">What Happens Next</p>
      <div style="display:flex;flex-direction:column;gap:12px">
        <div style="display:flex;align-items:flex-start;gap:14px">
          <div style="width:32px;height:32px;background:rgba(93,216,138,.15);border:1px solid rgba(93,216,138,.3);border-radius:50%;display:flex;align-items:center;justify-content:center;flex-shrink:0;font-size:13px;font-weight:700;color:#5dd88a">1</div>
          <div style="padding-top:6px">
            <strong style="color:#e8edf2;font-size:14px">Message Logged</strong><br/>
            <span style="color:#5a7080;font-size:13px">Your message has been recorded in our system.</span>
          </div>
        </div>
        <div style="display:flex;align-items:flex-start;gap:14px">
          <div style="width:32px;height:32px;background:rgba(93,216,138,.15);border:1px solid rgba(93,216,138,.3);border-radius:50%;display:flex;align-items:center;justify-content:center;flex-shrink:0;font-size:13px;font-weight:700;color:#5dd88a">2</div>
          <div style="padding-top:6px">
            <strong style="color:#e8edf2;font-size:14px">Team Review</strong><br/>
            <span style="color:#5a7080;font-size:13px">Our support team will review your query within 24 hours.</span>
          </div>
        </div>
        <div style="display:flex;align-items:flex-start;gap:14px">
          <div style="width:32px;height:32px;background:rgba(93,216,138,.15);border:1px solid rgba(93,216,138,.3);border-radius:50%;display:flex;align-items:center;justify-content:center;flex-shrink:0;font-size:13px;font-weight:700;color:#5dd88a">3</div>
          <div style="padding-top:6px">
            <strong style="color:#e8edf2;font-size:14px">We Reply to You</strong><br/>
            <span style="color:#5a7080;font-size:13px">You'll receive a detailed response at this email address.</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Contact info -->
    <div style="background:#162433;border-left:4px solid #3a6b47;border-radius:0 10px 10px 0;padding:18px 20px">
      <p style="margin:0 0 6px;font-size:13px;font-weight:700;color:#5dd88a">Need urgent help?</p>
      <p style="margin:0;color:#8fa3b0;font-size:14px;line-height:1.7">
        📞 &nbsp;<strong style="color:#e8edf2">03184006367</strong><br/>
        📧 &nbsp;<a href="mailto:f230644@cfd.nu.edu.pk" style="color:#5dd88a;text-decoration:none">f230644@cfd.nu.edu.pk</a><br/>
        📍 &nbsp;<span style="color:#8fa3b0">Establishment Division, Islamabad, Pakistan</span>
      </p>
    </div>

  </div>

  <!-- Footer -->
  <div style="background:#0a1820;padding:18px 24px;text-align:center;border-top:1px solid rgba(255,255,255,.06)">
    <p style="margin:0;font-size:12px;color:#5a7080">
      © 2026 <strong style="color:#8fa3b0">Job Portal ATS</strong> — Multi-Branch Recruitment System
    </p>
    <p style="margin:6px 0 0;font-size:12px;color:#5a7080">
      Developed by <strong style="color:#8fa3b0">Haseeb Zahid</strong>
    </p>
  </div>

</div>`;

module.exports = {
  sendEmail,
  shortlistEmailHTML,
  rejectionEmailHTML,
  interviewEmailHTML,
  contactAdminEmailHTML,
  contactConfirmEmailHTML,
};
