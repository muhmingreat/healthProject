import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white px-6 py-10 w-full">
      <div className="max-w-7xl mx-auto">
        {/* Flex Layout */}
        <div className="flex flex-col md:flex-row md:justify-between gap-10">
          
          {/* Company Info */}
          <div className="flex-1">
            <h2 className="text-2xl font-bold mb-4 text-blue-400">
              Healthcare System
            </h2>
            <p className="text-gray-400 leading-relaxed">
              Secure • Transparent • Decentralized Healthcare.
            </p>
          </div>

          {/* Quick Links */}
          <div className="flex-1">
            <h3 className="text-lg font-semibold mb-4 text-white">Quick Links</h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <a href="about" className="hover:text-blue-400 transition">About Us</a>
              </li>


          
              <Link to="customer">
                <li className="hover:text-blue-400 transition">Contact Us</li>
              </Link>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-700 mt-10 pt-6 text-center text-gray-500 text-sm">
          &copy; {new Date().getFullYear()} Healthcare System. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;



