import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../store';
import { ArrowRight, CheckCircle, BarChart3, BookOpen } from 'lucide-react';

const steps = [
  {
    title: "Your Academic Hub",
    description: "A centralized visual breakdown of your entire course scheduling and room assignments.",
    icon: <BookOpen size={48} color="#4ADE80" />,
    color: "#4ADE80"
  },
  {
    title: "Accountability Tracker",
    description: "Monitor your presence with a dynamic 75% attendance threshold ring and real-time alerts.",
    icon: <CheckCircle size={48} color="#2DD4BF" />,
    color: "#2DD4BF"
  },
  {
    title: "Insightful Growth",
    description: "Visualize your academic performance through animated grade distribution charts and CGPA trends.",
    icon: <BarChart3 size={48} color="#FBBF24" />,
    color: "#FBBF24"
  }
];

export const Onboarding: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const completeOnboarding = useStore(state => state.completeOnboarding);

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      completeOnboarding();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white p-6">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: -20 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 } as any}
          className="w-full max-w-md"
        >
          <fluent-card>
            <div className="flex flex-col items-center text-center gap-6">
              <motion.div
                initial={{ rotate: -10 }}
                animate={{ rotate: 0 }}
                className="p-4 rounded-3xl bg-white shadow-sm mb-4"
                style={{ border: `2px solid ${steps[currentStep].color}33` }}
              >
                {steps[currentStep].icon}
              </motion.div>

              <div className="gap-2 flex flex-col">
                <h1 className="text-3xl font-extrabold" style={{ color: '#1E293B' }}>
                  {steps[currentStep].title}
                </h1>
                <p className="text-lg" style={{ color: '#64748B', lineHeight: '1.6' }}>
                  {steps[currentStep].description}
                </p>
              </div>

              <div className="flex gap-2 mb-4">
                {steps.map((_, i) => (
                  <div
                    key={i}
                    className="h-2 rounded-full"
                    style={{ 
                      width: i === currentStep ? '2rem' : '0.5rem',
                      backgroundColor: i === currentStep ? steps[currentStep].color : '#e2e8f0',
                      transition: 'all 0.3s ease'
                    }}
                  />
                ))}
              </div>

              <fluent-button
                appearance="accent"
                onClick={nextStep}
                className="w-full"
                style={{ '--accent-fill-rest': steps[currentStep].color } as any}
              >
                {currentStep === steps.length - 1 ? "Get Started" : "Continue"}
                <ArrowRight slot="end" size={20} />
              </fluent-button>
            </div>
          </fluent-card>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
