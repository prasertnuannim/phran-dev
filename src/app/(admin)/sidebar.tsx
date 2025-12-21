// "use client";

// import { useState } from "react";
// import { ChevronLeft, ChevronRight, Settings, User } from "lucide-react";
// import clsx from "clsx";
// import Link from "next/link";
// import { usePathname } from "next/navigation";

// export default function Sidebar() {
//   const pathname = usePathname();
//   const [isExpanded, setIsExpanded] = useState(false);

//   const menuItems = [
//     { icon: <User size={20} />, label: "Accounts", href: "/account" },
//     {
//       icon: <Settings size={20} />,
//       label: "Auth",
//       href: "/auth-settings",
//     },
//   ];

//   return (
//     <div
//       className={clsx(
//         "h-screen bg-gray-800 text-white transition-all duration-300 flex flex-col",
//         isExpanded ? "w-54" : "w-16"
//       )}
//     >
//       {/* Toggle Button */}
//       <div className="flex items-center justify-between py-3 px-1 verflow-visible">
//         <span
//           className={clsx(
//             "text-xl font-bold transition-opacity",
//             !isExpanded && "opacity-0"
//           )}
//         >
//           MyApp
//         </span>
//         <button
//           onClick={() => setIsExpanded((prev) => !prev)}
//           className={`
//     z-10 p-1 rounded-full
//     transition-all duration-200 ease-out
//     shadow-sm hover:shadow
//     ${
//       isExpanded
//         ? "bg-white text-gray-800 hover:bg-gray-400 hover:text-white"
//         : "bg-white text-gray-800 hover:bg-gray-400 hover:text-white"
//     }
//   `}
//         >
//           {isExpanded ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
//         </button>
//       </div>

//       {/* Menu Items */}
//       <ul className="flex-1 space-y-2 mt-4 px-2">
//         {menuItems.map((item, i) => (
//           <li key={i}>
//             <Link
//               href={item.href}
//               className={clsx(
//                 "group relative flex gap-4 px-3 py-2 hover:bg-gray-700 rounded transition-colors",
//                 !isExpanded && "items-center justify-center",
//                 pathname === item.href && "bg-gray-700 font-semibold"
//               )}
//             >
//               {item.icon}
//               {isExpanded && <span>{item.label}</span>}

//               {/* Tooltip when collapsed */}
//               {!isExpanded && (
//                 <span className="absolute left-full ml-2 hidden group-hover:block bg-black text-white text-xs px-2 py-1 rounded z-10 whitespace-nowrap">
//                   {item.label}
//                 </span>
//               )}
//             </Link>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// }

"use client";

import { useState, type ReactNode } from "react";
import {
    Home,
    BarChart,
    Layers,
    CheckCircle,
    Clock,
    ChevronDown,
    Power,
} from "lucide-react";
import clsx from "clsx";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSidebar } from "@/context/sidebar-context";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogoutButton } from "@/components/auth/LogoutButton";

type SidebarProfile = {
    name: string;
    email: string | null;
    role: string | null;
    image: string | null;
};

