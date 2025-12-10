"use client";

import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import { signOut } from "@/lib/auth-actions";
import { usePathname } from "next/navigation";
import { Playfair_Display, Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export default function Navbar() {
  const [allowed, setAllowed] = useState<boolean | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<any>(null);
  const pathname = usePathname();
  const [isClient, setIsClient] = useState(false);
  const mountTime = useRef(Date.now());
  const [isNavigating, setIsNavigating] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Fetch user session - now refetches on pathname change
  useEffect(() => {
    setLoading(true);
    fetch(`${process.env.__NEXT_ROUTER_BASEPATH || ''}/api/me`)
      .then((r) => r.json())
      .then((data) => {
        setSession(data.user);
        setAllowed(!!data.user); // Set allowed based on whether user exists
        setLoading(false);
      })
      .catch(() => {
        setSession(null);
        setAllowed(false);
        setLoading(false);
      });
  }, [pathname]); // Added pathname dependency

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  // Lock/unlock body scroll when mobile menu is open/closed
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
      document.body.style.paddingRight = "var(--scrollbar-width, 0px)";
    } else {
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
    }

    return () => {
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
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
    "block py-4 px-6 text-lg  uppercase border-b border-neutral-800 hover:bg-neutral-900 transition-colors duration-200";
  const mobileActiveLinkStyles = "text-white opacity-100";
  const mobileInactiveLinkStyles = "text-white opacity-70 hover:opacity-100";

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleExternalLink = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    
    if (isNavigating) return;

    const timeElapsed = Date.now() - mountTime.current;
    const SAFE_DELAY = 1500;
    
    if (timeElapsed < SAFE_DELAY) {
      setIsNavigating(true);
      document.body.style.cursor = "wait";
      const remainingTime = SAFE_DELAY - timeElapsed;
      
      setTimeout(() => {
        window.location.href = href;
      }, remainingTime);
    } else {
      window.location.href = href;
    }
  };

  // Enhanced Link Component with Hover Effects
  const NavLink = ({
    href,
    children,
    isExternal = false,
  }: {
    href: string;
    children: React.ReactNode;
    isExternal?: boolean;
  }) => {
    const linkClasses = `${baseLinkStyles} ${
      isActive(href) ? activeLinkStyles : inactiveLinkStyles
    }`;

    const underlineEffect = (
      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-[#EB9C1C] to-[#EB9C1C] transition-all duration-300 group-hover:w-full"></span>
    );

    if (isExternal) {
      return (
        <a
          href={href}
          className={linkClasses}
          rel="noopener noreferrer"
          onClick={(e) => handleExternalLink(e, href)}
        >
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
        <div className="mobile-nav">
          {/* Hamburger Menu Button */}
          <button
            onClick={toggleMobileMenu}
            aria-label="Toggle mobile menu"
            aria-expanded={isMobileMenuOpen}
            className="relative grid place-items-center w-8 h-8 focus:outline-none group"
          >
            <div className="relative w-6 h-6">
              <span
                className={`absolute left-1/2 top-1/2 block h-0.5 w-6 rounded bg-white
        transition-transform duration-300 ease-in-out transform
        group-hover:bg-[#F5F287]
        ${
          isMobileMenuOpen
            ? "rotate-45 -translate-x-1/2 -translate-y-1/2"
            : "-translate-x-1/2 -mt-1.5"
        }`}
              />
              <span
                className={`absolute left-1/2 top-1/2 block h-0.5 w-6 rounded bg-white
        transition-transform duration-300 ease-in-out transform
        group-hover:bg-[#F5F287]
        ${
          isMobileMenuOpen
            ? "-rotate-45 -translate-x-1/2 -translate-y-1/2"
            : "-translate-x-1/2 mt-1.5"
        }`}
              />
            </div>
          </button>

          {/* Centered Logo */}
          <Link href="/" className="flex-1 flex justify-center">
            <img
              src={`${
                process.env.__NEXT_ROUTER_BASEPATH || ""
              }/images/Logo_Navbar.png`}
              alt="Eraya Logo"
              className="h-8"
            />
          </Link>

          {/* Right Side Content */}
          <div className="flex items-center">
            {/* Shop Now button - only show for non-authenticated users */}
            {isClient && !session && (
              <a
                href="https://thehouseoferaya.store/collections/all"
                className={`px-4 py-1.5 bg-gradient-to-r from-[#EB9C1C] to-[#EB9C1C] text-black ${inter.className} font-semibold text-sm uppercase tracking-wider hover:shadow-lg hover:shadow-[#9A8E2B]/25 transition-all duration-200 transform hover:scale-105`}
                rel="noopener noreferrer"
                onClick={(e) =>
                  handleExternalLink(
                    e,
                    "https://thehouseoferaya.store/collections/all"
                  )
                }
              >
                Shop Now
              </a>
            )}

            {/* Sign out button for authenticated users */}
            {session && (
              <form action={signOut}>
                <button
                  type="submit"
                  className="rounded px-3 py-1 border border-white/30 text-sm opacity-60 hover:opacity-80"
                >
                  Sign out
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Desktop Navigation */}
        <div className="desktop-nav">
          {/* Logo on Left */}
          <div className="flex-shrink-0">
            <Link
              href="/"
              className="transition-transform duration-300 ease-out hover:scale-105"
            >
              <img
                src={`${
                  process.env.__NEXT_ROUTER_BASEPATH || ""
                }/images/Logo_Navbar.png`}
                alt="Eraya Logo"
                className="h-9"
              />
            </Link>
          </div>

          {/* Navigation Items on Right */}
          <div
            className={`flex gap-8 items-center text-base font-medium ${inter.className} uppercase`}
          >
            <NavLink href="/">Home</NavLink>
            <NavLink href="/our-story">Our Story</NavLink>
            <NavLink href="/blog">Journal</NavLink>
            <NavLink
              href="https://thehouseoferaya.store/collections/all"
              isExternal
            >
              Store
            </NavLink>

            {/* Shop Now button - only show for non-authenticated users */}
            {isClient && !session && !loading && (
              <a
                href="https://thehouseoferaya.store/collections/all"
                className="px-6 py-2 bg-[#EB9C1C] text-black font-semibold uppercase tracking-wider hover:shadow-lg hover:shadow-[#9A8E2B]/30 transition-all duration-300 transform hover:scale-105 hover:-translate-y-0.5 active:scale-95"
                rel="noopener noreferrer"
                onClick={(e) =>
                  handleExternalLink(
                    e,
                    "https://thehouseoferaya.store/collections/all"
                  )
                }
              >
                Shop Now
              </a>
            )}
            
            {/* Dashboard link for authenticated users */}
            {session && (
              <NavLink href="/dashboard">
                Dashboard
              </NavLink>
            )}

            {/* Sign out for authenticated users */}
            {session && (
              <form action={signOut}>
                <button
                  type="submit"
                  className="rounded px-3 py-1 border border-white/30 text-sm opacity-60 hover:opacity-80"
                >
                  Sign out
                </button>
              </form>
            )}
          </div>
        </div>
      </nav>

      {/* Mobile Sidebar Overlay */}
      <div
        className={`fixed inset-0 bg-black/80 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300 ease-in-out ${
          isMobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={toggleMobileMenu}
      >
        <div
          className={`fixed top-0 left-0 h-full bg-black transform transition-transform duration-300 ease-in-out z-50 lg:hidden
      w-[85%] max-w-xs sm:w-[70%] sm:max-w-sm md:w-[50%] md:max-w-md ${
        isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
      }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className={`flex flex-col ${inter.className} mt-10 py-4`}>
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
              href="https://thehouseoferaya.store/collections/all"
              className={`${mobileLinkStyles} ${mobileInactiveLinkStyles}`}
              rel="noopener noreferrer"
              onClick={(e) =>
                handleExternalLink(
                  e,
                  "https://thehouseoferaya.store/collections/all"
                )
              }
            >
              pre-order
            </a>
            
            {/* Dashboard link for authenticated users */}
            {session && (
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