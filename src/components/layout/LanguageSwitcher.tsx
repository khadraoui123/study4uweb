import React from 'react';
import { useTranslation } from 'react-i18next';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Languages } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();

  const languages = [
    { code: 'en', label: 'English', flag: '🇺🇸' },
    { code: 'fr', label: 'Français', flag: '🇫🇷' },
    { code: 'ar', label: 'العربية', flag: '🇸🇦' }
  ];

  const currentLanguage = languages.find(l => l.code === i18n.language) || languages[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm" 
          className="gap-3 px-4 h-11 rounded-xl bg-muted/20 border border-border/50 hover:bg-muted/30 hover:border-primary/30 transition-all group"
        >
          <Languages size={18} className="text-primary group-hover:rotate-12 transition-transform" />
          <span className="text-[10px] font-black uppercase tracking-widest hidden sm:inline-block">
            {currentLanguage.label}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className="w-48 bg-[#020205]/90 backdrop-blur-2xl border-border/50 p-2 rounded-2xl shadow-2xl animate-in fade-in zoom-in duration-200"
      >
        <AnimatePresence>
          {languages.map((lang) => (
            <DropdownMenuItem 
              key={lang.code}
              onClick={() => i18n.changeLanguage(lang.code)}
              className={`
                flex items-center justify-between px-4 py-3 rounded-xl cursor-pointer transition-all mb-1 last:mb-0
                ${i18n.language === lang.code ? 'bg-primary/20 text-primary' : 'hover:bg-white/5 text-muted-foreground hover:text-foreground'}
              `}
            >
              <div className="flex items-center gap-3">
                <span className="text-lg">{lang.flag}</span>
                <span className="text-[11px] font-black uppercase tracking-widest">{lang.label}</span>
              </div>
              {i18n.language === lang.code && (
                <motion.div 
                  layoutId="active-lang"
                  className="w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_8px_var(--primary)]" 
                />
              )}
            </DropdownMenuItem>
          ))}
        </AnimatePresence>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
