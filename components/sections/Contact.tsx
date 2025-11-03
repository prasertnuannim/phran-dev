"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useActionState, useEffect, useRef, useState } from "react";
import Section from "./Section";
import { sendMail } from "@/app/actions/sendMail";
import type { ContactFormState } from "@/types/contact";

export default function Contact() {
  const initialState: ContactFormState = {
    status: "idle",
    message: "",
  };

  const [state, formAction, isPending] = useActionState(sendMail, initialState);

  const formRef = useRef<HTMLFormElement>(null);
  const [formStatus, setFormStatus] = useState<"idle" | "success" | "error">(
    "idle",
  );
  const [showMessage, setShowMessage] = useState(false);

useEffect(() => {
  if (state.status === "success") {
    // ✅ เรียก setState แบบ async เพื่อหลีกเลี่ยง cascading render warning
    queueMicrotask(() => {
      setFormStatus("success");
      setShowMessage(true);
      formRef.current?.reset();
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

  const words = [
    "มีโปรเจกต์,",
    "ไอเดีย,",
    "หรือแค่อยากพูดคุย?",
    "ส่งข้อความมาหาฉันได้เลย,",
    "มาสร้างสิ่งใหม่ไปด้วยกัน!",
  ];

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
        <motion.h2
          className="text-4xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent"
          initial={{ opacity: 0, y: -10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
        >
          ติดต่อฉัน
        </motion.h2>

        {/* ✨ Animated intro words */}
        <motion.div
          className="mb-8 text-gray-600 flex flex-wrap justify-center gap-x-2 leading-relaxed"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{
            visible: { transition: { staggerChildren: 0.15 } },
          }}
        >
          {words.map((w, i) => (
            <motion.span
              key={i}
              variants={{
                hidden: { opacity: 0, y: 15 },
                visible: { opacity: 1, y: 0 },
              }}
              transition={{ duration: 0.4 }}
            >
              {w}
            </motion.span>
          ))}
        </motion.div>

        <form ref={formRef} action={formAction} className="space-y-5">
          <input
            name="name"
            type="text"
            placeholder="ชื่อของคุณ"
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all bg-white/90"
            required
          />
          <input
            name="email"
            type="email"
            placeholder="อีเมลของคุณ"
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all bg-white/90"
            required
          />
          <textarea
            name="message"
            placeholder="ข้อความของคุณ..."
            rows={5}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all bg-white/90"
            required
          />

          {/* ✨ ปุ่มส่ง */}
          <motion.button
            whileHover={{ scale: formStatus === "idle" ? 1.03 : 1 }}
            whileTap={{ scale: formStatus === "idle" ? 0.97 : 1 }}
            type="submit"
            disabled={isPending}
            className={`relative w-full py-3 text-lg font-semibold text-white rounded-lg transition-all shadow-md flex items-center justify-center gap-2
              ${
                formStatus === "success"
                  ? "bg-green-600"
                  : formStatus === "error"
                  ? "bg-red-600"
                  : "bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:brightness-110"
              }`}
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
              ? "ส่งสำเร็จ ✅"
              : formStatus === "error"
              ? "ส่งไม่สำเร็จ ❌"
              : "ส่งข้อความ"}
          </motion.button>

          {/* 💬 Message */}
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
