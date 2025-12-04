"use client";
import { motion } from "framer-motion";
import Section from "./Section";

export default function About() {
  return (
    <Section
      id="about"
      className="
        relative flex items-center justify-center
        min-h-screen px-6 md:px-20 py-24 md:py-32
        bg-gradient-to-br from-[#fdfcfb] via-[#f7f6f2] to-[#eae7dc]
        text-[#2b2b2b]
      "
    >
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="
          max-w-3xl mx-auto text-center md:text-left
          leading-relaxed tracking-normal
        "
      >
        <h2
          className="
            text-4xl md:text-5xl font-bold mb-8
            bg-gradient-to-r from-[#b88a1a] via-[#d4a017] to-[#c79a3b]
            bg-clip-text text-transparent
          "
        >
          Phran Dev About
        </h2>

        <p className="text-lg md:text-xl text-[#3a3a3a] mb-6">
          <strong>Phran Dev</strong> ไม่ใช่แค่ชื่อของแบรนด์  
          แต่คือแนวคิดของผู้สร้าง ที่เชื่อว่าเทคโนโลยีไม่ใช่แค่โค้ด —  
          มันคือ “ผลงานฝีมือ” ที่เกิดจากจิตวิญญาณและความเข้าใจ
        </p>

        <p className="text-lg md:text-xl text-[#3a3a3a]">
          ผมเชื่อว่าทุกระบบที่ดี เริ่มจากความเข้าใจในธรรมชาติของมนุษย์  
          เหมือนพรานที่ต้องฟังเสียงลม เห็นรอยเท้า และรอจังหวะที่เหมาะสม  
          นักพัฒนาก็เช่นกัน — ต้องฟังข้อมูล เห็นปัญหา และสร้างทางออกที่แม่นยำ  
          ทุกโค้ดที่ผมเขียน จึงไม่ใช่แค่คำสั่งของเครื่อง  
          แต่มันคือรอยเท้าของความตั้งใจ ที่จะสร้างสิ่งที่มีชีวิตขึ้นมาจากศูนย์
        </p>
      </motion.div>
    </Section>
  );
}
