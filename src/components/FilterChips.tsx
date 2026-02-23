import React from 'react';
import './FilterChips.css';

interface FilterChipsProps {
  categories: string[];
  activeCategory: string;
  onCategoryChange: (category: string) => void;
  counts?: Record<string, number>;
}

export default function FilterChips({ categories, activeCategory, onCategoryChange, counts }: FilterChipsProps) {
  const categoryLabels: Record<string, string> = {
    'all': 'All Products',
    'keyboard': 'Keyboards',
    'switches': 'Switches',
    'keycaps': 'Keycaps',
    'artisan': 'Artisan',
    'case': 'Cases',
  };

  const categoryIcons: Record<string, string> = {
    'all': '•',
    'keyboard': '□',
    'switches': '○',
    'keycaps': '◇',
    'artisan': '☆',
    'case': '▭',
  };

  return (
    <div className="filter-chips" role="group" aria-label="Filter by category">
      {categories.map(category => {
        const isActive = activeCategory === category;
        const count = counts?.[category];
        
        return (
          <button
            key={category}
            className={`filter-chip ${isActive ? 'active' : ''}`}
            onClick={() => onCategoryChange(category)}
            aria-pressed={isActive}
            aria-label={`${categoryLabels[category]}${count ? ` (${count})` : ''}`}
          >
            <span className="filter-chip-icon" aria-hidden="true">
              {categoryIcons[category] || '•'}
            </span>
            <span className="filter-chip-label">{categoryLabels[category] || category}</span>
            {count !== undefined && (
              <span className="filter-chip-count">{count}</span>
            )}
          </button>
        );
      })}
    </div>
  );
}
