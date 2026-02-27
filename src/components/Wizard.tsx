import React, { useState, useMemo, useEffect } from 'react';
import './Wizard.css';
import { KeyboardProduct } from '../types/keyboard';

interface WizardProps {
  products: KeyboardProduct[];
  onFilterChange: (filtered: KeyboardProduct[], selections: WizardState) => void;
  activeFilters?: WizardState | null;
}

interface WizardState {
  useCase: string | null;
  workspace: string | null;
  size: string | null;
  hotswap: string | null;
  budget: string | null;
}

interface Option {
  id: string;
  label: string;
  desc: string;
}

interface Step {
  id: keyof WizardState;
  question: string;
  subtitle: string;
  options: Option[];
}

// Filter logic - same for both counting and applying
const applyFilter = (products: KeyboardProduct[], selections: WizardState, stepId?: keyof WizardState): KeyboardProduct[] => {
  // Start with only keyboard products (exclude switches, keycaps, accessories)
  let filtered = products.filter(p => p.category === 'keyboard');
  
  // Use case filtering
  if (selections.useCase && stepId !== 'useCase') {
    const keywords: Record<string, string[]> = {
      gaming: ['gaming', 'rgb', 'macro', 'fast', 'reaction', 'competitive'],
      work: ['ergonomic', 'quiet', 'office', 'professional', 'productivity', 'typing'],
      creative: ['media', 'macro', 'programmable', 'control', 'dial', 'knob', 'encoder'],
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

  // Workspace filtering (noise level)
  if (selections.workspace && stepId !== 'workspace') {
    if (selections.workspace === 'shared') {
      // For shared spaces, exclude loud/clicky switches
      filtered = filtered.filter(p => 
        !p.name?.toLowerCase().includes('clicky') &&
        !p.name?.toLowerCase().includes('blue') &&
        !p.name?.toLowerCase().includes('jade') &&
        !p.name?.toLowerCase().includes('navy')
      );
    }
  }

  // Size filtering
  if (selections.size && stepId !== 'size') {
    const sizeKeywords: Record<string, string[]> = {
      fullsize: ['full', '100%', 'numpad', '104', '108', '96%', '1800'],
      tkl: ['tkl', 'tenkeyless', '80%', '87', '88'],
      compact: ['60%', '65%', 'compact', 'mini', '75%', '40%', '68', '69'],
    };
    const keywords = sizeKeywords[selections.size] || [];
    filtered = filtered.filter(p => 
      keywords.some(k => 
        p.name?.toLowerCase().includes(k) ||
        p.description?.toLowerCase().includes(k)
      )
    );
  }

  // Hotswap filtering
  if (selections.hotswap && selections.hotswap !== 'any' && stepId !== 'hotswap') {
    const hasHotswap = selections.hotswap === 'hotswap';
    filtered = filtered.filter(p => {
      const productHasHotswap = /hotswap|hot-swap|swappable|hot swap/i.test(p.name + ' ' + p.description);
      return hasHotswap ? productHasHotswap : !productHasHotswap;
    });
  }

  // Budget filtering
  if (selections.budget && stepId !== 'budget') {
    const priceRanges: Record<string, [number, number]> = {
      budget: [0, 100],
      mid: [100, 200],
      premium: [200, 10000],
    };
    const [min, max] = priceRanges[selections.budget] || [0, 10000];
    filtered = filtered.filter(p => {
      const priceStr = p.price?.replace(/[^0-9.]/g, '');
      const price = parseFloat(priceStr || '0');
      return price >= min && price <= max;
    });
  }

  return filtered;
};

// Calculate matches for a specific option
const calculateOptionMatches = (
  products: KeyboardProduct[],
  selections: WizardState,
  stepId: keyof WizardState,
  optionId: string
): number => {
  const testSelections = { ...selections, [stepId]: optionId };
  return applyFilter(products, testSelections).length;
};

const steps: Step[] = [
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

export default function Wizard({ products, onFilterChange, activeFilters }: WizardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [selections, setSelections] = useState<WizardState>({
    useCase: null,
    workspace: null,
    size: null,
    hotswap: null,
    budget: null,
  });

  // Sync selections with activeFilters when provided or changed
  useEffect(() => {
    if (activeFilters) {
      setSelections(activeFilters);
    }
  }, [activeFilters]);

  // Track if wizard filters are active
  const isWizardActive = useMemo(() => {
    return Object.values(selections).some(s => s !== null);
  }, [selections]);

  // Calculate current possible matches after all selections so far
  const currentMatches = useMemo(() => {
    return applyFilter(products, selections).length;
  }, [products, selections]);

  // Calculate matches for each option in current step
  const optionsWithCounts = useMemo(() => {
    const step = steps[currentStep];
    return step.options.map(option => {
      const count = calculateOptionMatches(products, selections, step.id, option.id);
      return { ...option, count };
    });
  }, [products, selections, currentStep]);

  // Check if we're about to have 0 results
  const willHaveZeroResults = currentMatches === 0;

  const handleSelect = (optionId: string) => {
    const stepId = steps[currentStep].id;
    const newSelections = { ...selections, [stepId]: optionId };
    
    // Check if this selection would result in 0 matches
    const testCount = calculateOptionMatches(products, selections, stepId, optionId);
    
    if (testCount === 0) {
      // Don't allow selection that leads to 0 results
      return;
    }
    
    setSelections(newSelections);
    
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      // Apply final filter
      setIsOpen(false);
      const filtered = applyFilter(products, newSelections);
      onFilterChange(filtered, newSelections);
    }
  };

  const applyFilters = () => {
    const filtered = applyFilter(products, selections);
    setIsOpen(false);
    onFilterChange(filtered, selections);
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
    const emptySelections = {
      useCase: null,
      workspace: null,
      size: null,
      hotswap: null,
      budget: null,
    };
    onFilterChange(products, emptySelections);
  };

  // Go back one step
  const goBack = () => {
    if (currentStep > 0) {
      // Clear the current step's selection when going back
      const currentStepId = steps[currentStep].id;
      setSelections(prev => ({ ...prev, [currentStepId]: null }));
      setCurrentStep(prev => prev - 1);
    }
  };

  const currentStepData = steps[currentStep];
  const hasSelections = Object.values(selections).some(s => s !== null);

  // Generate filter summary text
  const getFilterSummary = () => {
    const parts: string[] = [];
    if (selections.useCase) {
      const labels: Record<string, string> = {
        gaming: 'Gaming',
        work: 'Work',
        creative: 'Creative',
        general: 'General',
      };
      parts.push(labels[selections.useCase] || selections.useCase);
    }
    if (selections.size) {
      const labels: Record<string, string> = {
        fullsize: 'Full Size',
        tkl: 'TKL',
        compact: 'Compact',
      };
      parts.push(labels[selections.size] || selections.size);
    }
    if (selections.budget) {
      const labels: Record<string, string> = {
        budget: 'Under $100',
        mid: '$100-200',
        premium: '$200+',
      };
      parts.push(labels[selections.budget] || selections.budget);
    }
    return parts.join(' • ');
  };

  return (
    <>
      {/* Floating Action Button */}
      <button 
        className={`wizard-fab ${isWizardActive ? 'active' : ''}`}
        onClick={() => setIsOpen(true)}
        aria-label="Open keyboard finder"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="2" y="4" width="20" height="16" rx="2" />
          <path d="M6 8h.01M10 8h.01M14 8h.01M18 8h.01M8 12h.01M12 12h.01M16 12h.01M6 16h12" />
        </svg>
        {isWizardActive && currentMatches > 0 && (
          <span className="match-count">{currentMatches}</span>
        )}
      </button>

      {/* Active Filters Summary */}
      {isWizardActive && !isOpen && (
        <div className="wizard-active-indicator" onClick={() => setIsOpen(true)}>
          <div className="wizard-active-content">
            <span className="wizard-active-icon">🎯</span>
            <span className="wizard-active-text">{getFilterSummary()}</span>
            <span className="wizard-active-count">{currentMatches} results</span>
          </div>
          <button 
            className="wizard-clear-btn"
            onClick={(e) => {
              e.stopPropagation();
              resetWizard();
            }}
            title="Clear wizard filters"
          >
            ×
          </button>
        </div>
      )}

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

            {/* Info banner showing current matches */}
            <div className={`match-info-banner ${currentMatches === 0 ? 'warning' : currentMatches < 10 ? 'low' : 'good'}`}>
              {currentMatches === 0 ? (
                <span>⚠️ No keyboards match your current selections</span>
              ) : currentMatches < 10 ? (
                <span>⚡ {currentMatches} keyboards match so far</span>
              ) : (
                <span>✓ {currentMatches} keyboards match your criteria</span>
              )}
            </div>

            {/* Options with counts */}
            <div className="wizard-options">
              {optionsWithCounts.map((option) => {
                const isSelected = selections[currentStepData.id] === option.id;
                const hasMatches = option.count > 0;
                
                return (
                  <button
                    key={option.id}
                    className={`option-card ${isSelected ? 'selected' : ''} ${!hasMatches ? 'disabled' : ''}`}
                    onClick={() => hasMatches && handleSelect(option.id)}
                    disabled={!hasMatches}
                  >
                    <div className="option-row">
                      <div className="option-label">{option.label}</div>
                      <div className={`option-count ${option.count === 0 ? 'zero' : option.count < 10 ? 'low' : ''}`}>
                        {option.count > 0 ? `${option.count} options` : 'No matches'}
                      </div>
                    </div>
                    <div className="option-desc">{option.desc}</div>
                  </button>
                );
              })}
            </div>

            {/* Warning if 0 results */}
            {willHaveZeroResults && (
              <div className="zero-results-warning">
                <p>❌ Your current selections don't match any keyboards.</p>
                <button onClick={goBack} className="back-to-adjust">
                  ← Go back and adjust
                </button>
              </div>
            )}

            {/* Navigation */}
            <div className="wizard-nav">
              {currentStep > 0 && (
                <button 
                  className="nav-btn secondary"
                  onClick={goBack}
                >
                  ← Back
                </button>
              )}
              {currentStep === steps.length - 1 && currentMatches > 0 && (
                <button 
                  className="nav-btn primary"
                  onClick={applyFilters}
                >
                  Show {currentMatches} Results
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
