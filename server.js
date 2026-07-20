// server.js - Node.js Backend Service for Vardhaman Ventures Inquiry Dispatcher
const express = require('express');
const cors = require('cors');
const path = require('path');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 8000;

// Enable CORS and JSON parsing middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static frontend assets from the root workspace
app.use(express.static(path.join(__dirname)));

// Prevent favicon 404 noise for browsers when no favicon file exists
app.get('/favicon.ico', (req, res) => {
    res.sendStatus(204);
});

// Transporter variable to be initialized
let transporter = null;
let isEtherealFallback = false;

// Async function to configure Nodemailer transporter
async function initTransporter() {
    const smtpHost = process.env.SMTP_HOST;
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;
    const smtpPort = process.env.SMTP_PORT || 587;

    if (smtpHost && smtpUser && smtpPass) {
        console.log(`[SMTP] Configuring transporter using custom SMTP server: ${smtpHost}:${smtpPort}`);
        transporter = nodemailer.createTransport({
            host: smtpHost,
            port: parseInt(smtpPort, 10),
            secure: parseInt(smtpPort, 10) === 465, // true for 465, false for other ports
            auth: {
                user: smtpUser,
                password: smtpPass
            }
        });
    } else {
        console.warn('[SMTP] No custom SMTP credentials defined in .env. Initializing Ethereal test account fallback...');
        try {
            // Generate ethereal testing account dynamically
            const testAccount = await nodemailer.createTestAccount();
            console.log(`[SMTP] Dynamic Ethereal test account created successfully:`);
            console.log(` - User: ${testAccount.user}`);
            console.log(` - Pass: ${testAccount.pass}`);

            transporter = nodemailer.createTransport({
                host: testAccount.smtp.host,
                port: testAccount.smtp.port,
                secure: testAccount.smtp.secure,
                auth: {
                    user: testAccount.user,
                    pass: testAccount.pass
                }
            });
            isEtherealFallback = true;
        } catch (error) {
            console.error('[SMTP] Failed to generate Ethereal test account fallback:', error.message);
            console.log('[SMTP] Running in console-only mode. Inquiries will log to terminal instead of dispatching email.');
        }
    }
}

// Call transporter initialization
initTransporter();

