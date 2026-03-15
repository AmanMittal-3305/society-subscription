"use client";

import ResidentSidebar from "@/components/ResidentSidebar";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ResidentLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();

    useEffect(() => {
        const role = localStorage.getItem("role");

        if (role !== "RESIDENT") {
            router.push("/login");
        }
    }, [router]);

    return (
        <div className="flex bg-slate-50 min-h-screen font-sans">
            <ResidentSidebar />
            <main className="flex-1 w-full max-h-screen overflow-y-auto pt-16 lg:pt-0">
                {children}
            </main>
        </div>
    );
}