"use client";

import { useState } from "react";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";

export function ButtonLogin() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* NAVBAR */}
      <nav className="fixed top-0 left-0 w-full flex items-center justify-between px-8 py-4 z-50">
        <div />
        <button
          onClick={() => setIsOpen(true)}
          className="px-4 py-2 rounded-md border border-white/40 text-white/90 hover:bg-white/10 transition cursor-pointer"
        >
          Login
        </button>
      </nav>

      {/* MODAL */}
      <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="relative z-50">
        {/* Overlay */}
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity" aria-hidden="true" />

        {/* Center Modal */}
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <DialogPanel
            className="
        w-full max-w-sm rounded-2xl p-8
        border border-white/20 
        bg-white/10 
        backdrop-blur-2xl 
        shadow-[0_8px_32px_rgba(0,0,0,0.25)]
        animate-fadeScale
      "
          >
            <DialogTitle className="text-2xl font-semibold text-white/90 mb-6">
              Login
            </DialogTitle>

            {/* Form */}
            <form className="flex flex-col gap-4">
              <input
                type="email"
                placeholder="Email"
                className="
            w-full px-4 py-3 rounded-lg
            bg-white/20 border border-white/30
            placeholder-white/50 text-white
            backdrop-blur-md
            focus:outline-none focus:ring-2 focus:ring-blue-300/40
            transition
          "
              />

              <input
                type="password"
                placeholder="Password"
                className="
            w-full px-4 py-3 rounded-lg
            bg-white/20 border border-white/30
            placeholder-white/50 text-white
            backdrop-blur-md
            focus:outline-none focus:ring-2 focus:ring-blue-300/40
            transition
          "
              />

              <button
                type="submit"
                className="
    w-full px-4 py-3 rounded-md 
    bg-gradient-to-br from-blue-600 to-blue-400 
    text-white font-medium 
    backdrop-blur 
    shadow-lg shadow-blue-600/30
    transition-all duration-200
    hover:from-blue-500 hover:to-blue-300
    hover:shadow-blue-500/40
    cursor-pointer
  "
              >
                Sign in
              </button>


              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="text-sm text-white/70 hover:text-white mt-2 cursor-pointer"
              >
                Cancel
              </button>
            </form>
          </DialogPanel>
        </div>
      </Dialog>

    </>
  );
}
