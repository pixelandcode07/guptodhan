'use client';
import React from 'react';

interface InputFieldProps {
  id: string;
  name: string;
  label?: string; // optional
  type?: string;
  placeholder?: string;
  defaultValue?: string | number;
  required?: boolean;
  textarea?: boolean;
  rows?: number;
}

const InputField: React.FC<InputFieldProps> = ({
  id,
  name,
  label,
  type = 'text',
  placeholder = '',
  defaultValue,
  required = false,
  textarea = false,
  rows = 3,
}) => {
  return (
    <div className="flex w-full flex-col sm:flex-row sm:items-center sm:gap-4 mb-4">
      {label && ( // Only render label if it exists
        <label htmlFor={id} className="w-full sm:w-1/4 font-medium">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      {textarea ? (
        <textarea
          id={id}
          name={name}
          rows={rows}
          placeholder={placeholder}
          defaultValue={defaultValue}
          className={`w-full border flex-1   border-gray-300 rounded px-3 py-2 ${
            !label ? 'sm:col-span-2' : ''
          }`}
          required={required}
        />
      ) : (
        <input
          type={type}
          id={id}
          name={name}
          placeholder={placeholder}
          defaultValue={defaultValue}
          className={`w-full flex-1  border border-gray-300 rounded px-3 py-2 ${
            !label ? 'sm:col-span-2' : ''
          }`}
          required={required}
        />
      )}
    </div>
  );
};

export default InputField;
