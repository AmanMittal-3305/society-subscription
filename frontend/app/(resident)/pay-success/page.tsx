"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { savePayment } from "@/services/residentApi";

export default function PaySuccess() {
  const params = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const handleSavePayment = async () => {
      try {
        await savePayment({
          record_id: params.get("record_id") || "",
          payment_mode: "ONLINE",
          transaction_id: params.get("session_id") || "",
        });

        router.push("/dashboard");

      } catch (err) {
        console.error(err);
      }
    };

    handleSavePayment();
  }, [params, router]);

  return (
    <div className="p-8 text-center">
      Processing payment...
    </div>
  );
}