"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useActionState, useEffect, useRef, useState } from "react";
import { z } from "zod";
import Section from "./Section";
import { sendMail } from "@/app/actions/sendMail";
import type { ContactFormState } from "../../types/contact";

// 🧠 สร้าง schema สำหรับตรวจ input
const contactSchema = z.object({
  name: z.string().min(2, "กรุณากรอกชื่ออย่างน้อย 2 ตัวอักษร"),
  email: z.string().email("รูปแบบอีเมลไม่ถูกต้อง"),
  message: z.string().min(10, "กรุณากรอกข้อความอย่างน้อย 10 ตัวอักษร"),
});

export default function Contact() {
  const initialState: ContactFormState = { status: "idle", message: "" };
  const [state, formAction, isPending] = useActionState(sendMail, initialState);

  const formRef = useRef<HTMLFormElement>(null);
  const [formStatus, setFormStatus] = useState<"idle" | "success" | "error">("idle");
  const [showMessage, setShowMessage] = useState(false);

  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    const result = contactSchema.safeParse({ ...formData, [name]: value });
    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;
      const fieldError = fieldErrors[name as keyof typeof formData];
      setErrors((prev) => ({ ...prev, [name]: fieldError ? fieldError[0] : "" }));
    } else {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  useEffect(() => {
    if (state.status === "success") {
      queueMicrotask(() => {
        setFormStatus("success");
        setShowMessage(true);
        formRef.current?.reset();
        setFormData({ name: "", email: "", message: "" });
        setErrors({});
      });
      const timer = setTimeout(() => {
        setShowMessage(false);
        setFormStatus("idle");
      }, 5000);
      return () => clearTimeout(timer);
    }

    if (state.status === "error") {
      queueMicrotask(() => {
        setFormStatus("error");
        setShowMessage(true);
      });
      const timer = setTimeout(() => {
        setShowMessage(false);
        setFormStatus("idle");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [state.status]);

  const hasError = Object.values(errors).some((e) => e !== "");

  return (
    <Section
      id="contact"
      bg="bg-gradient-to-br from-[#e9e6df] via-[#f8f6f1] to-white"
      className="relative flex items-center justify-center min-h-screen px-6 md:px-20 py-24 md:py-32 text-[#1e293b]"
    >
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="max-w-lg w-full mx-auto text-center bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg p-10 border border-gray-200"
      >
        {/* ✨ Animated intro text */}
        <motion.div
          className="mb-8 text-gray-600 text-center text-[1rem] leading-relaxed"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{ visible: { transition: { staggerChildren: 0.25 } } }}
        >
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 },
            }}
            transition={{ duration: 0.6 }}
          >
            มีโปรเจกต์ ไอเดีย หรือแค่อยากพูดคุย ?
          </motion.div>

          <motion.div
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 },
            }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            ส่งข้อความมาหาผมได้เลย มาสร้างสิ่งใหม่ไปด้วยกัน !
          </motion.div>
        </motion.div>

        <form ref={formRef} action={formAction} className="space-y-5">
          <div className="text-left">
            <input
              name="name"
              type="text"
              placeholder="ชื่อของคุณ"
              value={formData.name}
              onChange={handleChange}
              className={`w-full px-4 py-3 rounded-lg border ${
                errors.name ? "border-red-400" : "border-gray-300"
              } focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all bg-white/90`}
              required
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
          </div>

          {/* Email */}
          <div className="text-left">
            <input
              name="email"
              type="email"
              placeholder="อีเมลของคุณ"
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-4 py-3 rounded-lg border ${
                errors.email ? "border-red-400" : "border-gray-300"
              } focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all bg-white/90`}
              required
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>

          {/* Message */}
          <div className="text-left">
            <textarea
              name="message"
              placeholder="ข้อความของคุณ..."
              rows={5}
              value={formData.message}
              onChange={handleChange}
              className={`w-full px-4 py-3 rounded-lg border ${
                errors.message ? "border-red-400" : "border-gray-300"
              } focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all bg-white/90`}
              required
            />
            {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message}</p>}
          </div>

          {/* ✨ ปุ่มส่ง */}
          <motion.button
            whileHover={{ scale: formStatus === "idle" ? 1.03 : 1 }}
            whileTap={{ scale: formStatus === "idle" ? 0.97 : 1 }}
            type="submit"
            disabled={isPending || hasError}
            className={`relative w-full py-3 text-lg font-semibold text-white rounded-lg transition-all shadow-md flex items-center justify-center gap-2
              ${
                formStatus === "success"
                  ? "bg-green-600"
                  : formStatus === "error"
                  ? "bg-red-600"
                  : "bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:brightness-110"
              } ${isPending || hasError ? "opacity-70 cursor-not-allowed" : ""}`}
          >
            {isPending && (
              <motion.span
                className="w-5 h-5 border-[3px] border-white/40 border-t-white rounded-full"
                animate={{ rotate: 360 }}
                transition={{
                  repeat: Infinity,
                  duration: 1.2,
                  ease: [0.45, 0, 0.55, 1],
                }}
              />
            )}
            {isPending
              ? "กำลังส่ง..."
              : formStatus === "success"
              ? "ส่งสำเร็จ"
              : formStatus === "error"
              ? "ส่งไม่สำเร็จ"
              : "ส่งข้อความ"}
          </motion.button>

          {/* 💬 ข้อความแจ้งเตือน */}
          <AnimatePresence>
            {state.message && showMessage && (
              <motion.p
                key={state.message}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
                className={`text-sm mt-3 ${
                  formStatus === "success"
                    ? "text-green-600"
                    : formStatus === "error"
                    ? "text-red-600"
                    : "text-gray-600"
                }`}
              >
                {state.message}
              </motion.p>
            )}
          </AnimatePresence>
        </form>
      </motion.div>
    </Section>
  );
}
