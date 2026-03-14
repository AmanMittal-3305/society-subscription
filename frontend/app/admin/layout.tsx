import type { Metadata } from "next";
import AdminSidebar from "@/components/AdminSidebar";

export const metadata: Metadata = {
    title: "Admin Dashboard - SocietyHub",
    description: "Manage your society seamlessly",
};

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex bg-slate-50 min-h-screen font-sans">
            <AdminSidebar />
            <main className="flex-1 w-full max-h-screen overflow-y-auto pt-16 lg:pt-0">
                {children}
            </main>
        </div>
    );
}
