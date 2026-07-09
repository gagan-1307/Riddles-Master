import React, { useState } from 'react';
import { toast } from 'sonner';

interface UpgradeButtonProps {
  plan: string;
  currency: string;
  amount: number;
  symbol: string;
  isLoggedIn: boolean;
  userEmail?: string;
  ctaText: string;
  featured: boolean;
}

const planNameMap: Record<string, string> = {
  ONE_MONTH: '1 Month Premium',
  THREE_MONTH: '3 Months Plan',
  SIX_MONTH: '6 Months Plan',
};

function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if ((window as any).Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export default function UpgradeButton({
  plan,
  currency,
  amount,
  symbol,
  isLoggedIn,
  userEmail,
  ctaText,
  featured,
}: UpgradeButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleUpgrade = async () => {
    if (!isLoggedIn) {
      window.location.href = '/login';
      return;
    }

    try {
      setIsLoading(true);

      const isLoaded = await loadRazorpayScript();
      if (!isLoaded) {
        toast.error('Failed to load payment gateway. Please try again.');
        return;
      }

      const res = await fetch('/api/payment/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ plan, currency }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to initialize payment.');
      }

      const data = await res.json();

      const options = {
        key: data.keyId,
        amount: amount,
        currency: currency,
        name: 'RiddlesMaster',
        description: planNameMap[plan] || plan,
        order_id: data.orderId,
        prefill: {
          email: userEmail || '',
        },
        theme: {
          color: '#2E75B6',
        },
        handler: async function (response: any) {
          try {
            const verifyRes = await fetch('/api/payment/verify', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                plan,
                currency,
                amountPaid: amount,
              }),
            });

            if (!verifyRes.ok) {
              const errorData = await verifyRes.json().catch(() => ({}));
              throw new Error(errorData.error || 'Verification failed.');
            }

            toast.success('Payment verified successfully!');
            window.location.href = '/pricing/success';
          } catch (err: any) {
            console.error(err);
            toast.error(err.message || 'Payment verification failed. Please contact support.');
          }
        },
        'handler.payment.failed': function (response: any) {
          toast.error('Payment failed. Please try again.');
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.on('payment.failed', function (response: any) {
        toast.error('Payment failed. Please try again.');
      });
      rzp.open();
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleUpgrade}
      disabled={isLoading}
      className={`block w-full py-3 text-center text-sm font-semibold rounded-lg transition-all duration-300 active:scale-[0.98] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
        featured
          ? 'bg-[#cc785c] text-white hover:bg-[#a9583e] hover:shadow-sm'
          : 'bg-[#181715] text-[#faf9f5] hover:bg-[#252320] hover:shadow-sm'
      }`}
    >
      {isLoading ? 'Processing...' : ctaText}
    </button>
  );
}
