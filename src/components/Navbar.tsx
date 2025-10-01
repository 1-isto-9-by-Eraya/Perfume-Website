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
      document.body.style.overflow = "hidden";
      document.body.style.paddingRight = "var(--scrollbar-width, 0px)";
    } else {
      // Unlock scroll
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
    }

    // Cleanup on unmount
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
    "block py-4 px-6 text-4xl  uppercase border-b border-neutral-800 hover:bg-neutral-900 transition-colors duration-200";
  const mobileActiveLinkStyles = "text-white opacity-100";
  const mobileInactiveLinkStyles = "text-white opacity-70 hover:opacity-100";

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
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
        <div className="mobile-nav">
          {/* Hamburger Menu Button */}
          <button
            onClick={toggleMobileMenu}
            aria-label="Toggle mobile menu"
            aria-expanded={isMobileMenuOpen}
            className="relative grid place-items-center w-8 h-8 focus:outline-none group"
          >
            <div className="relative w-6 h-6">
              {/* Top bar */}
              <span
                className={`absolute left-1/2 top-1/2 block h-0.5 w-6 rounded bg-white
        transition-transform duration-300 ease-in-out transform
        group-hover:bg-[#F5F287]
        ${
          isMobileMenuOpen
            ? "rotate-45 -translate-x-1/2 -translate-y-1/2"
            : "-translate-x-1/2 -mt-1.5"
        }  /* move UP when closed */
      `}
              />
              {/* Bottom bar */}
              <span
                className={`absolute left-1/2 top-1/2 block h-0.5 w-6 rounded bg-white
        transition-transform duration-300 ease-in-out transform
        group-hover:bg-[#F5F287]
        ${
          isMobileMenuOpen
            ? "-rotate-45 -translate-x-1/2 -translate-y-1/2"
            : "-translate-x-1/2 mt-1.5"
        }   /* move DOWN when closed */
      `}
              />
            </div>
          </button>

          {/* Centered Logo */}
          <Link href="/" className="flex-1 flex justify-center">
            <img
              // src="/images/Logo_Navbar.png"
              src={`${process.env.__NEXT_ROUTER_BASEPATH || ''}/images/Logo_Navbar.png`}
              alt="Eraya Logo"
              className="h-8"
            />
          </Link>

          {/* Right Side Content */}
          <div className="flex items-center">
            {/* Shop Now button - only show for non-authenticated users */}
            {!allowed && allowed !== null && (
              <a
                href="https://thehouseoferaya.store/collections/all"
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
        <div className="desktop-nav">
          {/* Logo on Left */}
          <div className="flex-shrink-0">
            <Link
              href="/"
              className="transition-transform duration-300 ease-out hover:scale-105"
            >
              <img
                // src="/images/Logo_Navbar.png"
                src={`${process.env.__NEXT_ROUTER_BASEPATH || ''}/images/Logo_Navbar.png`}
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
              pre order
            </NavLink>
            {/* <NavLink href="/pre-order">Pre Order</NavLink> */}

            {/* Shop Now button - only show for non-authenticated users */}
            {!allowed && allowed !== null && (
              <a
                href="https://thehouseoferaya.store/collections/all"
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
            >
              Store
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
