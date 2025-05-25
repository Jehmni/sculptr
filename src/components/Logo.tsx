import Image from 'next/image';
import Link from 'next/link';

interface LogoProps {
  size?: number;
  showText?: boolean;
  className?: string;
}

export default function Logo({ size = 40, showText = true, className = '' }: LogoProps) {
  return (
    <Link href="/" className={`flex items-center gap-3 logo-animation ${className}`}>
      <div className="relative rounded-md overflow-hidden shadow-md transition-transform hover:scale-105">
        <Image
          src="/logo.png"
          alt="Sculptr Logo"
          width={size}
          height={size}
          className="object-contain"
          priority
        />
      </div>
      {showText && (
        <span className="font-bold text-2xl text-gray-800 transition-colors hover:text-blue-600">Sculptr</span>
      )}
    </Link>
  );
}
