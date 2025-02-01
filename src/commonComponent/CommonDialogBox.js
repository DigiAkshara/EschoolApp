import React from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";

const DownloadDialog = ({ onClose, handleDownloadChoice }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-80 text-center">
        {/* Close Button */}
        <div className="flex justify-between items-center border-b pb-3">
          <h3 className="text-lg font-semibold text-gray-800">Download Options</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Buttons */}
        <div className="mt-4 space-y-3">
          <button
            onClick={() => handleDownloadChoice("pdf")}
            className="w-full px-4 py-2 text-white bg-blue-500 rounded-md shadow hover:bg-blue-600 transition"
          >
            Download as PDF
          </button>
          <button
            onClick={() => handleDownloadChoice("excel")}
            className="w-full px-4 py-2 text-white bg-green-500 rounded-md shadow hover:bg-green-600 transition"
          >
            Download as Excel
          </button>
        </div>

        {/* Cancel Button */}
        <button
          onClick={onClose}
          className="mt-4 w-full px-4 py-2 text-gray-600 bg-gray-200 rounded-md hover:bg-gray-300 transition"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default DownloadDialog;
