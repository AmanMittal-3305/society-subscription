"use client";

import { useParams } from "next/navigation";
import { useState } from "react";
import axios from "axios";

export default function PayNowPage() {
  const params = useParams();
  const recordId = params.record_id;

  const [message, setMessage] = useState("");

  const handlePayment = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/resident/create-checkout-session`,
        { record_id: recordId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      window.location.href = response.data.url;

    } catch (err: any) {
      console.error(err);
      setMessage("Payment failed");
    }
  };

  return (
    <div className="p-8 max-w-md mx-auto bg-white rounded-2xl shadow mt-10">
      <h1 className="text-xl font-bold mb-4">Pay Subscription</h1>

      <p className="mb-4 text-sm text-gray-500">
        Record ID: {recordId}
      </p>

      <button
        onClick={handlePayment}
        className="w-full bg-black text-white py-2 rounded-lg"
      >
        Confirm Payment
      </button>

      {message && (
        <p className="mt-4 text-center">{message}</p>
      )}
    </div>
  );
}