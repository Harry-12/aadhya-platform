"use client";

import { useState } from "react";
import { TEMPLATES, type InvitationTemplate } from "@/lib/templates";

interface TemplatePickerProps {
  eventType: string;
  selectedTemplate: string | null;
  onSelect: (template: InvitationTemplate) => void;
}

const CATEGORIES = [
  { key: 'all', label: 'All' },
  { key: 'elegant', label: 'Elegant' },
  { key: 'fun', label: 'Fun & Playful' },
  { key: 'minimal', label: 'Minimal' },
  { key: 'cultural', label: 'Cultural' },
  { key: 'premium', label: 'Premium' },
];

export function TemplatePicker({ eventType, selectedTemplate, onSelect }: TemplatePickerProps) {
  const [activeCategory, setActiveCategory] = useState('all');

  // Sort: templates matching the event type first, then all others
  const sortedTemplates = [...TEMPLATES].sort((a, b) => {
    const aMatch = a.eventTypes.includes(eventType) ? 0 : 1;
    const bMatch = b.eventTypes.includes(eventType) ? 0 : 1;
    return aMatch - bMatch;
  });

  const filtered = activeCategory === 'all'
    ? sortedTemplates
    : sortedTemplates.filter(t => t.category === activeCategory);

  return (
    <div>
      <h2 className="font-display text-lg font-semibold text-charcoal mb-2">Choose Your Template</h2>
      <p className="text-sm text-charcoal-light mb-6">Pick a design that matches your celebration style</p>

      {/* Category filters */}
      <div className="flex gap-2 overflow-x-auto pb-3 mb-6 scrollbar-hide">
        {CATEGORIES.map(cat => (
          <button
            key={cat.key}
            onClick={() => setActiveCategory(cat.key)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
              activeCategory === cat.key
                ? 'bg-charcoal text-white shadow-sm'
                : 'bg-white text-charcoal-light hover:bg-cream border border-gold/15'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Template grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {filtered.map((template) => {
          const isSelected = selectedTemplate === template.id;
          const isRecommended = template.eventTypes.includes(eventType);

          return (
            <button
              key={template.id}
              onClick={() => onSelect(template)}
              className={`group relative rounded-2xl overflow-hidden transition-all duration-300 ${
                isSelected
                  ? 'ring-3 ring-offset-2 ring-charcoal scale-[1.02] shadow-xl'
                  : 'hover:scale-[1.02] hover:shadow-lg shadow-sm'
              }`}
            >
              {/* Template preview card */}
              <div
                className="aspect-[3/4] relative flex flex-col items-center justify-center p-4"
                style={{ background: template.preview.gradient }}
              >
                {/* Decorative elements */}
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute top-3 left-3 w-8 h-8 border border-white/30 rounded-full" />
                  <div className="absolute bottom-3 right-3 w-6 h-6 border border-white/30 rounded-full" />
                  <div className="absolute top-1/4 right-1/4 w-2 h-2 bg-white/40 rounded-full" />
                  <div className="absolute bottom-1/3 left-1/3 w-1.5 h-1.5 bg-white/30 rounded-full" />
                </div>

                {/* Mini invitation preview */}
                <div className="relative z-10 text-center">
                  <div
                    className="w-10 h-px mx-auto mb-3 opacity-60"
                    style={{ background: template.preview.accentColor }}
                  />
                  <p
                    className="text-[10px] uppercase tracking-[0.2em] opacity-70 mb-1"
                    style={{ color: template.preview.textColor }}
                  >
                    You&apos;re Invited
                  </p>
                  <p
                    className={`text-base font-bold leading-tight ${
                      template.preview.fontStyle === 'serif' ? 'font-display' : 'font-body'
                    }`}
                    style={{ color: template.preview.textColor }}
                  >
                    Event Name
                  </p>
                  <div
                    className="w-10 h-px mx-auto mt-3 opacity-60"
                    style={{ background: template.preview.accentColor }}
                  />
                  <p
                    className="text-[9px] mt-2 opacity-50"
                    style={{ color: template.preview.textColor }}
                  >
                    Date & Time
                  </p>
                </div>

                {/* Selected checkmark */}
                {isSelected && (
                  <div className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white shadow-lg flex items-center justify-center">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#18181B" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                  </div>
                )}

                {/* Recommended badge */}
                {isRecommended && !isSelected && (
                  <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-white/90 backdrop-blur text-[9px] font-semibold text-charcoal shadow-sm">
                    Recommended
                  </div>
                )}
              </div>

              {/* Template name */}
              <div className="bg-white p-3 text-center border-t border-gold/10">
                <p className="text-sm font-semibold text-charcoal">{template.name}</p>
                <p className="text-[11px] text-charcoal-muted mt-0.5">{template.description}</p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
