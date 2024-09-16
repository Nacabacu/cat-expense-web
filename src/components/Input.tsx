import { forwardRef, InputHTMLAttributes } from 'react';
import { FieldError } from 'react-hook-form';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: FieldError;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ error, className, ...props }: InputProps, ref) => {
    return (
      <div className="relative">
        <input
          ref={ref}
          type="number"
          className={`border-gray-300 h-10 border rounded-sm ${className}`}
          {...props}
        ></input>
        {error && (
          <p className="text-error absolute text-sm">{error.message}</p>
        )}
      </div>
    );
  }
);

export default Input;
