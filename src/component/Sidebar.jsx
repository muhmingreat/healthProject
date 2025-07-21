import { Link } from 'react-router-dom';
import { X } from 'lucide-react';

const SidebarMobile = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50">
      <div className="bg-white w-64 h-full p-6 shadow-lg relative">
        {/* Close Button */}
        <button
          className="absolute top-4 right-4 text-black"
          onClick={onClose}
        >
          <X size={24} />
        </button>

        {/* Navigation List */}
        <nav className="mt-10 space-y-4">
          <ul className="flex flex-col space-y-4 text-lg text-black">
            <li>
              <Link to="/" onClick={onClose} className="hover:text-green-700">Home</Link>
            </li>
            <li>
              <Link to="/patient" onClick={onClose} className="hover:text-green-700">Register</Link>
            </li>
            <li>
              <Link to="/doctor" onClick={onClose} className="hover:text-green-700">Register as Doctor</Link>
            </li>
            <li>
              <appkit-button />
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default SidebarMobile;
