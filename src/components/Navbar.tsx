"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import { Playfair_Display, Inter } from "next/font/google";

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export default function Navbar() {
  const [allowed, setAllowed] = useState<boolean | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    let mounted = true;
    fetch("/api/me")
      .then((r) => r.json())
      .then((data) => mounted && setAllowed(Boolean(data.allowed)))
      .catch(() => mounted && setAllowed(false));
    return () => {
      mounted = false;
    };
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  // Lock/unlock body scroll when mobile menu is open/closed
  useEffect(() => {
    if (isMobileMenuOpen) {
      // Lock scroll
      document.body.style.overflow = 'hidden';
      document.body.style.paddingRight = 'var(--scrollbar-width, 0px)';
    } else {
      // Unlock scroll
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    };
  }, [isMobileMenuOpen]);

  // Helper function to check if link is active
  const isActive = (path: string) => {
    if (path === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(path);
  };

  // Enhanced navigation link styles with hover effects
  const baseLinkStyles = "relative transition-all duration-300 ease-out group";
  const activeLinkStyles = "text-white";
  const inactiveLinkStyles = "text-white/70 hover:text-white";

  // Mobile menu link styles
  const mobileLinkStyles =
    "block py-4 px-6 text-lg font-medium uppercase border-b border-neutral-800 hover:bg-neutral-900 transition-colors duration-200";
  const mobileActiveLinkStyles = "text-white opacity-100";
  const mobileInactiveLinkStyles = "text-white opacity-70 hover:opacity-100";

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Enhanced Link Component with Hover Effects
  const NavLink = ({ href, children, isExternal = false }: { 
    href: string; 
    children: React.ReactNode; 
    isExternal?: boolean;
  }) => {
    const linkClasses = `${baseLinkStyles} ${
      isActive(href) ? activeLinkStyles : inactiveLinkStyles
    }`;

    const underlineEffect = (
      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-[#EB9C1C] to-[#EB9C1C] transition-all duration-300 group-hover:w-full"></span>
      // <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-[#9A8E2B] to-[#F5F287] transition-all duration-300 group-hover:w-full"></span>
    );

    if (isExternal) {
      return (
        <a href={href} className={linkClasses} rel="noopener noreferrer">
          <span className="relative">
            {children}
            {underlineEffect}
          </span>
        </a>
      );
    }

    return (
      <Link href={href} className={linkClasses}>
        <span className="relative">
          {children}
          {underlineEffect}
        </span>
      </Link>
    );
  };

  return (
    <>
      <nav className="w-full bg-black text-white backdrop-blur relative top-0 inset-x-0 z-50">
        {/* Mobile Navigation */}
        <div className="max-[640px]:flex items-center justify-between px-4 py-3 md:hidden">
          {/* Hamburger Menu Button */}
          <button
            onClick={toggleMobileMenu}
            className="relative flex flex-col justify-center items-center w-8 h-8 focus:outline-none group"
            aria-label="Toggle mobile menu"
          >
            <span
              className={`block w-6 h-0.5 bg-white transition-all duration-300 transform group-hover:bg-[#F5F287] ${
                isMobileMenuOpen ? "rotate-45 absolute" : "mb-1"
              }`}
            ></span>
            <span
              className={`block w-6 h-0.5 bg-white transition-all duration-300 transform group-hover:bg-[#F5F287] ${
                isMobileMenuOpen ? "-rotate-45 absolute" : "mt-1"
              }`}
            ></span>
          </button>

          {/* Centered Logo */}
          <Link href="/" className="absolute left-40 transition-transform duration-200 hover:scale-105">
            <img
              src="/images/Final_Logo_Navbar.png"
              alt="Eraya Logo"
              className="h-8"
            />
          </Link>

          {/* Right Side Content */}
          <div className="flex items-center">
            {/* Shop Now button - only show for non-authenticated users */}
            {!allowed && allowed !== null && (
              <a
                href="https://1-9-by-eraya.myshopify.com/collections/all"
                className={`px-4 py-1.5 bg-gradient-to-r from-[#EB9C1C] to-[#EB9C1C] text-black ${inter.className} font-semibold text-sm uppercase tracking-wider hover:shadow-lg hover:shadow-[#9A8E2B]/25 transition-all duration-200 transform hover:scale-105`}
                // className={`px-4 py-1.5 bg-gradient-to-r from-[#9A8E2B] to-[#F5F287] text-black ${inter.className} font-bold text-sm uppercase tracking-wider hover:shadow-lg hover:shadow-[#9A8E2B]/25 transition-all duration-200 transform hover:scale-105`}
                rel="noopener noreferrer"
              >
                Shop Now
              </a>
            )}

            {/* Sign out button for authenticated users */}
            {allowed && (
              <button
                className={`rounded px-3 py-1 border border-white/30 text-sm ${inter.className} opacity-60 hover:opacity-80 hover:border-white/50 transition-all duration-200`}
                onClick={() => {
                  signOut()
                    .then(() => {
                      window.location.href = "/";
                    })
                    .catch(() => {
                      window.location.href = "/";
                    });
                }}
              >
                Sign out
              </button>
            )}
          </div>
        </div>

        {/* Desktop Navigation */}
        <div className="deskV flex min-[1024px]:items-center min-[1024px]:justify-between min-[1024px]:px-6 min-[1024px]:py-4">
          {/* Logo on Left */}
          <div className="flex-shrink-0">
            <Link href="/" className="transition-transform duration-300 ease-out hover:scale-105">
              <img
                src="/images/Final_Logo_Navbar.png"
                alt="Eraya Logo"
                className="h-9"
              />
            </Link>
          </div>

          {/* Navigation Items on Right */}
          <div className={`flex gap-8 items-center text-base font-medium ${inter.className} uppercase`}>
            <NavLink href="/">Home</NavLink>
            <NavLink href="/our-story">Our Story</NavLink>
            <NavLink href="/blog">Journal</NavLink>
            <NavLink href="https://1-9-by-eraya.myshopify.com/collections/all" isExternal>
              Perfumes
            </NavLink>
            <NavLink href="/pre-order">Pre Order</NavLink>

            {/* Shop Now button - only show for non-authenticated users */}
            {!allowed && allowed !== null && (
              <a
                href="https://1-9-by-eraya.myshopify.com/collections/all"
                className="px-6 py-2 bg-[#EB9C1C] text-black font-semibold uppercase tracking-wider hover:shadow-lg hover:shadow-[#9A8E2B]/30 transition-all duration-300 transform hover:scale-105 hover:-translate-y-0.5 active:scale-95"
                rel="noopener noreferrer"
              >
                Shop Now
              </a>
            )}

            {/* Only show Dashboard + Sign out for allowed users */}
            {allowed ? (
              <>
                <NavLink href="/dashboard">Dashboard</NavLink>
                <button
                  className="rounded px-3 py-1 border border-white/30 opacity-60 hover:opacity-80 hover:border-white/50 hover:bg-white/5 transition-all duration-200"
                  onClick={() => {
                    signOut()
                      .then(() => {
                        window.location.href = "/";
                      })
                      .catch(() => {
                        window.location.href = "/";
                      });
                  }}
                >
                  Sign out
                </button>
              </>
            ) : null}
          </div>
        </div>
      </nav>

      {/* Mobile Sidebar Overlay */}
      <div
        className={`fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity duration-300 ease-in-out ${
          isMobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={toggleMobileMenu}
      >
        {/* Mobile Sidebar */}
        <div
          className={`fixed top-0 left-0 h-full w-80 bg-black border-neutral-800 transform transition-transform duration-300 ease-in-out z-50 md:hidden ${
            isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          {/* Sidebar Header */}
          <div className="flex items-center justify-between p-2">
            <button
              onClick={toggleMobileMenu}
              className="p-2 hover:bg-neutral-900 rounded transition-colors duration-200"
            >
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Sidebar Navigation */}
          <div className={`flex flex-col ${inter.className}`}>
            <Link
              href="/"
              className={`${mobileLinkStyles} ${
                isActive("/")
                  ? mobileActiveLinkStyles
                  : mobileInactiveLinkStyles
              }`}
            >
              Home
            </Link>
            <Link
              href="/our-story"
              className={`${mobileLinkStyles} ${
                isActive("/our-story")
                  ? mobileActiveLinkStyles
                  : mobileInactiveLinkStyles
              }`}
            >
              Our Story
            </Link>
            <Link
              href="/blog"
              className={`${mobileLinkStyles} ${
                isActive("/blog")
                  ? mobileActiveLinkStyles
                  : mobileInactiveLinkStyles
              }`}
            >
              Journal
            </Link>
            <a
              href="https://1-9-by-eraya.myshopify.com/collections/all"
              className={`${mobileLinkStyles} ${mobileInactiveLinkStyles}`}
              rel="noopener noreferrer"
            >
              Perfumes
            </a>
            <Link
              href="/pre-order"
              className={`${mobileLinkStyles} ${
                isActive("/pre-order")
                  ? mobileActiveLinkStyles
                  : mobileInactiveLinkStyles
              }`}
            >
              Pre Order
            </Link>

            {/* Dashboard link for authenticated users */}
            {allowed && (
              <Link
                href="/dashboard"
                className={`${mobileLinkStyles} ${
                  isActive("/dashboard")
                    ? mobileActiveLinkStyles
                    : mobileInactiveLinkStyles
                }`}
              >
                Dashboard
              </Link>
            )}
          </div>
        </div>
      </div>
    </>
  );
}