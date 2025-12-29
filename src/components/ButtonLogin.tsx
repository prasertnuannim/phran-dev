"use client";

import { useState } from "react";
import { Dialog, DialogPanel } from "@headlessui/react";
import { SocialSignInButton } from "./auth/SocialSignInButton";
import { FaGithub } from "react-icons/fa";
import LoginForm from "./auth/LoginForm";

export function ButtonLogin() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <nav className="fixed top-0 left-0 w-full flex items-center justify-between px-8 py-4 z-50">
        <div />
        <button
          onClick={() => setIsOpen(true)}
          className="px-4 py-2 rounded-md border border-white/30 text-white hover:bg-white/10 transition"
        >
          Login
        </button>
      </nav>

      <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="relative z-50">
        <div
          aria-hidden="true"
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/40 backdrop-blur-sm cursor-pointer"
        />

        <div className="fixed inset-0 flex items-center justify-center p-4">
          <DialogPanel
            className="
              relative max-w-3xl w-full p-1
              rounded-2xl border border-white/20
              bg-white/10 backdrop-blur-xl 
              shadow-[0_8px_32px_rgba(0,0,0,0.25)]
              animate-fadeScale
            "
          >
            <div className="flex flex-col md:flex-row overflow-hidden rounded-2xl">

              {/* SOCIAL SECTION */}
              <div className="flex flex-col justify-center gap-4 p-8 md:w-1/2 bg-white/5 backdrop-blur-lg text-gray-100">
                <h2 className="text-2xl font-semibold mb-2">Login</h2>

                <SocialSignInButton />

                <SocialSignInButton
                  provider="github"
                  label="Continue with GitHub"
                  icon={<FaGithub className="w-5 h-5 mr-2" />}
                />

                <p className="mt-3 text-xs text-gray-300">
                  By logging in, you agree to our Terms of Service.
                </p>
              </div>

              {/* EMAIL SECTION */}
              <div className="flex flex-col justify-center gap-4 p-8 md:w-1/2 bg-black/20 backdrop-blur-lg text-gray-100 border-l border-white/10">
                <LoginForm />
              </div>
            </div>
          </DialogPanel>
        </div>
      </Dialog>
    </>
  );
}
