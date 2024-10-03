import React from "react";
import Image from "next/image";

/**
 * @file PortfolioLink.tsx
 * @description This file defines a simple component that renders an image of the portfolio icon as a clickable link.
 * The link redirects the user to a specified portfolio URL when clicked. The image is styled using Tailwind CSS
 * and supports dark mode by being responsive and adjusting size dynamically.
 *
 * The component is designed to be minimal and responsive. It uses a combination of Tailwind utility classes
 * and ensures consistent appearance across different screen sizes and themes.
 *
 * @returns A JSX element rendering the portfolio icon as a link.
 *
 * @example
 * <PortfolioLink />
 *
 * This will render a clickable portfolio icon linking to the specified portfolio URL.
 */

const PortfolioLink: React.FC = () => {
  return (
    // Anchor tag wrapping the portfolio icon, pointing to the desired portfolio URL
    <a href="https://benwjd.com" target="_blank" rel="noopener noreferrer">
      <img
        src="/images/portfolio-icon.png"
        alt="Portfolio Icon"
        width={24} // Tailwind w-6 (24px)
        height={24} // Tailwind h-6 (24px)
        className="w-6 h-6" // Apply Tailwind sizing
      />
    </a>
  );
};

export default PortfolioLink;
