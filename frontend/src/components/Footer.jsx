import React from 'react';
import { Link } from 'react-router-dom';
import Logo from './Logo';
import { ShieldCheck, Heart, Mail, HelpCircle, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-purple-100 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="md:col-span-1 space-y-4">
            <Logo size="md" to="/" />
            <p className="text-xs text-purple-600 font-bold uppercase tracking-wider">
              Search. Find. Reunite.
            </p>
            <p className="text-sm text-gray-500 leading-relaxed">
              FindIt is your trusted campus and community lost & found platform. Helping reunite people with their belongings securely.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-bold text-gray-900 mb-3.5 tracking-wide uppercase">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="text-gray-500 hover:text-[#6D28D9] transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/search" className="text-gray-500 hover:text-[#6D28D9] transition-colors">
                  Browse All Items
                </Link>
              </li>
              <li>
                <Link to="/report-lost" className="text-gray-500 hover:text-[#6D28D9] transition-colors">
                  Report a Lost Item
                </Link>
              </li>
              <li>
                <Link to="/report-found" className="text-gray-500 hover:text-[#6D28D9] transition-colors">
                  Report a Found Item
                </Link>
              </li>
            </ul>
          </div>

          {/* Popular Categories */}
          <div>
            <h4 className="text-sm font-bold text-gray-900 mb-3.5 tracking-wide uppercase">Categories</h4>
            <ul className="space-y-2 text-sm text-gray-500">
              <li>
                <Link to="/search?category=Electronics" className="hover:text-[#6D28D9] transition-colors">
                  Electronics & Phones
                </Link>
              </li>
              <li>
                <Link to="/search?category=Bags" className="hover:text-[#6D28D9] transition-colors">
                  Backpacks & Bags
                </Link>
              </li>
              <li>
                <Link to="/search?category=ID+Cards" className="hover:text-[#6D28D9] transition-colors">
                  ID Cards & Keys
                </Link>
              </li>
              <li>
                <Link to="/search?category=Documents" className="hover:text-[#6D28D9] transition-colors">
                  Books & Documents
                </Link>
              </li>
            </ul>
          </div>

          {/* Safe & Secure */}
          <div>
            <h4 className="text-sm font-bold text-gray-900 mb-3.5 tracking-wide uppercase">Safety & Security</h4>
            <div className="bg-purple-50/70 rounded-xl p-4 border border-purple-100 space-y-2.5">
              <div className="flex items-center gap-2 text-xs font-bold text-[#6D28D9]">
                <ShieldCheck className="w-4 h-4" />
                <span>Verified Community</span>
              </div>
              <p className="text-xs text-gray-600 leading-normal">
                Always meet in well-lit public campus locations or reception desks when claiming items.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 gap-4">
          <p>© {new Date().getFullYear()} FindIt. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Built with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline" /> for campus communities.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
