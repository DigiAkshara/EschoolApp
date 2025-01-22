import { useEffect } from "react";

export default function Toast({message, type = "success", ttl = 3000, onClose}) {
      // Auto-remove toast after TTL
      useEffect(() => {
        const timer = setTimeout(() => {
          onClose();
        }, ttl);
    
        return () => clearTimeout(timer); // Cleanup
      }, [ttl, onClose]);
    
      // Toast styles based on type
      const typeStyles = {
        success: {
          bg: "bg-green-500 text-white",
          icon: "✅", // Success icon
        },
        error: {
          bg: "bg-red-500 text-white",
          icon: "❌", // Error icon
        },
        info: {
          bg: "bg-blue-500 text-white",
          icon: "ℹ️", // Info icon
        },
        warning: {
          bg: "bg-yellow-500 text-white",
          icon: "⚠️", // Warning icon
        },
      };
      const { bg, icon } = typeStyles[type];
      return (
        <div
          className={`fixed top-4 right-4 flex items-center space-x-2 px-4 py-2 rounded shadow-md transition-opacity ${bg}`}
        >
        <span>{icon}</span>
        <span>{message}</span>
        </div>
  );
}