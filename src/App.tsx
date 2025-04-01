import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import About from './components/About';
import Carpentry from './components/Carpentry';
import Contact from './components/Contact';
import Galleries from './components/Galleries';
import { Gallery } from './components/Gallery';
import GenerativeAI from './components/GenerativeAI';
import Hero from './components/Hero';
import Navbar from './components/Navbar';
import Projects from './components/Projects';
import Skills from './components/Skills';
import { ThemeProvider } from './contexts/ThemeContext';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <div className="relative">
          <Navbar />
          <Routes>
            <Route
              path="/"
              element={
                <>
                  <Hero />
                  <About />
                  <Skills />
                  <Projects />
                  <Galleries />
                  <Contact />
                </>
              }
            />
            <Route path="/generativeAI" element={<GenerativeAI />} />

            <Route path="/gallery" element={<Gallery />} />
            <Route path="/carpentry" element={<Carpentry />} />
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
