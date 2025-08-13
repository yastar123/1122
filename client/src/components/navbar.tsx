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
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center">
          <div className="flex space-x-1 py-3">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location === item.href;
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary text-white"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
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