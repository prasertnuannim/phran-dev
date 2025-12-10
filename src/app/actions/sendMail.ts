"use server";

import nodemailer from "nodemailer";
import type { ContactFormState } from "../../types/contact";

export async function sendMail(
  _prevState: ContactFormState,
  formData: FormData,
): Promise<ContactFormState> {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const message = formData.get("message") as string;

  if (!name || !email || !message) {
    return { status: "error", message: "กรอกข้อมูลให้ครบถ้วน" };
  }

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS, // ใช้ App Password
      },
    });

    // 📨 ส่งอีเมลถึงเจ้าของเว็บไซต์ (Phran.Dev)
    await transporter.sendMail({
      from: `"Phran.Dev" <${process.env.MAIL_USER}>`,
      to: process.env.MAIL_TO || process.env.MAIL_USER,
      subject: `📩 ข้อความใหม่จาก ${name}`,
      html: `
        <p><strong>ชื่อผู้ส่ง:</strong> ${name}</p>
        <p><strong>อีเมล:</strong> ${email}</p>
        <p><strong>ข้อความ:</strong></p>
        <pre style="white-space:pre-wrap;">${message}</pre>
      `,
    });

    // 🤖 ส่งอีเมลตอบกลับผู้ใช้ (Auto Reply)
    await transporter.sendMail({
      from: `"Phran.Dev" <${process.env.MAIL_USER}>`,
      to: email,
      subject: `เราได้รับข้อความของคุณแล้ว (${name})`,
      html: `
        <div style="font-family:Arial,sans-serif;padding:16px;background:#f9f9f9;border-radius:8px;">
          <h2 style="color:#333;">สวัสดีคุณ ${name} </h2>
          <p>ขอบคุณที่ติดต่อเรา! ทีมงาน <strong>Phran.Dev</strong> ได้รับข้อความของคุณแล้ว:</p>
          <blockquote style="border-left:4px solid #ccc;padding-left:10px;color:#555;">
            ${message}
          </blockquote>
          <p>เราจะตอบกลับโดยเร็วที่สุดครับ </p>
          <hr />
          <p style="font-size:12px;color:#888;">อีเมลนี้ถูกส่งอัตโนมัติ กรุณาอย่าตอบกลับ</p>
        </div>
      `,
    });

    return { status: "success", message: "ส่งอีเมลและตอบกลับอัตโนมัติเรียบร้อย" };
  } catch (error: unknown) {
    console.error("sendMail error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "ไม่ทราบสาเหตุ (unknown error)";
    return { status: "error", message: "ส่งไม่สำเร็จ: " + errorMessage };
  }
}
