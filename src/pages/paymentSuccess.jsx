// pages/payment-success.jsx
import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

export default function PaymentSuccess() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const ref = params.get("reference");

    if (!ref) return;

    fetch(`${BACKEND_URL}/api/payments/verify?reference=${ref}`)
      .then(res => res.json())
      .then(() => navigate("/dashboard/beta"));
  }, []);

  return <p>Verifying payment...</p>;
}
