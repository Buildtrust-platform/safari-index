import { Metadata } from 'next';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { ImageBand, ecosystemImages } from '../components/visual';
import SavedSafarisContent from './SavedSafarisContent';

export const metadata: Metadata = {
  title: 'Saved Safaris | Vurara Safaris',
  description: 'View and manage your saved safari trips and itineraries. Pick up where you left off in planning your African adventure.',
  robots: 'noindex', // Personal page, no need to index
};

export default function SavedSafarisPage() {
  return (
    <main id="main-content" className="min-h-screen bg-stone-50">
      <Navbar variant="transparent" />

      <ImageBand
        image={ecosystemImages[0]}
        height="explore"
        overlay="strong"
        priority
      >
        <div className="max-w-3xl">
          <p className="text-amber-400 text-sm font-medium mb-2 tracking-wide uppercase">
            Your Collection
          </p>
          <h1 className="font-editorial text-3xl md:text-4xl text-white mb-4">
            Saved Safaris
          </h1>
          <p className="text-lg text-white/80 leading-relaxed">
            Review the trips and itineraries you've saved for later. When you're ready, we'll help you turn them into reality.
          </p>
        </div>
      </ImageBand>

      <SavedSafarisContent />

      <Footer variant="operator" />
    </main>
  );
}
