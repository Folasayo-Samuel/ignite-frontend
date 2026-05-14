import DOMPurify from 'isomorphic-dompurify';
import React from 'react';

interface SafeHTMLProps extends React.HTMLAttributes<HTMLDivElement> {
  html: string;
}

/**
 * SafeHTML wrapper component
 * Sanitizes raw HTML strings to prevent Cross-Site Scripting (XSS) attacks
 * before rendering them with dangerouslySetInnerHTML.
 */
export const SafeHTML: React.FC<SafeHTMLProps> = ({ html, ...props }) => {
  const cleanHTML = DOMPurify.sanitize(html, {
    USE_PROFILES: { html: true }, // Allow standard HTML
    ADD_ATTR: ['target'], // Allow target="_blank"
  });

  return (
    <div
      {...props}
      dangerouslySetInnerHTML={{ __html: cleanHTML }}
    />
  );
};
