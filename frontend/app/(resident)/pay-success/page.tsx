"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import axios from "axios";

export default function PaySuccess() {
  const params = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const savePayment = async () => {
      try {
        const token = localStorage.getItem("token");

        await axios.post(
          "http://localhost:5000/api/resident/pay-now",
          {
            record_id: params.get("record_id"),
            payment_mode: "ONLINE",
            transaction_id: params.get("session_id")
          },
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        router.push("/dashboard");

      } catch (err) {
        console.error(err);
      }
    };

    savePayment();
  }, [params, router]);

  return (
    <div className="p-8 text-center">
      Processing payment...
    </div>
  );
}