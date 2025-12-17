import React from 'react';

interface ConcurrencyBannerProps {
  message?: string;
  subMessage?: string;
}

export default function ConcurrencyBanner({ message, subMessage }: ConcurrencyBannerProps) {
  if (!message) return null;

  return (
    <div className="w-full bg-white/10 border-b border-white/10 py-4 text-center mb-8 backdrop-blur-sm">
      <h3 className="m-0 font-semibold text-xl tracking-wide text-white/90">{message}</h3>
      {subMessage && <small className="block mt-2 opacity-70 text-sm font-light">{subMessage}</small>}
    </div>
  );
}
