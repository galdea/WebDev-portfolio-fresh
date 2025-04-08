import { Carpentry } from '@/components/Carpentry/Carpentry';
import Navbar from '@/components/Navbar';

export default function CarpentryPage() {
  return (
    <div className="min-h-screen bg-background dark:from-bg-dark dark:to-dark">
      <Navbar />
      <main className="pt-24">
        <Carpentry />
      </main>
    </div>
  );
}
