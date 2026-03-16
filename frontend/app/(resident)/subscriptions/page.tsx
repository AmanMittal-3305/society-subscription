"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  IndianRupee,
  CheckCircle,
  Clock3,
  FileText,
} from "lucide-react";

export default function SubscriptionPage() {
  const [subscriptions, setSubscriptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const fetchSubscriptions = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        "http://localhost:5000/api/resident/subscriptions",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSubscriptions(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-6">Loading subscriptions...</div>;
  }

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      <h1 className="text-2xl font-bold mb-6">Monthly Subscription Status</h1>

      <div className="grid gap-4">
        {subscriptions.map((item, index) => (
          <motion.div
            key={item.record_id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white p-5 rounded-xl shadow border"
          >
            <div className="flex justify-between items-center">
              <div>
                <h2 className="font-semibold text-lg">
                  {new Date(item.billing_month).toLocaleDateString()}
                </h2>

                <p className="flex items-center gap-2 text-gray-600 mt-2">
                  <IndianRupee size={16} />
                  Amount: ₹{item.amount}
                </p>

                <p className="mt-1 text-gray-600">
                  Payment Mode: {item.payment_mode || "Not Paid"}
                </p>

                <p className="mt-1">
                  Status:
                  <span
                    className={`ml-2 font-medium ${
                      item.status === "PAID"
                        ? "text-green-600"
                        : item.status === "PARTIAL"
                        ? "text-blue-600"
                        : "text-yellow-600"
                    }`}
                  >
                    {item.status === "PAID" ? (
                      <CheckCircle className="inline w-4 h-4 mr-1" />
                    ) : (
                      <Clock3 className="inline w-4 h-4 mr-1" />
                    )}
                    {item.status}
                  </span>
                </p>
              </div>

              <div className="flex flex-col gap-2">
                <Link
                  href={`/subscriptions/${item.record_id}`}
                  className="text-blue-600 font-medium"
                >
                  View Details
                </Link>

                {item.receipt_url && (
                  <a
                    href={item.receipt_url}
                    target="_blank"
                    className="text-green-600 flex items-center gap-1"
                  >
                    <FileText size={16} />
                    Receipt
                  </a>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}