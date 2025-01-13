import React from "react";

interface InputProps {
  label?: string;
  click?: (e: React.MouseEvent) => void;
  children?: React.ReactNode;
  disabled?: boolean;
  className?: string;
}

export default function Button({
  label,
  click,
  children,
  disabled,
  className,
}: InputProps) {
  return (
    <button
      type="submit"
      className={`py-2 px-4 whitespace-nowrap bg-primary-600 text-white rounded-md bg-black hover:opacity-80 ${disabled ? "cursor-not-allowed opacity-80 hover:opacity-80" : ""}${className}`}
      onClick={click}
      disabled={disabled}
    >
      {label}
      {children}
    </button>
  );
}
