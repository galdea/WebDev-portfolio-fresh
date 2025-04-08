import { Gallery } from '@/components/Gallery/Gallery';
import Navbar from '@/components/Navbar';

export default function GalleryPage() {
  return (
    <div className="min-h-screen bg-background dark:from-bg-dark dark:to-dark">
      <Navbar />
      <main className="pt-24">
        <Gallery />
      </main>
    </div>
  );
}
