import { AnimatePresence, motion } from 'framer-motion';
import React from 'react';
import { useTranslation } from 'react-i18next';

const LanguageToggle = () => {
  const { i18n } = useTranslation();
  const currentLanguage = i18n.language;

  const languages = [
    { code: 'en', label: '🇬🇧' },
    { code: 'es', label: '🇪🇸' },
  ];

  return (
    <div className="ml-auto">
      {/* <div className="flex items-center space-x-2">
        {languages.map((lang) => (
          <button
            key={lang.code}
            onClick={() => i18n.changeLanguage(lang.code)}
            className="relative group"
          >
            <div className="p-2 rounded-lg transition-all duration-300 hover:bg-white/10 relative">
              <span className="text-2xl">{lang.label}</span>
              {currentLanguage === lang.code && (
                <motion.div
                  layoutId="activeLanguage"
                  className="absolute inset-0 border-2 border-secondary rounded-lg"
                  initial={false}
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}
            </div>
          </button>
        ))}
      </div> */}
    </div>
  );
};

export default LanguageToggle;
