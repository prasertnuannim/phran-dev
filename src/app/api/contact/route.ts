import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { ContactPayload } from "@/types/contact";

export async function POST(req: Request) {
  try {
    const { name, email, message } = (await req.json()) as ContactPayload;
    if (!name || !email || !message) {
      return NextResponse.json({ error: "กรอกไม่ครบ" }, { status: 400 });
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS, // App Password
      },
    });

    await transporter.sendMail({
      from: `"Phran.Dev" <${process.env.MAIL_USER}>`,
      to: process.env.MAIL_TO,
      subject: `New message from ${name}`,
      html: `<p><strong>From:</strong> ${name} &lt;${email}&gt;</p>
             <p><strong>Message:</strong></p>
             <pre style="white-space:pre-wrap;">${message}</pre>`,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    const error = err instanceof Error ? err : new Error("Failed");
    console.error("sendMail error:", error);
    return NextResponse.json({ error: error.message || "Failed" }, { status: 500 });
  }
}
