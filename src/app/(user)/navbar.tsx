import ColorMotionInChar from "@/components/motion/colorMotionInChar";
import { LogoutButton } from "@/components/auth/LogoutButton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getServerAuthSession } from "@/server/services/auth/sessionService";
import React from "react";

export default async function navbar() {
  const session = await getServerAuthSession();
  const userInitial = session?.user?.name?.charAt(0)?.toUpperCase() ?? "?";
  return (
    <header className="bg-gray-600 w-full">
      <div className="max-w-screen flex flex-wrap items-center justify-between px-6 py-2">
        <div className="font-bold text-md">
          <ColorMotionInChar
            className="pl-1 text-[28px]"
            colors={["#FF5733", "#33FF57", "#3357FF", "#F0F"]}
            name="Dashboard"
          />
        </div>

        {session?.user ? (
          <div className="flex items-center space-x-4">
            <div className="text-sm text-right">
              <div className="tracking-[-0.5em] font-bold text-md">
                <ColorMotionInChar
                  className="pl-1 text-[16px]"
                  name={session.user.name ?? "User"}
                />
              </div>
            </div>
            <Avatar className="h-10 w-10 border border-white/20 bg-gray-700">
              <AvatarImage
                src={session.user.image ?? undefined}
                alt={session.user.name ?? "User avatar"}
              />
              <AvatarFallback className="text-sm text-white">
                {userInitial}
              </AvatarFallback>
            </Avatar>
            <LogoutButton />
          </div>
        ) : (
          <div className="text-sm text-red-400">Not logged in</div>
        )}
      </div>
    </header>
  );
}
