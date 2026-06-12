import React from 'react';
import { formatPrice } from '../../lib/currency';

interface SubscriptionPageProps {
  subscription: {
    plan: string;
    startDate: Date;
    endDate: Date;
    currency: string;
    amountPaid: number;
    status: string;
  } | null;
}

export default function SubscriptionPage({ subscription }: SubscriptionPageProps) {
  if (!subscription) {
    return (
      <div className="p-8 text-center bg-[#faf9f5] border border-[#e6dfd8] rounded-lg max-w-md mx-auto my-12">
        <h2 className="text-xl font-bold mb-2 font-serif text-[#141413]">No Active Subscription</h2>
        <p className="text-sm text-[#6c6a64] mb-6">You are currently on the Free plan.</p>
        <a
          href="/pricing"
          className="inline-flex h-10 items-center justify-center rounded-md bg-[#cc785c] px-6 text-sm font-semibold text-white transition-all hover:bg-[#a9583e] active:scale-[0.98]"
        >
          Upgrade to Pro
        </a>
      </div>
    );
  }

  const formattedAmount = formatPrice(subscription.amountPaid, subscription.currency);

  return (
    <div className="p-8 bg-[#faf9f5] border border-[#e6dfd8] rounded-lg max-w-md mx-auto my-12 shadow-sm">
      <h2 className="text-2xl font-bold font-serif mb-6 text-[#141413]">Your Subscription</h2>
      <div className="space-y-6">
        <div className="p-4 bg-emerald-50/50 border border-emerald-200 rounded-md">
          <h3 className="font-bold text-emerald-800 text-base capitalize">
            {subscription.plan.replace('_', ' ').toLowerCase()} Plan
          </h3>
          <p className="text-[11px] text-emerald-600 uppercase font-bold tracking-wider mt-1">
            Status: {subscription.status}
          </p>
        </div>
        <div className="text-sm text-[#3d3d3a] space-y-3 border-t border-[#e6dfd8] pt-4">
          <p className="font-medium">
            You paid {formattedAmount} ({subscription.currency})
          </p>
          <p className="text-xs text-[#6c6a64]">
            Start Date: {new Date(subscription.startDate).toLocaleDateString(undefined, { dateStyle: 'medium' })}
          </p>
          <p className="text-xs text-[#6c6a64]">
            Renewal Date: {new Date(subscription.endDate).toLocaleDateString(undefined, { dateStyle: 'medium' })}
          </p>
        </div>
      </div>
    </div>
  );
}
