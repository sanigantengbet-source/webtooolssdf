import React from 'react';

export function Hero() {
  return (
    <section className="pt-8 pb-6 border-b border-[#eaeaea] dark:border-[#27272a] mb-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-[#171717] dark:text-[#ededed]">
          Tool Collection
        </h1>
        <p className="mt-1.5 text-sm sm:text-base text-[#666666] dark:text-[#a1a1a1] max-w-2xl leading-relaxed">
          A curated collection of tools, websites and projects.
        </p>
      </div>
    </section>
  );
}
