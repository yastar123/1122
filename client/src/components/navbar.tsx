import { Link, useLocation } from "wouter";
import { MapPin, Package, Home } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Navbar() {
  const [location] = useLocation();

  const navItems = [
    {
      href: "/",
      label: "Beranda",
      icon: Home,
    },
    {
      href: "/alamat-toko",
      label: "Alamat Toko",
      icon: MapPin,
    },
    {
      href: "/katalog-produk",
      label: "Katalog Produk",
      icon: Package,
    },
  ];

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-pink-500 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center">
          <div className="flex space-x-1 bg-white/10 backdrop-blur-sm rounded-full px-2 py-1 mt-2 mb-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location === item.href;
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "inline-flex items-center px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 transform hover:scale-105",
                    isActive
                      ? "bg-white text-blue-600 shadow-md"
                      : "text-white hover:bg-white/20"
                  )}
                  data-testid={`nav-link-${item.href.replace('/', '') || 'home'}`}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}