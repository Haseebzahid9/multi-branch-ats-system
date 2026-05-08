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
    from: `"HireTrack ATS" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
  };
  return transporter.sendMail(mailOptions);
};

const shortlistEmailHTML = (candidateName, jobTitle, branch) => `
<div style="font-family:sans-serif;max-width:600px;margin:auto;background:#0d1f2d;color:#e0e0e0;border-radius:12px;overflow:hidden">
  <div style="background:linear-gradient(135deg,#3a6b47,#2d5438);padding:32px;text-align:center">
    <h1 style="color:#fff;margin:0;font-size:24px">HireTrack ATS</h1>
    <p style="color:rgba(255,255,255,.8);margin:8px 0 0">Multi-Branch Recruitment System</p>
  </div>
  <div style="padding:32px">
    <h2 style="color:#5dd88a;margin-top:0">Congratulations, ${candidateName}!</h2>
    <p>Your application for <strong style="color:#fff">${jobTitle}</strong> at our <strong style="color:#fff">${branch}</strong> branch has been <strong style="color:#5dd88a">shortlisted</strong>.</p>
    <p>Our HR team will contact you shortly with further instructions.</p>
    <div style="background:#1a2e3a;border-left:4px solid #3a6b47;padding:16px;border-radius:8px;margin:24px 0">
      <p style="margin:0"><strong>Next Steps:</strong><br/>Our recruitment team will reach out to schedule an interview. Keep your contact information up to date.</p>
    </div>
    <p>Questions? Contact us at <a href="mailto:haseebzahid4998@gmail.com" style="color:#5dd88a">haseebzahid4998@gmail.com</a> or call <strong>03184006367</strong>.</p>
  </div>
  <div style="background:#0a1820;padding:16px;text-align:center;font-size:12px;color:#666">
    © 2026 HireTrack ATS | Developed by Haseeb Zahid
  </div>
</div>`;

const rejectionEmailHTML = (candidateName, jobTitle) => `
<div style="font-family:sans-serif;max-width:600px;margin:auto;background:#0d1f2d;color:#e0e0e0;border-radius:12px;overflow:hidden">
  <div style="background:linear-gradient(135deg,#3a6b47,#2d5438);padding:32px;text-align:center">
    <h1 style="color:#fff;margin:0;font-size:24px">HireTrack ATS</h1>
    <p style="color:rgba(255,255,255,.8);margin:8px 0 0">Multi-Branch Recruitment System</p>
  </div>
  <div style="padding:32px">
    <h2 style="color:#fff;margin-top:0">Dear ${candidateName},</h2>
    <p>Thank you for applying for <strong style="color:#fff">${jobTitle}</strong> and taking the time to go through our recruitment process.</p>
    <p>After careful review, we regret to inform you that your application has not been selected for this position at this time.</p>
    <p>We encourage you to apply for future opportunities on our portal.</p>
    <p>Questions? Contact us at <a href="mailto:haseebzahid4998@gmail.com" style="color:#5dd88a">haseebzahid4998@gmail.com</a>.</p>
  </div>
  <div style="background:#0a1820;padding:16px;text-align:center;font-size:12px;color:#666">
    © 2026 HireTrack ATS | Developed by Haseeb Zahid
  </div>
</div>`;

const interviewEmailHTML = (candidateName, jobTitle, date, time, location, message) => `
<div style="font-family:sans-serif;max-width:600px;margin:auto;background:#0d1f2d;color:#e0e0e0;border-radius:12px;overflow:hidden">
  <div style="background:linear-gradient(135deg,#3a6b47,#2d5438);padding:32px;text-align:center">
    <h1 style="color:#fff;margin:0;font-size:24px">HireTrack ATS</h1>
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
    © 2026 HireTrack ATS | Developed by Haseeb Zahid
  </div>
</div>`;

module.exports = { sendEmail, shortlistEmailHTML, rejectionEmailHTML, interviewEmailHTML };
