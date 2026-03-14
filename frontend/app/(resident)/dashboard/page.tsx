"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import Link from "next/link";
import {
    Building2,
    IndianRupee,
    CreditCard,
    Bell,
} from "lucide-react";

export default function DashboardPage() {
    const [data, setData] = useState<any>(null);

    useEffect(() => {
        fetchDashboard();
    }, []);

    const fetchDashboard = async () => {
        try {
            const token = localStorage.getItem("token");

            const res = await axios.get(
                "http://localhost:5000/api/resident/dashboard",
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setData(res.data.data);
        } catch (error) {
            console.error(error);
        }
    };

    if (!data) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                Loading...
            </div>
        );
    }

    return (
        <div className="p-6 bg-slate-50 min-h-screen">
            <h1 className="text-2xl font-bold mb-6">Resident Dashboard</h1>

            <div className="grid md:grid-cols-4 gap-4 mb-8">
                <Card title="Flat Linked" value={data.flat.flat_number} icon={<Building2 />} />
                {/* <Card title="Current Due" value={`₹${data.currentMonth?.amount || 0}`} icon={<IndianRupee />} /> */}
                <Card title="Paid Amount" value={`₹${data.currentMonth?.paid || 0}`} icon={<IndianRupee />} />
                <Card title="Pending Amount" value={`₹${data.pendingAmount}`} icon={<CreditCard />} />
                <Card title="Status" value={data.currentMonth?.status || "No Record"} icon={<Bell />} />
            </div>

            <div className="bg-white rounded-xl p-6 shadow mb-6">
                <h2 className="font-semibold mb-4">Payment History</h2>

                <div className="space-y-3">
                    {data.paymentHistory.map((item: any, i: number) => (
                        <div key={i} className="flex justify-between border-b pb-2">

                            <span>
                                {new Date(item.billing_month).toLocaleDateString("en-IN", {
                                    month: "long",
                                    year: "numeric",
                                })}
                            </span>

                            <span>₹{item.amount}</span>

                            {/* <span>{item.status}</span> */}

                            {item.status !== "PAID" ? (
                                <Link
                                    href={`/pay-now/${item.record_id}`}
                                    className="bg-black text-white px-3 py-1 rounded"
                                >
                                    Pay Now
                                </Link>
                            ) : (
                                <span className="text-green-600">Paid</span>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow">
                <h2 className="font-semibold mb-4">Notifications</h2>

                <div className="space-y-3">
                    {data.notifications.map((n: any) => (
                        <div key={n.notification_id} className="border rounded-lg p-3">
                            <div className="font-medium">{n.title}</div>
                            <div className="text-sm text-gray-600">{n.message}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

function Card({
    title,
    value,
    icon,
}: {
    title: string;
    value: string;
    icon: any;
}) {
    return (
        <motion.div whileHover={{ scale: 1.03 }} className="bg-white rounded-xl p-5 shadow">
            <div className="flex justify-between items-center mb-3">
                <div>{title}</div>
                <div>{icon}</div>
            </div>

            <div className="text-2xl font-bold">{value}</div>
        </motion.div>
    );
}