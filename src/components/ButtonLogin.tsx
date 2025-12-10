"use client";

import { useState } from "react";
import { Dialog, DialogPanel } from "@headlessui/react";
import { SocialSignInButton } from "./auth/SocialSignInButton";
import { FaGithub } from "react-icons/fa";

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
      <Dialog
        open={isOpen}
        onClose={() => setIsOpen(false)}
        className="relative z-50"
      >
        {/* Overlay */}
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
          aria-hidden="true"
        />

        {/* Center Modal */}
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <DialogPanel
            className="p-1
        rounded-2xl
        border border-white/20 
        bg-white/10 
        backdrop-blur-2xl 
        shadow-[0_8px_32px_rgba(0,0,0,0.25)]
        animate-fadeScale
      "
          >
            <div className="relative z-10 w-full max-w-4xl">
              <div
                className="
                        rounded-2xl border-black/5
                        backdrop-blur-md shadow-xl
                        overflow-hidden flex flex-col md:flex-row
                      "
              >
                <div className="flex flex-col justify-center gap-4 text-white p-6 md:p-8 w-full">
                  <h2 className="text-xl sm:text-2xl font-semibold">Login</h2>
                  <SocialSignInButton />
                  <SocialSignInButton
                    provider="github"
                    label="Continue with GitHub"
                    icon={<FaGithub className="w-5 h-5 mr-2" />}
                  />

                  <p className="mt-2 text-xs text-white/70">
                    By logging in, you agree to our Terms of Service.
                  </p>
                </div>
              </div>
            </div>
          </DialogPanel>
        </div>
      </Dialog>
    </>
  );
}
