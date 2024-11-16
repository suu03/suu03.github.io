import React from "react";

interface DonateModalProps {
  onClose: () => void;
}

const DonateModal: React.FC<DonateModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-600 hover:text-gray-800 focus:outline-none"
        >
          &times;
        </button>

        {/* Modal Content */}
        <h2 className="text-2xl font-semibold mb-4">Donate</h2>
        <p className="mb-6">
          Your support helps me continue creating and improving projects like
          this one. Thank you for your generosity!
        </p>

        {/* Donate Button */}
        <button
          onClick={() => window.open("https://example.com/donate", "_blank")}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors duration-300 focus:outline-none"
        >
          Donate Now
        </button>
      </div>
    </div>
  );
};

export default DonateModal;
