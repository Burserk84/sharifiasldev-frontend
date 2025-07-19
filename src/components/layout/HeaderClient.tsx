"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Session } from "next-auth";
import DropdownMenu from "./DropdownMenu";
import Search from "./Search";
import MobileMenu from "./MobileMenu";

const menu = [
  { title: "خانه", link: "/" },
  {
    title: "فروشگاه",
    link: "/products",
    submenu: [
      {
        title: "قالب‌ها و تم‌ها",
        link: "/products/themes",
        submenu: [
          { title: "قالب Html", link: "/products/themes/html_template" },
          { title: "قالب وردپرس", link: "/products/themes/wp_template" },
        ],
      },
      { title: "افزونه وردپرس", link: "/products/plugins" },
    ],
  },
  { title: "بلاگ", link: "/blog" },
  { title: "نمونه کارها", link: "/portfolio" },
  { title: "تماس با ما", link: "/contact" },
  { title: "درباره ما", link: "/about" },
];

interface HeaderClientProps {
  session: Session | null;
}

export default function HeaderClient({ session }: HeaderClientProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [lastScrollY]);

  return (
    <header
      className={`bg-gray-900 shadow-md sticky top-0 z-20 transition-transform duration-300 ${
        isVisible ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <nav className="container mx-auto flex items-center justify-between p-4 text-gray-200">
        <Link href="/" className="text-xl font-bold transition-colors hover:text-orange-400">
          شریفی اصل <span className="text-orange-400">Dev</span>
        </Link>
        
        {/* Desktop Menu (hidden on mobile) */}
        <ul className="hidden md:flex items-center gap-x-6">
          {menu.map((item) => (
            <li key={item.link}>
              {item.submenu ? (
                <DropdownMenu title={item.title} submenu={item.submenu} />
              ) : (
                <Link href={item.link} className="hover:text-orange-400 transition-colors">
                  {item.title}
                </Link>
              )}
            </li>
          ))}
        </ul>

        {/* Right Section: Search, Auth, and Mobile Menu Toggle */}
        <div className="flex items-center gap-x-4">
          <Search />
          
          {/* Auth buttons are now visible on all screen sizes */}
          {session ? (
            <Link href="/dashboard" className="hidden sm:flex items-center gap-x-2 text-sm">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-5.5-2.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0ZM10 12a5.99 5.99 0 0 0-4.793 2.39A6.483 6.483 0 0 0 10 16.5a6.483 6.483 0 0 0 4.793-2.11A5.99 5.99 0 0 0 10 12Z" clipRule="evenodd" /></svg>
              <span>پنل کاربری</span>
            </Link>
          ) : (
            <Link href="/login" className="flex border border-gray-500 rounded-md px-4 py-2 text-sm hover:bg-orange-400 hover:border-orange-400 hover:text-gray-900 transition-colors">
              ورود
            </Link>
          )}
          
          {/* MobileMenu component only shows the hamburger button on mobile */}
          <MobileMenu />
        </div>
      </nav>
    </header>
  );
}