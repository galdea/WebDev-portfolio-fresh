'use client';

import emailjs from 'emailjs-com';
import { motion } from 'framer-motion';
import { CheckCircle, Loader2, Send } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { TypeAnimation } from 'react-type-animation';

export default function Contact() {
  const SERVICE_ID = 'service_f2eyn5j';
  const TEMPLATE_ID = 'template_1q9xdwo';
  const USER_ID = '3YLlUQa6Bs9ksulX7';

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formStatus, setFormStatus] = useState<
    'idle' | 'submitting' | 'success' | 'error'
  >('idle');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const formRef = useRef<HTMLFormElement>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormStatus('submitting');

    try {
      await emailjs.sendForm(
        SERVICE_ID,
        TEMPLATE_ID,
        formRef.current as HTMLFormElement,
        USER_ID,
      );
      setFormStatus('success');
      setFormData({ name: '', email: '', message: '' });
      setTimeout(() => setFormStatus('idle'), 5000);
    } catch (error) {
      console.error('Error submitting form:', error);
      setFormStatus('error');
      setTimeout(() => setFormStatus('idle'), 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // Detect if the user is on an iOS device
    const userAgent = window.navigator.userAgent;
    setIsIOS(/iPad|iPhone|iPod/.test(userAgent) && !(window as any).MSStream);
  }, []);

  useEffect(() => {
    // Move the DOM event listener to useEffect for proper Next.js client-side execution
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash === '#contact') {
        setTimeout(() => {
          const target = document.querySelector(hash);
          if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
          }
        }, 500); // Delay ensures smooth scrolling after page load
      }
    };

    // Check hash on initial load
    handleHashChange();

    // No need for DOMContentLoaded in Next.js components
    window.addEventListener('hashchange', handleHashChange);

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  return (
    <section
      id="contact"
      className="min-h-screen flex items-center relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-black/30 z-0"></div>

      {/* Video Background */}
      <div className="absolute inset-0 z-0">
        <motion.video
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.15 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          autoPlay
          muted
          loop
          className="object-cover w-full h-full"
        >
          <source
            src={isIOS ? '/images/About.mp4' : '/images/About.webm'}
            type={isIOS ? 'video/mp4' : 'video/webm'}
          />
        </motion.video>
      </div>

      <div className="container mx-auto px-4 z-10 pt-8 sm:pt-0">
        <div className="flex flex-col lg:flex-row items-center justify-center">
          {/* Video display */}
          <div className="w-full lg:w-3/5 flex justify-center items-center">
            <div className="w-full max-w-full lg:max-w-none px-4 lg:px-8">
              <div className="relative">
                {/* Video for large screens */}
                <motion.video
                  initial={{ opacity: 0.8 }}
                  animate={{ opacity: 0.8 }}
                  className="hidden lg:block rounded-lg shadow-lg w-full h-auto"
                  autoPlay
                  muted
                >
                  <source
                    src={isIOS ? '/images/meeting.mp4' : '/images/meeting.webm'}
                    type={isIOS ? 'video/mp4' : 'video/webm'}
                  />
                </motion.video>

                {/* Video for small screens */}
                <motion.video
                  className="block lg:hidden rounded-lg shadow-lg w-full pt-6 h-auto"
                  autoPlay
                  loop
                  muted
                  playsInline
                >
                  <source
                    src={isIOS ? '/images/finale.mp4' : '/images/finale.webm'}
                    type={isIOS ? 'video/mp4' : 'video/webm'}
                  />
                </motion.video>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="min-h-screen bg-theme-dark-blue relative overflow-hidden">
            <div className="relative z-10 container mx-auto px-4 py-16 min-h-screen flex items-center">
              <div className="w-full max-w-4xl mx-auto">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                  className="bg-cyber-pattern backdrop-blur-lg rounded-xl p-8 shadow-2xl border border-theme-teal/20"
                >
                  <div className="mb-8 text-[#64ffda]">
                    <TypeAnimation
                      sequence={[
                        "Let's Get In Touch",
                        6000,
                        'Ready to Build Something?',
                        6000,
                      ]}
                      wrapper="h2"
                      speed={50}
                      repeat={Infinity}
                      className="text-4xl md:text-5xl font-bold mb-4"
                    />
                  </div>
                  <p className="text-theme-gray text-lg mb-8">
                    Transform your digital vision into reality. Let's create
                    something extraordinary together.
                  </p>

                  {formStatus === 'success' ? (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-theme-teal/20 border border-theme-teal rounded-lg p-6 text-center"
                    >
                      <CheckCircle className="w-16 h-16 text-theme-teal mx-auto mb-4" />
                      <h3 className="text-2xl font-bold text-theme-light-blue mb-2">
                        Message Sent!
                      </h3>
                      <p className="text-theme-gray">
                        Thank you for reaching out. I'll get back to you soon.
                      </p>
                    </motion.div>
                  ) : (
                    <form
                      ref={formRef}
                      onSubmit={handleSubmit}
                      name="contact"
                      className="space-y-6"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <motion.div
                          whileHover={{ scale: 1.02 }}
                          className="space-y-2"
                        >
                          <label
                            htmlFor="name"
                            className="block text-[#64ffda]"
                          >
                            Name
                          </label>
                          <input
                            type="text"
                            id="name"
                            name="name"
                            required
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full bg-theme-navy/50 border border-theme-teal/30 rounded-lg px-4 py-3 text-theme-light-blue placeholder-theme-gray/50 focus:outline-none focus:border-theme-teal text-[#0a1d3a] transition-colors"
                            placeholder="John Doe"
                          />
                        </motion.div>

                        <motion.div
                          whileHover={{ scale: 1.02 }}
                          className="space-y-2"
                        >
                          <label
                            htmlFor="email"
                            className="block text-[#64ffda]"
                          >
                            Email
                          </label>
                          <input
                            type="email"
                            id="email"
                            name="email"
                            required
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full bg-theme-navy/50 border border-theme-teal/30 rounded-lg px-4 py-3 text-theme-light-blue placeholder-theme-gray/50 focus:outline-none text-[#0a1d3a] focus:border-theme-teal transition-colors"
                            placeholder="john@example.com"
                          />
                        </motion.div>
                      </div>

                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        className="space-y-2"
                      >
                        <label
                          htmlFor="message"
                          className="block text-[#64ffda]"
                        >
                          Message
                        </label>
                        <textarea
                          id="message"
                          name="message"
                          required
                          value={formData.message}
                          onChange={handleChange}
                          rows={4}
                          className="w-full bg-theme-navy/50 border border-theme-teal/30 rounded-lg px-4 py-3 text-theme-light-blue placeholder-theme-gray/50 text-[#0a1d3a] focus:outline-none focus:border-theme-teal transition-colors"
                          placeholder="Tell me about your project..."
                        />
                      </motion.div>

                      <div className="flex justify-end">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          type="submit"
                          disabled={isSubmitting}
                          className="bg-theme-teal text-theme-navy px-8 py-3 rounded-lg font-semibold flex items-center space-x-2 hover:bg-theme-teal/90 transition-colors disabled:opacity-70"
                        >
                          {isSubmitting ? (
                            <>
                              <Loader2 className="w-5 h-5 animate-spin text-theme-navy" />
                              <span>Sending...</span>
                            </>
                          ) : formStatus === 'error' ? (
                            <>
                              <span>Try Again</span>
                            </>
                          ) : (
                            <>
                              <Send className="w-5 h-5 text-theme-navy" />
                              <span>Send Message</span>
                            </>
                          )}
                        </motion.button>
                      </div>

                      {formStatus === 'error' && (
                        <div className="mt-4 bg-red-500/20 border border-red-500 text-red-100 p-3 rounded-lg text-sm">
                          There was an error sending your message. Please try
                          again.
                        </div>
                      )}
                    </form>
                  )}
                </motion.div>
              </div>
            </div>
          </div>
        </div>
        <footer className="text-center pb-6 text-gray-600 text-m">
          This website was developed by{' '}
          <a
            href="https://gabrielaldea.netlify.app/"
            className="text-[#4f7375] hover:text-[#64ffda]"
            target="_blank"
            rel="noopener noreferrer"
          >
            Gabriel Aldea
          </a>
          , combining state-of-the-art{' '}
          <a
            href="https://runwayml.com/"
            className="text-[#4f7375] hover:text-[#64ffda]"
            target="_blank"
            rel="noopener noreferrer"
          >
            generative AI
          </a>
          , his aesthetic sensibility and distinctive coding expertise.
        </footer>
      </div>
    </section>
  );
}