export default function Sidebar({ profile }: { profile: SidebarProfile | null }) {
    const { open } = useSidebar();
    const pathname = usePathname() ?? ""; // ⭐ ตรวจเส้นทางปัจจุบัน
    const [statisticsSubmenuOverride, setStatisticsSubmenuOverride] = useState<
        boolean | null
    >(null);
    const avatarSrc =
        profile?.image && profile.image.trim().length > 0
            ? profile.image
            : "/avatar1.png";

    // ตรวจว่า submenu ควร active ไหม
    const isStatisticsActive =
        pathname.startsWith("/statistics") ||
        pathname === "/statistics";

    const statisticsSubmenuOpen =
        open &&
        (isStatisticsActive
            ? statisticsSubmenuOverride ?? true
            : statisticsSubmenuOverride === true);

    const toggleStatisticsSubmenu = () => {
        setStatisticsSubmenuOverride((prev) => {
            const currentlyOpen =
                open &&
                (isStatisticsActive ? (prev ?? true) : prev === true);
            return currentlyOpen ? false : true;
        });
    };

    return (
        <div
            className={clsx(
                "bg-gray-300 h-screen flex flex-col transition-all duration-500 rounded-2xl p-5 shadow-xl",
                open ? "w-72" : "w-20"
            )}
        >
            {/* Avatar */}
            <div className={clsx("flex flex-col items-center transition-all", open ? "mt-5 mb-6" : "mt-5 mb-5")}>
                <Avatar
                    className={clsx(
                        "border border-white bg-white",
                        open ? "h-[70px] w-[70px]" : "h-[50px] w-[50px]"
                    )}
                >
                    <AvatarImage
                        src={avatarSrc}
                        alt={profile?.name ?? "User"}
                        referrerPolicy="no-referrer"
                    />
                    <AvatarFallback className="text-gray-800">
                        {(profile?.name?.charAt(0)?.toUpperCase() ?? "?")}
                    </AvatarFallback>
                </Avatar>

                {open && (
                    <>
                        <h2 className="text-white font-semibold mt-3">
                            {profile?.name ?? "Guest"}
                        </h2>
                        <span className="text-white/70 text-sm">
                            {profile?.role ?? profile?.email ?? "Not signed in"}
                        </span>
                        <div className="flex items-center gap-1 mt-2">
                            <span className="inline-block w-3 h-3 bg-green-500 rounded-full"></span>
                            <span className="text-xs text-white/60">Online</span>
                        </div>
                    </>
                )}
            </div>

            {/* MENU */}
            {open ? (
                <>
                    <p className="text-white/70 text-xs mt-6 mb-3 uppercase tracking-wide">Favourites</p>

                    <div className="flex flex-col space-y-2">

                        {/* HOME */}
                        <MenuItem
                            href="/account"
                            icon={<Home size={20} />}
                            label="Accounts"
                            active={pathname === "/"}
                            open={open}
                        />

                        {/* DASHBOARD */}
                        <MenuItem
                            href="/auth-settings"
                            icon={<BarChart size={20} />}
                            label="Settings"
                            active={pathname.startsWith("/dashboard")}
                            open={open}
                        />
                    </div>

                    {/* STATISTICS */}
                    <div className="mt-3">
                        <button
                            onClick={toggleStatisticsSubmenu}
                            className={clsx(
                                "flex items-center w-full gap-3 px-3 py-2 rounded-xl hover:bg-white/20 transition cursor-pointer text-white/90",
                                isStatisticsActive && "bg-white/20 border border-white/10"
                            )}
                        >
                            <Layers size={20} />
                            <span>Statistics</span>

                            <ChevronDown
                                size={18}
                                className={clsx(
                                    "ml-auto transition-transform",
                                    statisticsSubmenuOpen ? "rotate-180" : "rotate-0"
                                )}
                            />
                        </button>

                        <AnimatePresence initial={false}>
                            {statisticsSubmenuOpen && (
                                <motion.div
                                    key="submenu"
                                    initial={{ opacity: 0, height: 0, y: -10 }}
                                    animate={{ opacity: 1, height: "auto", y: 0 }}
                                    exit={{ opacity: 0, height: 0, y: -10 }}
                                    transition={{ duration: 0.25, ease: "easeOut" }}
                                    className="pl-10 flex flex-col mt-1 space-y-1"
                                >
                                    <SubMenuItem
                                        href="/statistics/daily"
                                        label="Daily Report"
                                        active={pathname === "/statistics/daily"}
                                    />
                                    <SubMenuItem
                                        href="/statistics/monthly"
                                        label="Monthly KPI"
                                        active={pathname === "/statistics/monthly"}
                                    />
                                    <SubMenuItem
                                        href="/statistics/yearly"
                                        label="Yearly Summary"
                                        active={pathname === "/statistics/yearly"}
                                    />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* OTHER */}
                    <div className="flex flex-col space-y-2 mt-1">
                        <MenuItem
                            href="/approvals"
                            icon={<CheckCircle size={20} />}
                            label="Approvals"
                            active={pathname.startsWith("/approvals")}
                            open={open}
                        />
                        <MenuItem
                            href="/timesheets"
                            icon={<Clock size={20} />}
                            label="Timesheets"
                            active={pathname.startsWith("/timesheets")}
                            open={open}
                        />
                    </div>
                </>
            ) : (
                // COLLAPSED MODE
                <>
                    <div className="flex flex-col items-center space-y-6 mt-4">

                        <IconBtn href="/" icon={<Home size={22} />} active={pathname === "/"} />

                        <IconBtn
                            href="/dashboard"
                            icon={<BarChart size={22} />}
                            active={pathname.startsWith("/dashboard")}
                        />

                        <IconBtn
                            icon={<Layers size={22} />}
                            active={isStatisticsActive}
                            onClick={toggleStatisticsSubmenu}
                        />

                        <IconBtn
                            href="/approvals"
                            icon={<CheckCircle size={22} />}
                            active={pathname.startsWith("/approvals")}
                        />

                        <IconBtn
                            href="/timesheets"
                            icon={<Clock size={22} />}
                            active={pathname.startsWith("/timesheets")}
                        />
                    </div>
                </>
            )}

            {/* SIGN OUT */}
            <div className="mt-auto">
                <LogoutButton
                    callbackUrl="/"
                    icon={<Power size={20} className="text-white" />}
                    showText={open}
                    text="Sign Out"
                    className={clsx(
                        "w-full bg-transparent hover:bg-white/20 border-0 px-2 py-2 rounded-xl transition text-white/90",
                        open ? "justify-start" : "justify-center"
                    )}
                />
            </div>
        </div>
    );
}

/* ---------------------------------------------------------------------- */
/* COMPONENTS */
/* ---------------------------------------------------------------------- */

type MenuItemProps = {
    href: string;
    icon: ReactNode;
    label: string;
    active: boolean;
    open: boolean;
};

function MenuItem({ href, icon, label, active, open }: MenuItemProps) {
    return (
        <Link
            href={href}
            className={clsx(
                "flex items-center gap-3 px-3 py-2 rounded-xl transition cursor-pointer",
                "text-white/90 hover:bg-white/20",
                active && "bg-white/30 border border-white/20 shadow-inner"
            )}
        >
            {icon}
            {open && <span>{label}</span>}
        </Link>
    );
}

type SubMenuItemProps = {
    label: string;
    href: string;
    active: boolean;
};

function SubMenuItem({ label, href, active }: SubMenuItemProps) {
    return (
        <Link
            href={href}
            className={clsx(
                "py-2 text-white/80 hover:text-white transition",
                active && "text-white font-semibold"
            )}
        >
            {label}
        </Link>
    );
}

type IconBtnProps = {
    icon: ReactNode;
    active?: boolean;
    onClick?: () => void;
    href?: string;
};

function IconBtn({ icon, active, onClick, href }: IconBtnProps) {
    const Btn = (
        <button
            onClick={onClick}
            className={clsx(
                "p-3 rounded-2xl transition flex items-center justify-center text-white/80 hover:text-white",
                active
                    ? "bg-white/30 border border-white/20 shadow-inner"
                    : "hover:bg-white/20"
            )}
        >
            {icon}
        </button>
    );

    return href ? <Link href={href}>{Btn}</Link> : Btn;
}
