import * as React from 'react';

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      'fluent-design-system-provider': any;
      'fluent-card': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement> & { Minimalistic?: boolean }, HTMLElement>;
      'fluent-button': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement> & { appearance?: 'accent' | 'lightweight' | 'neutral' | 'stealth' }, HTMLElement>;
      'fluent-progress-ring': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement> & { value?: number, min?: number, max?: number }, HTMLElement>;
      'fluent-text-field': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement> & { value?: string, placeholder?: string }, HTMLElement>;
      'fluent-checkbox': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement> & { checked?: boolean }, HTMLElement>;
      'fluent-tabs': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement> & { activeid?: string }, HTMLElement>;
      'fluent-tab': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement> & { id?: string }, HTMLElement>;
      'fluent-tab-panel': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement> & { id?: string }, HTMLElement>;
    }
  }
}
