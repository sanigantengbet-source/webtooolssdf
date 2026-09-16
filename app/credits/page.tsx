import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { ArrowLeft } from 'lucide-react';
import { Navbar } from '@/components/public/navbar';
import { Footer } from '@/components/public/footer';

export const metadata: Metadata = {
  title: 'Team Credits - SANN404 FORUM GROUP | Tool Collection',
  description:
    'Thank you to all the admins, developers, and contributors of SANN404 FORUM GROUP who have been part of the development and management of the projects featured in this collection.',
  openGraph: {
    title: 'Team Credits - SANN404 FORUM GROUP',
    description:
      'Acknowledgment and appreciation for everyone behind SANN404 FORUM GROUP.',
    type: 'website',
  },
};

export default function CreditsPage() {
  return (
    <div id="credits-page" className="min-h-screen flex flex-col bg-white dark:bg-black text-[#171717] dark:text-[#ededed]">
      <Navbar />

      <main className="flex-1 max-w-3xl w-full mx-auto px-4 sm:px-6 py-10 sm:py-16">
        {/* Back Link */}
        <Link
          href="/"
          id="credits-back-link"
          className="inline-flex items-center gap-2 text-xs font-medium text-[#666666] dark:text-[#a1a1a1] hover:text-[#171717] dark:hover:text-[#ededed] mb-10 transition-colors group"
        >
          <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-1" />
          <span>Back to Tools Collection</span>
        </Link>

        {/* Header Title */}
        <div className="space-y-6">
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-[#171717] dark:text-white leading-tight sm:leading-snug">
            Thanks to Everyone Behind SANN404 FORUM GROUP
          </h1>

          <div className="space-y-5 text-base sm:text-lg leading-relaxed text-[#444444] dark:text-[#a1a1a1]">
            <p>
              Thank you to all the admins, developers, and contributors of{' '}
              <span className="font-semibold text-[#171717] dark:text-white">
                SANN404 FORUM GROUP
              </span>{' '}
              who have been part of the development and management of the various
              projects featured in this collection.
            </p>

            <p>
              Every website, tool, and project comes with its own process, ideas,
              time, and contributions from the people behind it. From developing
              features, fixing bugs, maintenance, testing, and design to the many
              small efforts that may not always be visible to users.
            </p>

            <p>
              This collection is not only about completed projects, but also about
              the teamwork and contributions of everyone who continues to help{' '}
              <span className="font-semibold text-[#171717] dark:text-white">
                SANN404 FORUM GROUP
              </span>{' '}
              grow. Every contribution matters and becomes a meaningful part of our
              journey together.
            </p>

            <p className="font-medium text-[#171717] dark:text-white pt-2">
              Thank you to everyone who has contributed, helped, and continued to
              support SANN404 FORUM GROUP.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
