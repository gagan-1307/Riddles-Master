import React from 'react';
import UpgradeButton from '../../components/UpgradeButton';
import { detectCurrency, getPlanPrice, formatPrice, currencyMap } from '../../lib/currency';

interface PricingPageProps {
  request: Request;
  isLoggedIn: boolean;
  userEmail?: string;
}

export default async function PricingPage({ request, isLoggedIn, userEmail }: PricingPageProps) {
  // Call detectCurrency(request) server-side using the incoming Request object
  const currency = await detectCurrency(request);

  const oneMonthPrice = getPlanPrice('ONE_MONTH', currency);
  const threeMonthPrice = getPlanPrice('THREE_MONTH', currency);
  const sixMonthPrice = getPlanPrice('SIX_MONTH', currency);

  const savingThreeMonths = oneMonthPrice * 3 - threeMonthPrice;
  const savingSixMonths = oneMonthPrice * 6 - sixMonthPrice;

  const formattedSavingThree = formatPrice(savingThreeMonths, currency);
  const formattedSavingSix = formatPrice(savingSixMonths, currency);

  const plans = [
    {
      id: 'FREE',
      name: 'Free',
      price: formatPrice(0, currency),
      description: 'Perfect for casual practice and basic teasers.',
      features: [
        'Limited questions',
        'View problem statements',
        'Daily streak tracking',
        'Community tags access',
      ],
      cta: 'Current Plan',
      featured: false,
      href: '/signup',
      isFree: true,
    },
    {
      id: 'ONE_MONTH',
      name: '1 Month Premium',
      price: formatPrice(oneMonthPrice, currency),
      amount: oneMonthPrice,
      period: '/mo',
      description: 'The complete interview preparation toolkit.',
      features: [
        'Unlimited daily questions',
        'Full step-by-step solutions',
        'Access to all premium problems',
        'Company-wise filtered sets',
        'Priority support and updates',
      ],
      cta: 'Upgrade to Pro',
      featured: true,
      href: '/signup',
    },
    {
      id: 'THREE_MONTH',
      name: '3 Months Plan',
      price: formatPrice(threeMonthPrice, currency),
      amount: threeMonthPrice,
      description: `Save ${formattedSavingThree} vs monthly billing cycles.`,
      features: [
        'Everything in Premium',
        `Save ${formattedSavingThree} vs monthly billing`,
        'Best for intensive prep',
        'Full archive offline support',
      ],
      cta: 'Get 3 Months',
      featured: false,
      href: '/signup',
    },
    {
      id: 'SIX_MONTH',
      name: '6 Months Plan',
      price: formatPrice(sixMonthPrice, currency),
      amount: sixMonthPrice,
      description: `Save ${formattedSavingSix} vs monthly billing cycles.`,
      features: [
        'Everything in Premium',
        `Save ${formattedSavingSix} vs monthly billing`,
        'Best for comprehensive prep',
        'Ultimate long-term value',
      ],
      cta: 'Get 6 Months',
      featured: false,
      href: '/signup',
    },
  ];

  return (
    <section id="pricing" className="bg-[#faf9f5] py-20 sm:py-28 border-b border-[#e6dfd8]">
      <div className="mx-auto max-w-[1300px] px-6">
        <div className="mb-16 text-center">
          <h2 className="text-4xl sm:text-5xl font-normal font-serif tracking-tight text-[#141413] mb-4">
            Plans for every stage.
          </h2>
          <p className="mt-4 text-[16px] text-[#6c6a64] max-w-xl mx-auto leading-relaxed">
            Choose the plan that fits your interview preparation timeline. Unlock full step-by-step solutions, company tracks, and premium riddles.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4 items-stretch">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`relative flex flex-col justify-between rounded-xl border p-8 transition-all duration-300 ${
                plan.featured
                  ? 'border-[#efe9de] bg-[#181715] text-[#faf9f5] shadow-lg scale-[1.02] ring-1 ring-[#efe9de] hover:scale-[1.03]'
                  : 'border-[#e6dfd8] bg-[#faf9f5] text-[#141413] hover:shadow-md hover:border-[#e6dfd8]'
              }`}
            >
              {plan.featured && (
                <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#cc785c] text-white text-[10px] font-bold uppercase tracking-wider px-3.5 py-1 rounded-full shadow-sm">
                  Most Popular
                </span>
              )}

              <div>
                <div className="mb-6 pb-6 border-b border-[#e6dfd8]/15">
                  <h3 className={`text-xl font-bold font-serif ${plan.featured ? 'text-[#faf9f5]' : 'text-[#141413]'}`}>
                    {plan.name}
                  </h3>
                  <p className={`mt-2 text-xs leading-relaxed ${plan.featured ? 'text-[#faf9f5]/70' : 'text-[#6c6a64]'}`}>
                    {plan.description}
                  </p>
                  <div className="mt-6 flex items-baseline gap-1 relative">
                    <span className={`text-4xl font-normal font-serif tracking-tight ${plan.featured ? 'text-[#faf9f5]' : 'text-[#141413]'}`}>
                      {plan.price}
                    </span>
                    {plan.period && (
                      <span className={`text-sm ${plan.featured ? 'text-[#faf9f5]/70' : 'text-[#6c6a64]'}`}>
                        {plan.period}
                      </span>
                    )}
                    {currency !== 'INR' && !plan.isFree && (
                      <div className="group relative ml-2 cursor-help inline-flex items-center">
                        <span className={`text-[10px] rounded-full w-4 h-4 flex items-center justify-center font-serif border ${plan.featured ? 'border-[#faf9f5]/70 text-[#faf9f5]/70 hover:border-white text-white' : 'border-[#e6dfd8] text-[#6c6a64] hover:text-[#141413]'}`}>i</span>
                        <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 hidden group-hover:block bg-[#181715] text-[#faf9f5] border border-[#e6dfd8]/20 text-[11px] p-2.5 rounded shadow-md text-center font-sans z-50 normal-case font-normal leading-normal">
                          Converted price. You will be charged in {currency} via Razorpay
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <ul className="mb-8 space-y-4">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3 text-sm">
                      <svg
                        className={`h-5 w-5 shrink-0 ${plan.featured ? 'text-[#5db8a6]' : 'text-[#cc785c]'}`}
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="2.5"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                      </svg>
                      <span className={plan.featured ? 'text-[#faf9f5]/70' : 'text-[#6c6a64]'}>
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {plan.isFree ? (
                <a
                  href={plan.href}
                  className="block w-full py-3 text-center text-sm font-semibold rounded-md transition-all active:scale-[0.98] bg-transparent text-[#141413] border border-[#e6dfd8] hover:bg-[#efe9de] cursor-pointer"
                >
                  {plan.cta}
                </a>
              ) : (
                <UpgradeButton
                  plan={plan.id}
                  currency={currency}
                  amount={plan.amount!}
                  symbol={currencyMap[currency]?.symbol || '$'}
                  isLoggedIn={isLoggedIn}
                  userEmail={userEmail}
                  ctaText={plan.cta}
                  featured={plan.featured}
                />
              )}
            </div>
          ))}
        </div>

        <p className="mt-8 text-center text-xs text-[#6c6a64] font-mono">
          Prices shown in {currency}.
        </p>

        <p className="mt-2 text-center text-xs text-[#6c6a64] font-mono">
          All plans include daily streak tracking. Single-user license.
        </p>
      </div>
    </section>
  );
}
