"use client";

import React, { useState } from "react";
import { IoEyeSharp } from "react-icons/io5";

interface InputProps {
  label: string;
  type: string;
  placeholder: string;
  id: string;
  name: string;
  isRequired?: boolean;
  value?: string;
  onChange?: (value: string) => void;
}

export default function Input({
  label,
  type,
  placeholder,
  id,
  name,
  isRequired,
  value = "",
  onChange,
}: InputProps) {
  const [inputType, setInputType] = useState(type);
  const [inputValue, setInputValue] = useState(value);

  const toggleInputType = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setInputType((prevType) => (prevType === "password" ? "text" : "password"));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    if (onChange) {
      onChange(newValue);
    }
  };

  return (
    <div>
      {label && (
        <label
          htmlFor={id}
          className="block text-sm text-black font-poppins font-normal"
        >
          {label} {isRequired && <span className="text-primary">*</span>}
        </label>
      )}
      <div className="relative mt-1 w-full rounded-md border border-black border-opacity-20 focus-within:border-primary transition-all duration-300 ease-in-out">
        <div className="flex justify-between items-center px-4 py-2 h-10 rounded-md bg-darkGray gap-4">
          <input
            type={inputType}
            placeholder={placeholder}
            id={id}
            name={name}
            className="flex-1 bg-transparent outline-none text-sm text-black font-poppins font-normal"
            value={inputValue}
            onChange={handleChange}
          />
          {type === "password" && (
            <button
              type="button"
              onClick={toggleInputType}
              className="focus:outline-none"
            >
             <IoEyeSharp />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
