import { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
}

function Button({ label, className, onClick }: ButtonProps) {
  return (
    <button
      className={`bg-accent text-secondary p-2 rounded-md ${className} hover:bg-opacity-90`}
      onClick={onClick}
    >
      {label}
    </button>
  );
}

export default Button;
