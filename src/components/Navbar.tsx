"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import { ChefHat, Plus, Home, User, LogOut, Menu, X, Sparkles } from "lucide-react";
import { useState } from "react";

export default function Navbar() {
  const { token, signOut, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    signOut();
    router.push("/login");
    setIsMobileMenuOpen(false);
  };

  const isActive = (path: string) => {
    return pathname === path;
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  if (isLoading) {
    return null;
  }

  return (
    <nav className="bg-gradient-to-r from-orange-600 via-orange-500 to-yellow-500 shadow-lg border-b border-orange-300">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center space-x-2 text-white hover:text-orange-100 transition-colors duration-200"
          >
            <div className="bg-white p-2 rounded-full shadow-md">
              <ChefHat className="h-5 w-5 text-orange-500" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-white to-orange-100 bg-clip-text text-transparent">
              ResepKu
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {token ? (
              <>
                <Link
                  href="/"
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                    isActive("/")
                      ? "bg-white/20 text-white shadow-md"
                      : "text-orange-100 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <Home className="h-4 w-4" />
                  <span className="font-medium">Home</span>
                </Link>

                <Link
                  href="/dashboard"
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                    isActive("/dashboard")
                      ? "bg-white/20 text-white shadow-md"
                      : "text-orange-100 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <User className="h-4 w-4" />
                  <span className="font-medium">Dashboard</span>
                </Link>

                <Link
                  href="/add-recipe"
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                    isActive("/add-recipe")
                      ? "bg-white/20 text-white shadow-md"
                      : "text-orange-100 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <Plus className="h-4 w-4" />
                  <span className="font-medium">Tambah Resep</span>
                </Link>

                <Link
                  href="/ai-chef"
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                    isActive("/ai-chef")
                      ? "bg-white/20 text-white shadow-md"
                      : "text-orange-100 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <Sparkles className="h-4 w-4" />
                  <span className="font-medium">Magic Chef</span>
                </Link>

                <div className="h-6 w-px bg-orange-300 mx-2" />

                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg hover:scale-105"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                    isActive("/login")
                      ? "bg-white/20 text-white shadow-md"
                      : "text-orange-100 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <span className="font-medium">Login</span>
                </Link>

                <Link
                  href="/signup"
                  className={`flex items-center space-x-2 bg-white text-orange-600 hover:bg-orange-50 font-medium py-2 px-4 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg ${
                    isActive("/signup") ? "bg-orange-50" : ""
                  }`}
                >
                  <span>Daftar</span>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={toggleMobileMenu}
              className="text-white hover:text-orange-100 p-2 rounded-lg transition-colors duration-200"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-orange-600/95 backdrop-blur-sm rounded-lg mt-2 mb-4 shadow-lg border border-orange-400/30">
            <div className="py-4 space-y-2">
              {token ? (
                <>
                  <Link
                    href="/"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center space-x-3 px-4 py-3 mx-2 rounded-lg transition-all duration-200 ${
                      isActive("/")
                        ? "bg-white/20 text-white shadow-md"
                        : "text-orange-100 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    <Home className="h-5 w-5" />
                    <span className="font-medium">Home</span>
                  </Link>

                  <Link
                    href="/dashboard"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center space-x-3 px-4 py-3 mx-2 rounded-lg transition-all duration-200 ${
                      isActive("/dashboard")
                        ? "bg-white/20 text-white shadow-md"
                        : "text-orange-100 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    <User className="h-5 w-5" />
                    <span className="font-medium">Dashboard</span>
                  </Link>

                  <Link
                    href="/add-recipe"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center space-x-3 px-4 py-3 mx-2 rounded-lg transition-all duration-200 ${
                      isActive("/add-recipe")
                        ? "bg-white/20 text-white shadow-md"
                        : "text-orange-100 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    <Plus className="h-5 w-5" />
                    <span className="font-medium">Tambah Resep</span>
                  </Link>

                  <Link
                    href="/ai-chef"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center space-x-3 px-4 py-3 mx-2 rounded-lg transition-all duration-200 ${
                      isActive("/ai-chef")
                        ? "bg-white/20 text-white shadow-md"
                        : "text-orange-100 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    <Sparkles className="h-5 w-5" />
                    <span className="font-medium">Magic Chef</span>
                  </Link>

                  <div className="border-t border-orange-400/30 mx-2 my-3" />

                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-3 bg-red-500 hover:bg-red-600 text-white font-medium py-3 px-4 mx-2 rounded-lg transition-all duration-200 shadow-md w-[calc(100%-16px)]"
                  >
                    <LogOut className="h-5 w-5" />
                    <span>Logout</span>
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center space-x-3 px-4 py-3 mx-2 rounded-lg transition-all duration-200 ${
                      isActive("/login")
                        ? "bg-white/20 text-white shadow-md"
                        : "text-orange-100 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    <span className="font-medium">Login</span>
                  </Link>

                  <Link
                    href="/signup"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center space-x-3 bg-white text-orange-600 hover:bg-orange-50 font-medium py-3 px-4 mx-2 rounded-lg transition-all duration-200 shadow-md ${
                      isActive("/signup") ? "bg-orange-50" : ""
                    }`}
                  >
                    <span>Daftar</span>
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
