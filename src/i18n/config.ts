import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';

export const resources = {
  en: {
    translation: {
      nav: {
        home: 'Home',
        about: 'About',
        skills: 'Skills',
        projects: 'Projects',
        gallery: 'Gallery',
        contact: 'Contact',
      },
      hero: {
        title: 'Crafting Digital',
        titleHighlight: 'Experiences',
        viewWork: 'Skills',
        getInTouch: 'Get in Touch',
      },
    },
  },
  // es: {
  //   translation: {
  //     nav: {
  //       home: 'Inicio',
  //       about: 'Sobre Mí',
  //       skills: 'Habilidades',
  //       projects: 'Proyectos',
  //       gallery: 'Galería',
  //       contact: 'Contacto',
  //     },
  //     hero: {
  //       title: 'Creando Experiencias',
  //       titleHighlight: 'Digitales',
  //       viewWork: 'Ver Proyectos',
  //       getInTouch: 'Contactar',
  //     },
  //   },
  // },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
  });

export default i18n;
