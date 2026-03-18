"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { getToken } from "firebase/messaging";
import { messaging } from "@/lib/firebase";
import axios from "axios";
import Link from "next/link";

import {
    Building2,
    Users,
    IndianRupee,
    AlertTriangle,
    ArrowUpRight,
    ArrowDownRight,
    Activity,
    CreditCard
} from "lucide-react";

export default function DashboardPage() {
    const [data, setData] = useState({
        total_flats: 0,
        total_residents: 0,
        total_collected: 0,
        total_pending: 0,
        // collectedRes: 0,
        recent_transactions: [],
        revenue_analytics: { months: [] as string[], amounts: [] as number[] }
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const token = localStorage.getItem("token");
                const res = await axios.get("http://localhost:5000/api/admin/dashboard", {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                if (res.data.success) {
                    setData(res.data.data);
                }
            } catch (error) {
                console.error("Failed to fetch dashboard data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchDashboardData();
    }, []);

    const formatCurrency = (amount: number) => {
        if (amount >= 100000) {
            return `₹${(amount / 100000).toFixed(2)}L`;
        } else if (amount >= 1000) {
            return `₹${(amount / 1000).toFixed(1)}K`;
        }
        return `₹${amount}`;
    };

    const stats = [
        {
            name: "Total Flats",
            value: data.total_flats.toString(),
            icon: Building2,
            trend: "Currently Managed",
            trendUp: true,
        },
        {
            name: "Active Residents",
            value: data.total_residents.toString(),
            icon: Users,
            trend: "Registered Residents",
            trendUp: true,
        },
        {
            name: "Revenue Collected",
            value: formatCurrency(data.total_collected),
            icon: IndianRupee,
            trend: "All-time specific",
            trendUp: true,
        },
        {
            name: "Pending Dues",
            value: formatCurrency(data.total_pending),
            icon: AlertTriangle,
            trend: "Needs attention",
            trendUp: data.total_pending === 0, // green if 0, else red
        },
    ];

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-slate-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    const { months, amounts } = data.revenue_analytics;
    const maxAmount = Math.max(...amounts, 1); // Avoid division by zero

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8 min-h-screen bg-slate-50">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Dashboard Overview</h1>
                    <p className="text-slate-500 mt-2">Welcome back. Here's your society data today.</p>
                </div>
                {/* <div className="flex items-center gap-4">
                    <button className="bg-white px-4 py-2 border border-slate-200 text-slate-700 rounded-lg shadow-sm flex items-center gap-2">
                        <span className="relative flex h-2.5 w-2.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                        </span>
                        <span className="text-sm font-medium">System Operational</span>
                    </button>
                </div> */}
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, i) => {
                    const Icon = stat.icon;
                    return (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            key={stat.name}
                            className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden group hover:-translate-y-1"
                        >
                            <div className="flex justify-between items-start mb-4 relative z-10">
                                <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300 shadow-sm group-hover:shadow-indigo-500/30">
                                    <Icon className="w-6 h-6" />
                                </div>
                                {stat.trendUp ? (
                                    <span className="flex items-center text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
                                        <ArrowUpRight className="w-3.5 h-3.5 mr-1" />
                                        {stat.trend}
                                    </span>
                                ) : (
                                    <span className="flex items-center text-xs font-semibold text-rose-600 bg-rose-50 px-2.5 py-1 rounded-full border border-rose-100">
                                        <ArrowDownRight className="w-3.5 h-3.5 mr-1" />
                                        {stat.trend}
                                    </span>
                                )}
                            </div>
                            <div className="relative z-10">
                                <h3 className="text-slate-500 text-sm font-medium">{stat.name}</h3>
                                <p className="text-3xl font-bold text-slate-900 mt-1 tracking-tight">{stat.value}</p>
                            </div>

                            {/* Decorative background circle */}
                            <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-gradient-to-br from-indigo-50/50 to-slate-50/50 rounded-full blur-2xl opacity-50 group-hover:opacity-100 transition-opacity" />
                        </motion.div>
                    );
                })}
            </div>

            {/* Main Content Area */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">

                {/* Visual Chart Area */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="xl:col-span-2 bg-white rounded-3xl border border-slate-100 shadow-sm p-6 lg:p-8"
                >
                    <div className="flex justify-between items-center mb-8">
                        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                            <Activity className="w-6 h-6 text-indigo-500" />
                            Revenue Analytics (Billed)
                        </h2>
                    </div>

                    <div className="h-72 w-full flex items-end gap-3 sm:gap-6 px-2 pb-4 pt-10 border-b border-slate-100">
                        {months.length === 0 ? (
                            <div className="w-full h-full flex items-center justify-center text-slate-400">
                                No records found in the past months.
                            </div>
                        ) : (
                            amounts.map((amount, i) => {
                                const heightPercentage = (amount / maxAmount) * 100;
                                return (
                                    <div key={i} className="flex-1 flex flex-col items-center justify-end gap-3 group relative h-full">
                                        <motion.div
                                            initial={{ height: 0 }}
                                            animate={{ height: `${heightPercentage}%` }}
                                            transition={{ duration: 1.2, delay: 0.5 + (i * 0.1), type: "spring", stiffness: 50 }}
                                            className="w-full bg-indigo-100/70 hover:bg-indigo-500 rounded-lg group-hover:shadow-[0_0_15px_rgba(99,102,241,0.4)] transition-all duration-300 relative cursor-pointer"
                                        >
                                            <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-xs font-medium px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none transform translate-y-2 group-hover:translate-y-0 shadow-lg whitespace-nowrap z-10">
                                                ₹{amount.toLocaleString()}
                                                {/* Tooltip caret */}
                                                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-900"></div>
                                            </div>
                                        </motion.div>
                                        <span className="text-sm font-semibold text-slate-400 group-hover:text-slate-700 transition-colors">
                                            {months[i]}
                                        </span>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </motion.div>

                {/* Recent Activity */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 lg:p-8"
                >
                    <div className="flex justify-between items-center mb-8">
                        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                            <CreditCard className="w-6 h-6 text-indigo-500" />
                            Recent Entries
                        </h2>
                        <button className="text-indigo-600 text-sm font-bold hover:text-indigo-700 transition-colors">
                            <Link href="/admin/monthly-records">View All</Link>
                        </button>
                    </div>

                    <div className="space-y-6">
                        {data.recent_transactions.length === 0 ? (
                            <div className="text-slate-400 text-center text-sm py-4">No recent monthly records.</div>
                        ) : (
                            data.recent_transactions.map((tx: any) => (
                                <div key={tx.id} className="flex items-center justify-between group p-2 -mx-2 rounded-2xl hover:bg-slate-50 transition-colors cursor-pointer">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center border border-slate-100 group-hover:border-indigo-100 group-hover:bg-indigo-50 transition-colors shadow-sm">
                                            <Building2 className="w-5 h-5 text-slate-500 group-hover:text-indigo-600 transition-colors" />
                                        </div>
                                        <div>
                                            <h4 className="text-[15px] font-bold text-slate-900 group-hover:text-indigo-600 transition-colors whitespace-nowrap">Flat {tx.flat}</h4>
                                            <p className="text-xs font-medium text-slate-500">
                                                {new Date(tx.date).toLocaleDateString("en-US", { year: "numeric", month: "short" })}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[15px] font-bold text-slate-900">₹{parseFloat(tx.amount).toLocaleString()}</p>
                                        <span className={`inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wide ${tx.status === 'PAID' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                                            {tx.status}
                                        </span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </motion.div>
            </div>
        </div>
    );
}