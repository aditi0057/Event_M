'use client';

import { headerLinks } from '@/constants';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NavItems = () => {
  const pathname = usePathname();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false); 

  useEffect(() => {
    
    const checkLoginStatus = () => {
      const loggedIn = Boolean(localStorage.getItem('isLoggedIn'));
      setIsLoggedIn(loggedIn);
    };

    checkLoginStatus();
  }, []);

  const handleLogout = () => {
  
    localStorage.removeItem('isLoggedIn'); 
    setIsLoggedIn(false);
  };

  const handleLoginClick = () => {
    setIsPopupOpen(true);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
    
    setIsLoggedIn(true);
    localStorage.setItem('isLoggedIn', 'true'); 
  };

  return (
    <ul className="flex w-full flex-col items-start gap-1 md:flex-row md:items-center md:justify-center md:gap-2">
      {headerLinks.map((link) => {
        const isActive = pathname === link.route;
        
        return (
          <li
            key={link.route}
            className={`w-full md:w-auto ${
              isActive ? 'text-[#1f2933]' : 'text-[#6b7280]'
            }`}
          >
            <Link
              href={link.route}
              className={`block w-full rounded-md px-3 py-2 text-sm font-medium transition-colors md:w-auto ${
                isActive
                  ? 'bg-[#eef1f4] text-[#1f2933]'
                  : 'hover:bg-[#f3f6f8] hover:text-[#1f2933]'
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
