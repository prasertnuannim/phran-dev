"use client";

import { signOut } from "next-auth/react";
import { TooltipButton } from "@/components/ui/tooltip-button";
import { FaSignOutAlt } from "react-icons/fa";



export function LogoutButton() {
  const handleClick = async () => {
    await signOut({ callbackUrl: "/" });
  };

  return (
    <TooltipButton label="Logout" onClick={handleClick} className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-lg flex items-center space-x-2">
      <FaSignOutAlt />
    </TooltipButton>
  );
}
