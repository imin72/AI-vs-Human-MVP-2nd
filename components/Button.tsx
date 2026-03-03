import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  fullWidth = false,
  className = '',
  ...props 
}) => {
  const baseStyle = "px-6 py-3 rounded-xl font-bold transition-all duration-300 transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2";
  
  const variants = {
    primary: "bg-cyan-600 hover:bg-cyan-500 text-white shadow-lg shadow-cyan-500/30 border border-cyan-400/20",
    secondary: "bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-500/30 border border-rose-400/20",
    outline: "bg-transparent border-2 border-slate-700 hover:border-slate-500 text-slate-300 hover:text-white"
  };

  return (
    <button 
      className={`${baseStyle} ${variants[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};