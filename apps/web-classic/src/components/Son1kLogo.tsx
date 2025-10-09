import React from 'react';
import { motion } from 'framer-motion';

interface Son1kLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  color?: 'white' | 'cyan' | 'purple';
  animated?: boolean;
  className?: string;
}

export const Son1kLogo: React.FC<Son1kLogoProps> = ({
  size = 'md',
  color = 'cyan',
  animated = false,
  className = ''
}) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-10 h-10',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24'
  };

  const colorClasses = {
    white: 'filter brightness-0 invert',
    cyan: 'filter brightness-0 saturate-100 invert sepia-100 saturate-200 hue-rotate-180 brightness-100 contrast-100',
    purple: 'filter brightness-0 saturate-100 invert sepia-100 saturate-200 hue-rotate-270 brightness-100 contrast-100'
  };

  const LogoComponent = () => (
    <div className={`${sizeClasses[size]} ${className}`}>
      <img
        src="/logo-son1kvers3.svg"
        alt="Son1kVers3 Logo"
        className="w-full h-full object-contain"
      />
    </div>
  );

  if (animated) {
    return (
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{
          type: "spring",
          stiffness: 200,
          damping: 15
        }}
        whileHover={{ scale: 1.1, rotate: 5 }}
        className="cursor-pointer"
      >
        <LogoComponent />
      </motion.div>
    );
  }

  return <LogoComponent />;
};

export default Son1kLogo;
