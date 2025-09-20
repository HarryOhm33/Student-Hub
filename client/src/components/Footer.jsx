// src/components/Footer.jsx
import { FiFacebook, FiTwitter, FiLinkedin, FiMail, FiPhone, FiMapPin } from "react-icons/fi";

const Footer = () => {
  return (
    <footer className="bg-[#10B981] text-black py-12">
      <div className="max-w-6xl mx-auto px-6 grid gap-10 md:grid-cols-4">
        
        {/* Brand Section */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-white">Pratibha kosh</h2>
          <p className="text-sm leading-relaxed">
            One Platform for All Student Achievements – empowering students, faculty, 
            and institutions with analytics, reports, and AI career guidance.
          </p>
        </div>

        {/* Quick Links */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li><a href="/" className="hover:text-white transition">Home</a></li>
            <li><a href="/auth/signup" className="hover:text-white transition">Get Started</a></li>
            <li><a href="/student-search" className="hover:text-white transition">Student Search</a></li>
            <li><a href="/contact" className="hover:text-white transition">Contact</a></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white">Contact</h3>
          <ul className="space-y-3 text-sm">
            <li className="flex items-center gap-2">
              <FiMail className="text-white" /> support@achivo.com
            </li>
            <li className="flex items-center gap-2">
              <FiPhone className="text-white" /> +91 98765 43210
            </li>
            <li className="flex items-center gap-2">
              <FiMapPin className="text-white" /> New Delhi, India
            </li>
          </ul>
        </div>

        {/* Social Media */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white">Follow Us</h3>
          <div className="flex gap-4">
            <a href="#" className="p-2 bg-gray-800 rounded-full hover:bg-white transition">
              <FiFacebook className="w-5 h-5 text-white" />
            </a>
            <a href="#" className="p-2 bg-gray-800 rounded-full hover:bg-white transition">
              <FiTwitter className="w-5 h-5 text-white" />
            </a>
            <a href="#" className="p-2 bg-gray-800 rounded-full hover:bg-white transition">
              <FiLinkedin className="w-5 h-5 text-white" />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="mt-10 border-t border-gray-600 pt-6 text-center text-sm text-white">
        © {new Date().getFullYear()} Achivo. All Rights Reserved.
      </div>
    </footer>
  );
};

export default Footer;
