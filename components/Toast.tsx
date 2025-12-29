import React from 'react';

interface ToastProps {
  message: string;
  isVisible: boolean;
}

const Toast: React.FC<ToastProps> = ({ message, isVisible }) => {
  return (
    <div 
      className={`
        fixed bottom-20 left-1/2 transform -translate-x-1/2 
        bg-gray-800 text-white text-xs py-1.5 px-4 rounded-full shadow-lg
        transition-all duration-300 pointer-events-none z-50
        flex items-center gap-2
        ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}
      `}
    >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3 text-green-400">
        <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
      </svg>
      {message}
    </div>
  );
};

export default Toast;