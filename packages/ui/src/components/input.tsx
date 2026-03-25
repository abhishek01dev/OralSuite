import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helpText?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  helpText,
  className = '',
  id,
  ...props
}) => (
  <div className="space-y-1">
    {label && (
      <label htmlFor={id} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
    )}
    <input
      id={id}
      className={`block w-full rounded-lg border px-3 py-2 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
        error
          ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
          : 'border-gray-300 focus:border-blue-500'
      } ${className}`}
      {...props}
    />
    {error && <p className="text-sm text-red-600">{error}</p>}
    {helpText && !error && <p className="text-sm text-gray-500">{helpText}</p>}
  </div>
);
