interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  isLoading?: boolean;
}

export default function Button({
  children,
  variant = 'primary',
  isLoading = false,
  disabled,
  className = '',
  ...props
}: ButtonProps) {
  const baseStyles = 'py-2.5 px-4 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 shadow-md';
  
  const variantStyles = {
    primary: 'bg-[--primary] hover:bg-[--primary-dark] text-white focus:ring-[--primary]',
    secondary: 'bg-white text-[--primary-dark] border border-[--border] hover:bg-[--background] focus:ring-[--primary]',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
  };
  
  // Apply gradient to primary button
  const isPrimary = variant === 'primary' && !isLoading && !disabled;
  const gradientStyle = isPrimary ? 'bg-gradient-to-r from-[--accent] to-[--primary]' : '';
  
  const loadingOrDisabledStyles = 'opacity-70 cursor-not-allowed';

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${gradientStyle} ${
        (isLoading || disabled) ? loadingOrDisabledStyles : ''
      } ${className}`}
      disabled={isLoading || disabled}
      {...props}
    >
      {isLoading ? (
        <div className="flex items-center justify-center">
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Loading...
        </div>
      ) : (
        children
      )}
    </button>
  );
}
