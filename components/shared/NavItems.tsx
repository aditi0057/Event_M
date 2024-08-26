'use client';

import { useState, useEffect } from 'react';
import { headerLinks } from '@/constants';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FaUserCircle } from 'react-icons/fa'; 
import { AiOutlineLogin } from 'react-icons/ai'; 
import { IoLogOut } from 'react-icons/io5';
import LoginSignupPopup from '../../app/login/page'; 

const NavItems = () => {
  const pathname = usePathname();
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Manage login state
  const [isPopupOpen, setIsPopupOpen] = useState(false); // Manage popup state

  useEffect(() => {
    // Placeholder for checking login status
    // Replace with actual logic for checking if the user is logged in
    const checkLoginStatus = () => {
      const loggedIn = Boolean(localStorage.getItem('isLoggedIn')); // Example logic using localStorage
      setIsLoggedIn(loggedIn);
    };

    checkLoginStatus();
  }, []);

  const handleLogout = () => {
    // Handle logout logic
    localStorage.removeItem('isLoggedIn'); // Simulate logging out by removing the login status
    setIsLoggedIn(false);
  };

  const handleLoginClick = () => {
    setIsPopupOpen(true);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
    // Simulate setting the user as logged in after the popup is closed
    setIsLoggedIn(true);
    localStorage.setItem('isLoggedIn', 'true'); // Example logic using localStorage
  };

  return (
    <div className="flex items-center justify-between w-full">
      <ul className="flex justify-center items-center gap-10">
        {headerLinks.map((link) => {
          const isActive = pathname === link.route;
          
          return (
            <li
              key={link.route}
              className={`${
                isActive ? 'text-primary-500' : ''
              } flex-center p-medium-16 whitespace-nowrap`}
            >
              <Link href={link.route}>{link.label}</Link>
            </li>
          );
        })}
      </ul>
      <div className="flex items-center gap-4">
        {!isLoggedIn ? (
          <button onClick={handleLoginClick} className="text-primary-500 text-xl flex items-center gap-2 px-60">
            <AiOutlineLogin />
            Login/Signup
          </button>
        ) : (
          <>
            <Link href="/UserDashboard">
              <button className="text-primary-500 text-xl flex items-center  px-60 ">
                <FaUserCircle />
                Profile
              </button>
            </Link>
            <button onClick={handleLogout} className="text-primary-500 text-xl flex items-center -ml-56 ">
              <IoLogOut />
              Logout
            </button>
          </>
        )}
      </div>
      <LoginSignupPopup isOpen={isPopupOpen} onClose={handleClosePopup} />
    </div>
  );
};

export default NavItems;
