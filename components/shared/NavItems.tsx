'use client';

import { headerLinks } from '@/constants';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NavItems = () => {
  const pathname = usePathname();

  return (
    <ul className="flex w-full flex-col items-start gap-1 md:flex-row md:items-center md:justify-center md:gap-8">
      {headerLinks.map((link) => {
        const isActive = pathname === link.route || (link.route !== '/' && pathname.startsWith(link.route));
        
        return (
          <li key={link.route} className="w-full md:w-auto">
            <Link
              href={link.route}
              className={`relative block w-full px-3 py-3 text-sm font-medium transition-colors md:w-auto md:px-0 md:py-2 ${
                isActive
                  ? 'text-[var(--color-accent)] after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:bg-[var(--color-accent)] md:font-semibold'
                  : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
              }`}
            >
              {link.label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
};

export default NavItems;
