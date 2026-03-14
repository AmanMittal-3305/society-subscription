import type { Metadata } from "next";
import ResidentSidebar from "@/components/ResidentSidebar";

export const metadata: Metadata = {
    title: "Resident Dashboard - SocietyHub",
    description: "Manage your society seamlessly",
};

export default function ResidentLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex bg-slate-50 min-h-screen font-sans">
            <ResidentSidebar />
            <main className="flex-1 w-full max-h-screen overflow-y-auto pt-16 lg:pt-0">
                {children}
            </main>
        </div>
    );
}
