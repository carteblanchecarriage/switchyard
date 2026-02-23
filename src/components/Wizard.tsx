import React, { useState } from 'react';
import './Wizard.css';
import { KeyboardProduct } from '../types/keyboard';

interface WizardProps {
  products: KeyboardProduct[];
  onFilterChange: (filtered: KeyboardProduct[]) => void;
}

interface WizardState {
  useCase: string | null;
  workspace: string | null;
  size: string | null;
  hotswap: string | null;
  budget: string | null;
}

const steps = [
  {
    id: 'useCase',
    question: 'What will you use this for?',
    subtitle: 'This helps us find the right features',
    options: [
      { id: 'gaming', label: 'Gaming', desc: 'Fast response, RGB, macro keys' },
      { id: 'work', label: 'Work', desc: 'Comfortable, ergonomic, quiet' },
      { id: 'creative', label: 'Creative', desc: 'Media controls, macros, precision' },
      { id: 'general', label: 'General', desc: 'All-around performer' },
    ]
  },
  {
    id: 'workspace',
    question: 'Your workspace?',
    subtitle: 'Some keyboards are louder than others',
    options: [
      { id: 'shared', label: 'Shared Space', desc: 'Need something quieter' },
      { id: 'private', label: 'Private Office', desc: 'No noise concerns' },
      { id: 'home', label: 'Home Setup', desc: 'Whatever sounds good' },
    ]
  },
  {
    id: 'size',
    question: 'Preferred size?',
    subtitle: 'Full-size to compact',
    options: [
      { id: 'fullsize', label: 'Full Size', desc: 'With numpad (100%)' },
      { id: 'tkl', label: 'TKL', desc: 'No numpad (80%)' },
      { id: 'compact', label: 'Compact', desc: 'Small and portable (60-65%)' },
    ]
  },
  {
    id: 'hotswap',
    question: 'Customize later?',
    subtitle: 'Hot-swap vs soldered switches',
    options: [
      { id: 'hotswap', label: 'Hot-swap Only', desc: 'Easy switch changes' },
      { id: 'soldered', label: 'Soldered is OK', desc: 'Often cheaper, permanent' },
      { id: 'any', label: 'Any', desc: 'Show both options' },
    ]
  },
  {
    id: 'budget',
    question: 'What is your budget?',
    subtitle: 'We will find the best value',
    options: [
      { id: 'budget', label: 'Under $100', desc: 'Entry level' },
      { id: 'mid', label: '$100-200', desc: 'Mid-range quality' },
      { id: 'premium', label: '$200+', desc: 'Premium builds' },
    ]
  },
];