// API endpoint for receiving consultation inquiries
app.post('/api/inquiry', async (req, res) => {
    const { name, phone, email, location, budget, message, siteVisit } = req.body;

    console.log(`\n[API] Received new inquiry lead from client: "${name}" (${phone})`);

    // Compile email HTML template (Premium styled layout with glassmorphic accents)
    const emailHtmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <title>New Consultation Enquiry - Vardhaman Ventures</title>
        <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f1f5f9; color: #1e293b; margin: 0; padding: 0; }
            .wrapper { max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); }
            .header { background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); color: #ffffff; padding: 30px; text-align: center; border-bottom: 3px solid #d97706; }
            .header h1 { margin: 0; font-size: 24px; font-weight: 800; letter-spacing: 0.05em; color: #ffffff; }
            .header p { margin: 5px 0 0 0; font-size: 11px; text-transform: uppercase; letter-spacing: 0.3em; color: #f59e0b; }
            .content { padding: 35px; }
            .badge { display: inline-block; padding: 6px 12px; background-color: #fef3c7; color: #b45309; font-size: 12px; font-weight: 700; border-radius: 50px; margin-bottom: 20px; border: 1px solid #fde68a; }
            .table-container { width: 100%; border-collapse: collapse; margin-bottom: 25px; }
            .table-container td { padding: 12px 15px; border-bottom: 1px solid #f1f5f9; font-size: 14px; }
            .table-container td.label { font-weight: 600; color: #64748b; width: 35%; }
            .table-container td.value { color: #0f172a; font-weight: 700; }
            .visit-alert { padding: 15px; background-color: #ecfdf5; border: 1px dashed #10b981; border-radius: 8px; margin-bottom: 25px; color: #047857; text-align: center; font-weight: 700; font-size: 14px; }
            .message-block { background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; font-size: 14px; line-height: 1.6; color: #334155; margin-bottom: 20px; font-style: italic; }
            .footer { background-color: #f8fafc; padding: 20px; text-align: center; border-top: 1px solid #e2e8f0; font-size: 12px; color: #64748b; }
            .footer a { color: #d97706; text-decoration: none; font-weight: bold; }
        </style>
    </head>
    <body>
        <div class="wrapper">
            <div class="header">
                <h1>VARDHAMAN VENTURES</h1>
                <p>Real Estate Consultants - Sales Desk</p>
            </div>
            <div class="content">
                <span class="badge">🏠 NEW INQUIRY RECEIVED</span>
                
                <table class="table-container">
                    <tr>
                        <td class="label">Client Name:</td>
                        <td class="value">${name}</td>
                    </tr>
                    <tr>
                        <td class="label">Phone Number:</td>
                        <td class="value"><a href="tel:${phone}">${phone}</a></td>
                    </tr>
                    <tr>
                        <td class="label">Email Address:</td>
                        <td class="value">${email}</td>
                    </tr>
                    <tr>
                        <td class="label">Preferred Location:</td>
                        <td class="value">${location.toUpperCase()}</td>
                    </tr>
                    <tr>
                        <td class="label">Budget Scope:</td>
                        <td class="value" style="color: #10b981;">${budget}</td>
                    </tr>
                    <tr>
                        <td class="label">Cab Site Visit Request:</td>
                        <td class="value">${siteVisit}</td>
                    </tr>
                </table>

                ${siteVisit === 'Required' ? `
                <div class="visit-alert">
                    🚗 Client requested a free cab pick-up site visit tour. Please schedule immediately!
                </div>
                ` : ''}

                <div class="message-block">
                    <strong>Message Details:</strong><br>
                    "${message}"
                </div>
            </div>
            <div class="footer">
                This lead was captured from Vardhaman Ventures web portal landing page.<br>
                &copy; 2026 Vardhaman Ventures. All rights reserved. Registered RERA Partners.
            </div>
        </div>
    </body>
    </html>
    `;

    const mailOptions = {
        from: '"Vardhaman Web Lead" <inquiries-noreply@vardhmanventures.com>',
        to: process.env.RECEIVER_EMAIL || 'consultation@vardhmanventures.com',
        subject: `New Lead Query: ${name} (${location.toUpperCase()}) - ${budget}`,
        text: `New consultation lead received!\n\nName: ${name}\nPhone: ${phone}\nEmail: ${email}\nPreferred Location: ${location}\nBudget: ${budget}\nSite visit needed: ${siteVisit}\n\nClient message: ${message}`,
        html: emailHtmlContent
    };

    if (transporter) {
        try {
            const info = await transporter.sendMail(mailOptions);
            console.log(`[SMTP] Email validation dispatched successfully: MessageId: ${info.messageId}`);

            if (isEtherealFallback) {
                const etherealUrl = nodemailer.getTestMessageUrl(info);
                console.log(`[ETHEREAL] View fallback testing email at link: ${etherealUrl}`);
                return res.status(200).json({
                    success: true,
                    message: "Inquiry processed successfully via Ethereal fallback.",
                    testMessageUrl: etherealUrl
                });
            }

            return res.status(200).json({
                success: true,
                message: "Inquiry emailed successfully."
            });
        } catch (mailError) {
            console.error('[SMTP] Nodemailer failed to send email:', mailError.message);
            return res.status(500).json({
                success: false,
                message: "Mail dispatch failure. Lead logged on terminal registry.",
                error: mailError.message
            });
        }
    } else {
        console.warn('[SMTP] No transporter initialized. Logging lead details locally:');
        console.log(JSON.stringify(req.body, null, 2));
        return res.status(200).json({
            success: true,
            message: "Inquiry logged to terminal console registry (Console-only mode)."
        });
    }
});

// Serve frontend home route
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Launch Server listener only when running locally
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`=============================================================`);
        console.log(` Vardhaman Ventures Backend running on http://localhost:${PORT}`);
        console.log(` Serving landing page from: ${__dirname}`);
        console.log(`=============================================================`);
    });
}

module.exports = app;
