"use client";

import { motion } from "framer-motion";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 relative overflow-hidden">
      {/* Animated background orbs */}
      <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-indigo-500/20 rounded-full blur-[128px] -translate-x-1/2 -translate-y-1/2 animate-pulse" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[128px] translate-x-1/3 translate-y-1/3" />
      <div className="absolute top-1/2 left-1/2 w-[400px] h-[400px] bg-violet-500/10 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2" />

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10 w-[1100px] max-w-[95vw] grid grid-cols-1 lg:grid-cols-2 rounded-3xl overflow-hidden shadow-2xl shadow-black/30 border border-white/10 backdrop-blur-xl bg-white/5"
      >
        {/* Image Section */}
        <div className="hidden lg:block relative overflow-hidden">
          <img
            src="https://www.manglamgroup.com/wp-content/uploads/2024/01/swimmingpool-Corner-Night_cc.jpg"
            className="h-full w-full object-cover"
            alt="Society"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent" />
          <div className="absolute bottom-8 left-8 right-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500 flex items-center justify-center text-white font-bold text-2xl shadow-lg shadow-indigo-500/30">
                S
              </div>
              <h1 className="text-white font-bold text-3xl tracking-wide">
                Society<span className="text-indigo-400">Hub</span>
              </h1>
            </div>
            <p className="text-white/70 text-sm leading-relaxed max-w-xs">
              Manage your society subscriptions, payments, and records — all in one place.
            </p>
          </div>
        </div>

        {/* Form Section */}
        <div className="p-10 lg:p-12 flex flex-col justify-center bg-white relative">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-indigo-500 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-indigo-500/20">
              S
            </div>
            <h1 className="text-slate-900 font-bold text-2xl tracking-wide">
              Society<span className="text-indigo-600">Hub</span>
            </h1>
          </div>
          {children}
        </div>
      </motion.div>
    </div>
  );
}