export default function Wizard({ products, onFilterChange }: WizardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [selections, setSelections] = useState<WizardState>({
    useCase: null,
    workspace: null,
    size: null,
    hotswap: null,
    budget: null,
  });

  const calculateMatches = (): number => {
    let filtered = [...products];
    
    if (selections.useCase) {
      // Filter based on use case keywords in name/description
      const keywords: Record<string, string[]> = {
        gaming: ['gaming', 'rgb', 'macro', 'fast'],
        work: ['ergonomic', 'quiet', 'office', 'professional'],
        creative: ['media', 'macro', 'programmable'],
        general: [],
      };
      const words = keywords[selections.useCase] || [];
      if (words.length > 0) {
        filtered = filtered.filter(p => 
          words.some(w => 
            p.name?.toLowerCase().includes(w) || 
            p.description?.toLowerCase().includes(w)
          )
        );
      }
    }

    if (selections.workspace === 'shared') {
      // Prefer quieter keyboards
      filtered = filtered.filter(p => 
        !p.name?.toLowerCase().includes('clicky') &&
        !p.name?.toLowerCase().includes('blue')
      );
    }

    if (selections.size) {
      const sizeKeywords: Record<string, string[]> = {
        fullsize: ['full', '100%', 'numpad'],
        tkl: ['tkl', 'tenkeyless', '80%'],
        compact: ['60%', '65%', 'compact', 'mini'],
      };
      const keywords = sizeKeywords[selections.size] || [];
      filtered = filtered.filter(p => 
        keywords.some(k => p.name?.toLowerCase().includes(k))
      );
    }

    if (selections.hotswap && selections.hotswap !== 'any') {
      const hasHotswap = selections.hotswap === 'hotswap';
      filtered = filtered.filter(p => {
        const productHasHotswap = /hotswap|hot-swap|swappable/i.test(p.name || '');
        return hasHotswap ? productHasHotswap : !productHasHotswap;
      });
    }

    if (selections.budget) {
      const priceRanges: Record<string, [number, number]> = {
        budget: [0, 100],
        mid: [100, 200],
        premium: [200, 10000],
      };
      const [min, max] = priceRanges[selections.budget] || [0, 10000];
      filtered = filtered.filter(p => {
        const price = parseFloat(p.price?.replace(/[^0-9.]/g, '') || '0');
        return price >= min && price <= max;
      });
    }

    return filtered.length;
  };

  const matches = calculateMatches();

  const handleSelect = (optionId: string) => {
    const stepId = steps[currentStep].id as keyof WizardState;
    setSelections(prev => ({ ...prev, [stepId]: optionId }));
    
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      // Apply final filter
      setIsOpen(false);
      applyFilters();
    }
  };

  const applyFilters = () => {
    let filtered = [...products];
    
    // Apply all active filters
    if (selections.useCase) {
      // Implementation same as calculateMatches
      const keywords: Record<string, string[]> = {
        gaming: ['gaming', 'rgb', 'macro', 'fast'],
        work: ['ergonomic', 'quiet', 'office', 'professional'],
        creative: ['media', 'macro', 'programmable'],
        general: [],
      };
      const words = keywords[selections.useCase] || [];
      if (words.length > 0) {
        filtered = filtered.filter(p => 
          words.some(w => 
            p.name?.toLowerCase().includes(w) || 
            p.description?.toLowerCase().includes(w)
          )
        );
      }
    }

    if (selections.workspace === 'shared') {
      filtered = filtered.filter(p => 
        !p.name?.toLowerCase().includes('clicky') &&
        !p.name?.toLowerCase().includes('blue')
      );
    }

    if (selections.size) {
      const sizeKeywords: Record<string, string[]> = {
        fullsize: ['full', '100%', 'numpad'],
        tkl: ['tkl', 'tenkeyless', '80%'],
        compact: ['60%', '65%', 'compact', 'mini'],
      };
      const keywords = sizeKeywords[selections.size] || [];
      filtered = filtered.filter(p => 
        keywords.some(k => p.name?.toLowerCase().includes(k))
      );
    }

    if (selections.hotswap && selections.hotswap !== 'any') {
      const hasHotswap = selections.hotswap === 'hotswap';
      filtered = filtered.filter(p => {
        const productHasHotswap = /hotswap|hot-swap|swappable/i.test(p.name || '');
        return hasHotswap ? productHasHotswap : !productHasHotswap;
      });
    }

    if (selections.budget) {
      const priceRanges: Record<string, [number, number]> = {
        budget: [0, 100],
        mid: [100, 200],
        premium: [200, 10000],
      };
      const [min, max] = priceRanges[selections.budget] || [0, 10000];
      filtered = filtered.filter(p => {
        const price = parseFloat(p.price?.replace(/[^0-9.]/g, '') || '0');
        return price >= min && price <= max;
      });
    }

    onFilterChange(filtered);
  };

  const resetWizard = () => {
    setSelections({
      useCase: null,
      workspace: null,
      size: null,
      hotswap: null,
      budget: null,
    });
    setCurrentStep(0);
    onFilterChange(products);
  };

  const currentStepData = steps[currentStep];
  const hasSelections = Object.values(selections).some(s => s !== null);

  return (
    <>
      {/* Floating Action Button */}
      <button 
        className="wizard-fab"
        onClick={() => setIsOpen(true)}
        aria-label="Open keyboard finder"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="2" y="4" width="20" height="16" rx="2" />
          <path d="M6 8h.01M10 8h.01M14 8h.01M18 8h.01M8 12h.01M12 12h.01M16 12h.01M6 16h12" />
        </svg>
        {hasSelections && (
          <span className="match-count">{matches}</span>
        )}
      </button>

      {/* Wizard Panel */}
      {isOpen && (
        <div className="wizard-overlay" onClick={() => setIsOpen(false)}>
          <div className="wizard-panel" onClick={(e) => e.stopPropagation()}>
            {/* Header */}
            <div className="wizard-header">
              <span className="step-indicator">
                Step {currentStep + 1} of {steps.length}
              </span>
              {hasSelections && (
                <button className="reset-btn" onClick={resetWizard}>
                  Reset
                </button>
              )}
              <button className="close-btn" onClick={() => setIsOpen(false)}>
                ×
              </button>
            </div>

            {/* Progress Bar */}
            <div className="progress-bar">
              {steps.map((_, idx) => (
                <div 
                  key={idx}
                  className={`progress-segment ${idx <= currentStep ? 'active' : ''}`}
                />
              ))}
            </div>

            {/* Question */}
            <div className="wizard-question">
              <h3>{currentStepData.question}</h3>
              <p className="subtitle">{currentStepData.subtitle}</p>
            </div>

            {/* Options */}
            <div className="wizard-options">
              {currentStepData.options.map((option) => {
                const stepId = steps[currentStep].id as keyof WizardState;
                const isSelected = selections[stepId] === option.id;
                
                return (
                  <button
                    key={option.id}
                    className={`option-card ${isSelected ? 'selected' : ''}`}
                    onClick={() => handleSelect(option.id)}
                  >
                    <div className="option-label">{option.label}</div>
                    <div className="option-desc">{option.desc}</div>
                  </button>
                );
              })}
            </div>

            {/* Match Count */}
            <div className="match-display">
              {matches} keyboards match
            </div>

            {/* Navigation */}
            <div className="wizard-nav">
              {currentStep > 0 && (
                <button 
                  className="nav-btn secondary"
                  onClick={() => setCurrentStep(prev => prev - 1)}
                >
                  ← Back
                </button>
              )}
              {currentStep === steps.length - 1 && (
                <button 
                  className="nav-btn primary"
                  onClick={applyFilters}
                >
                  Show Results
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
