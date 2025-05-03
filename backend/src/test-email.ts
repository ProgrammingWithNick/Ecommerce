// import nodemailer from 'nodemailer';
// import dotenv from 'dotenv';

// dotenv.config(); // Load .env variables

// async function testSendEmail() {
//     const transporter = nodemailer.createTransport({
//         service: 'gmail',
//         auth: {
//             user: process.env.EMAIL_USERNAME,
//             pass: process.env.EMAIL_PASSWORD,
//         },
//     });

//     const info = await transporter.sendMail({
//         from: process.env.EMAIL_USERNAME,
//         to: 'nikhilkhavdu441@gmail.com', // replace with your other email
//         subject: 'Test Email from NestJS',
//         html: '<p>Hello from NestJS test script!</p>',
//     });

//     console.log('✅ Test email sent:', info.response);
// }

// testSendEmail().catch((err) => console.error('❌ Failed to send:', err));
