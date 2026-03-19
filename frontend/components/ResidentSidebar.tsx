"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import {
    Home,
    User,
    CreditCard,
    Wallet,
    LogOut,
    Menu,
    X,
    // Bell
} from "lucide-react";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: Home },
    { name: "Subscriptions", href: "/subscriptions", icon: CreditCard },
    { name: "Pay Now", href: "/pay-now", icon: Wallet },
    { name: "Notifications", href: "/notification" }
];

export default function ResidentSidebar() {
    const pathname = usePathname();
    const router = useRouter();

    const [isOpen, setIsOpen] = useState(false);
    const [hasUnread, setHasUnread] = useState(false);

    useEffect(() => {
        setIsOpen(false);
    }, [pathname]);

    useEffect(() => {
        fetchUnread();
    }, []);

    const fetchUnread = async () => {
        try {
            const token = localStorage.getItem("token");

            const res = await axios.get(`${API}/api/resident/notifications/unread`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            setHasUnread(res.data.unread > 0);

        } catch (err) {
            console.error(err);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        router.replace("/login");
    };

    const SidebarContent = () => (
        <>
            <div className="h-20 flex items-center justify-between px-8 border-b border-slate-800 shrink-0">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-500 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-indigo-500/20">
                        S
                    </div>
                    <h1 className="text-white font-bold text-xl tracking-wide">
                        Society<span className="text-indigo-400">Hub</span>
                    </h1>
                </div>

                <button
                    className="lg:hidden text-slate-400 hover:text-white transition-colors"
                    onClick={() => setIsOpen(false)}
                >
                    <X className="w-6 h-6" />
                </button>
            </div>

            <div className="flex-1 overflow-y-auto py-6 px-4 no-scrollbar">
                <div className="space-y-1.5">
                    <p className="px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">
                        Menu
                    </p>

                    {navItems.map((item) => {
                        const isActive =
                            pathname === item.href ||
                            (pathname?.startsWith(item.href + "/") && item.href !== "/");

                        const Icon = item.icon;

                        return (
                            <Link key={item.name} href={item.href} className="block relative">
                                {isActive && (
                                    <motion.div
                                        layoutId="residentActiveTab"
                                        className="absolute inset-0 bg-indigo-500/10 rounded-xl border border-indigo-500/20"
                                        initial={false}
                                        transition={{
                                            type: "spring",
                                            stiffness: 300,
                                            damping: 30
                                        }}
                                    />
                                )}

                                <div
                                    className={`relative flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 z-10 group ${
                                        isActive
                                            ? "text-indigo-400 font-medium"
                                            : "hover:bg-slate-800/50 hover:text-white"
                                    }`}
                                >
                                    <div className="relative">
                                        

                                        {item.name === "Notifications" 
                                        }
                                    </div>

                                    <span className="text-[15px]">{item.name}</span>

                                    {isActive && (
                                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-indigo-500 rounded-r-full" />
                                    )}
                                </div>
                            </Link>
                        );
                    })}

                    <p className="px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4 mt-8">
                        Account
                    </p>

                    <Link href="/profile" className="block relative">
                        <div className="relative flex items-center gap-3 px-4 py-3.5 rounded-xl hover:bg-slate-800/50 hover:text-white transition-all duration-200 z-10 group">
                            <User className="w-5 h-5 text-slate-400 group-hover:text-slate-300" />
                            <span className="text-[15px]">My Profile</span>
                        </div>
                    </Link>
                </div>
            </div>

            <div className="p-4 border-t border-slate-800 shrink-0">
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-4 py-3.5 w-full rounded-xl hover:bg-slate-800/50 text-slate-400 hover:text-white transition-all duration-200 group"
                >
                    <LogOut className="w-5 h-5 text-slate-400 group-hover:text-amber-400 transition-colors" />
                    <span className="text-[15px] font-medium group-hover:text-amber-400 transition-colors">
                        Logout
                    </span>
                </button>
            </div>
        </>
    );

    return (
        <>
            <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-slate-900 z-40 flex items-center justify-between px-4 border-b border-slate-800">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center text-white font-bold">
                        S
                    </div>
                    <span className="text-white font-bold tracking-wide">
                        Society<span className="text-indigo-400">Hub</span>
                    </span>
                </div>

                <button
                    onClick={() => setIsOpen(true)}
                    className="text-slate-300 hover:text-white p-2 transition-colors"
                >
                    <Menu className="w-6 h-6" />
                </button>
            </div>

            <aside className="hidden lg:flex w-72 bg-slate-900 min-h-screen text-slate-300 flex-col border-r border-slate-800 shrink-0 sticky top-0 h-screen">
                <SidebarContent />
            </aside>

            <AnimatePresence>
                {isOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                            className="lg:hidden fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-50"
                        />

                        <motion.aside
                            initial={{ x: "-100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "-100%" }}
                            transition={{
                                type: "spring",
                                stiffness: 300,
                                damping: 30
                            }}
                            className="lg:hidden fixed top-0 left-0 bottom-0 w-72 bg-slate-900 text-slate-300 flex flex-col z-50 shadow-2xl"
                        >
                            <SidebarContent />
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}