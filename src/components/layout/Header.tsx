import Link from "next/link";
import DropdownMenu from "./DropdownMenu";
import { getServerSession } from "next-auth";
import { menu } from "@/lib/data";
import Search from "./Search";
import MobileMenu from "./MobileMenu";
import HeaderClient from "./HeaderClient";

export default async function Header() {
  const session = await getServerSession(); // Get the user's session on the server
  return <HeaderClient session={session} />;

  return (
    <header className="bg-gray-900 shadow-md">
      {/* Menu UI */}
      <nav className="container mx-auto flex items-center justify-between p-4 text-gray-200">
        <Link
          href="/"
          className="text-xl font-bold transition-colors hover:text-orange-400"
        >
          شریفی اصل <span className="text-orange-400">Dev</span>
        </Link>
        <ul className="hidden md:flex items-center gap-x-6">
          {menu.map((item) => (
            <li key={item.link}>
              {item.submenu ? (
                <DropdownMenu title={item.title} submenu={item.submenu} />
              ) : (
                <Link
                  href={item.link}
                  className="hover:text-orange-400 transition-colors"
                >
                  {item.title}
                </Link>
              )}
            </li>
          ))}
        </ul>

        {/* Right Section (Search, Auth, and Mobile Menu) */}
        <div className="flex items-center gap-x-4">
          {/* This div contains elements ONLY for desktop */}
          <div className="hidden md:flex items-center gap-x-4">
            <Search />
            {session ? (
              // If user is logged in, show User Panel
              <Link
                href="/dashboard"
                className="flex items-center gap-x-2 text-sm"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-5.5-2.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0ZM10 12a5.99 5.99 0 0 0-4.793 2.39A6.483 6.483 0 0 0 10 16.5a6.483 6.483 0 0 0 4.793-2.11A5.99 5.99 0 0 0 10 12Z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>پنل کاربری</span>
              </Link>
            ) : (
              // If user is not logged in, show Login/Register
              <Link
                href="/login"
                className="border border-gray-500 rounded-md px-4 py-2 text-sm hover:bg-orange-400 hover:border-orange-400 hover:text-gray-900 transition-colors"
              >
                ورود
              </Link>
            )}
          </div>

          {/* MobileMenu is now outside the 'hidden' div, so it can be displayed on mobile */}
          <MobileMenu />
        </div>
      </nav>
    </header>
  );
}
