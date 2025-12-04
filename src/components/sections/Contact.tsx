"use client";
import { motion } from "framer-motion";
import { useState } from "react";
import Section from "./Section";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        setStatus("success");
        setForm({ name: "", email: "", message: "" });
      } else {
        throw new Error("Failed");
      }
    } catch {
      setStatus("error");
    }
  };

  return (
    <Section
      id="contact"
      className="relative flex items-center justify-center min-h-screen px-6 md:px-20 py-24 md:py-32 bg-gradient-to-br from-[#f0f9ff] via-[#f8fafc] to-[#e2e8f0] text-[#1e293b]"
    >
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="max-w-lg w-full mx-auto text-center bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg p-10 border border-gray-200"
      >
        <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
          ติดต่อฉัน
        </h2>
        <p className="mb-8 text-gray-600">
          มีโปรเจกต์, ไอเดีย, หรือแค่อยากพูดคุย?  
          ส่งข้อความมาหาฉันได้เลย — มาสร้างสิ่งใหม่ไปด้วยกัน 🩵
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            name="name"
            type="text"
            placeholder="ชื่อของคุณ"
            value={form.name}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all bg-white/90"
          />
          <input
            name="email"
            type="email"
            placeholder="อีเมลของคุณ"
            value={form.email}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all bg-white/90"
          />
          <textarea
            name="message"
            placeholder="ข้อความของคุณ..."
            rows={5}
            value={form.message}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all bg-white/90"
          />

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            type="submit"
            disabled={status === "loading"}
            className={`w-full py-3 text-lg font-semibold text-white rounded-lg transition-all shadow-md
              ${
                status === "success"
                  ? "bg-green-600"
                  : status === "error"
                  ? "bg-red-600"
                  : "bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:brightness-110"
              }
            `}
          >
            {status === "loading"
              ? "กำลังส่ง..."
              : status === "success"
              ? "ส่งสำเร็จ ✅"
              : status === "error"
              ? "ส่งไม่สำเร็จ ❌"
              : "ส่งข้อความ"}
          </motion.button>
        </form>
      </motion.div>
    </Section>
  );
}
