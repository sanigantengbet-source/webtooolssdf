import { NextResponse } from 'next/server';
import { scrapeSpotify, validateSpotifyUrl } from '@/src/lib/spotifyScraper';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { url } = body;

    if (!url || typeof url !== 'string') {
      return NextResponse.json(
        { error: 'Valid Spotify URL is required.' },
        { status: 400 }
      );
    }

    const validation = validateSpotifyUrl(url);
    if (!validation.isValid && validation.error && !url.includes('spotify.link')) {
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      );
    }

    const result = await scrapeSpotify(url);
    return NextResponse.json({ success: true, data: result });
  } catch (error: any) {
    console.error('Spotify scraping error:', error);
    return NextResponse.json(
      { error: error.message || 'An error occurred while fetching Spotify track data.' },
      { status: 500 }
    );
  }
}
