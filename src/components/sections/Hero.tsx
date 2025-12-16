"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import Section from "./Section";
import { ButtonLogin } from "../ButtonLogin";

export default function Hero() {
  return (
    <Section
      id="home"
      bg="bg-gradient-to-br from-gray-100 via-sky-200 to-gray-700"
      className="
        relative flex flex-col-reverse md:flex-row
        items-center justify-center min-h-screen overflow-hidden
        text-[#2b2b2b] px-6 md:px-16
      "
    >
       <ButtonLogin />
      {/* Left: Text */}
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1 }}
        className="z-10 w-full md:w-1/2 flex flex-col justify-center text-center md:text-left"
      >
 <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1 }}
      className="xl:px-20 text-center md:text-left"
    >
      <motion.h1
        initial={{ backgroundPosition: "0% 50%" }}
        animate={{ backgroundPosition: "100% 50%" }}
        transition={{
          repeat: Infinity,
          repeatType: "reverse",
          duration: 6,
          ease: "linear",
        }}
        className="
          font-[var(--font-playfair)]
          text-5xl md:text-6xl font-bold tracking-tight mb-4
          bg-gradient-to-r from-green-800 via-gray-300 to-green-800
          bg-[length:200%_200%]
          bg-clip-text text-transparent
        "
      >
        Phran Dev
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 1 }}
        className="
          text-xl md:text-2xl leading-relaxed mb-8 font-[var(--font-sans)]
          bg-gradient-to-r from-gray-400 via-gray-800 to-gray-400
          bg-[length:200%_200%]
          bg-clip-text text-transparent
          animate-gradient-x
        "
      >
        สร้างความฝัน ล่าความคิด  
        ที่ซึ่งสัญชาตญาณของพราน มาบรรจบกับความคิดสร้างสรรค์ของนักพัฒนา
      </motion.p>
    </motion.div>


      </motion.div>

      {/* Right: Image */}
      <motion.div
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1 }}
        className="relative flex justify-center items-center w-full md:w-1/2 h-[55vh] md:h-screen"
      >
        <Image
          src="/images/phran-hunter.png"
          alt="Pharan Hunter Developer"
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-contain object-center drop-shadow-[0_10px_20px_rgba(0,0,0,0.1)]"
          loading="eager"
          priority
        />
      </motion.div>

      {/* Soft light overlay */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top_left,rgba(255,255,255,0.4),transparent_70%)]" />
    </Section>
  );
}
