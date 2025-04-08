import About from '@/components/About';
import Contact from '@/components/Contact';
import Galleries from '@/components/Galleries';
import Hero from '@/components/Hero';
import Navbar from '@/components/Navbar';
import Projects from '@/components/Projects';
import Skills from '@/components/Skills';

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <About />
      <Skills />
      <Projects />
      <Galleries />
      <Contact />
    </main>
  );
}
