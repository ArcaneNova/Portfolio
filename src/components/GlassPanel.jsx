import React from 'react';

const GlassPanel = ({
  children,
  className = '',
  opacity = 'medium',
  borderStyle = 'subtle',
  padding = 'medium',
  rounded = 'medium',
  blur = 'medium',
  highlight = true,
}) => {
  // Opacity variations
  const opacityClasses = {
    light: 'bg-white/10 dark:bg-slate-900/10',
    medium: 'bg-white/20 dark:bg-slate-900/20',
    heavy: 'bg-white/30 dark:bg-slate-900/30',
  };

  // Border styles
  const borderClasses = {
    none: '',
    subtle: 'border border-white/10 dark:border-slate-700/30',
    pronounced: 'border border-white/20 dark:border-slate-700/50',
    glowing: 'border border-white/30 dark:border-slate-700/70',
  };

  // Padding options
  const paddingClasses = {
    none: 'p-0',
    small: 'p-2',
    medium: 'p-4',
    large: 'p-6',
  };

  // Rounded corner options
  const roundedClasses = {
    none: 'rounded-none',
    small: 'rounded',
    medium: 'rounded-lg',
    large: 'rounded-xl',
    full: 'rounded-full',
  };

  // Blur intensity
  const blurClasses = {
    light: 'backdrop-blur-sm',
    medium: 'backdrop-blur-md',
    heavy: 'backdrop-blur-lg',
  };

  return (
    <div
      className={`
        relative isolate
        ${opacityClasses[opacity] || opacityClasses.medium}
        ${borderClasses[borderStyle] || borderClasses.subtle}
        ${paddingClasses[padding] || paddingClasses.medium}
        ${roundedClasses[rounded] || roundedClasses.medium}
        ${blurClasses[blur] || blurClasses.medium}
        ${className}
      `}
    >
      {/* Top highlight effect */}
      {highlight && (
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/30 dark:via-slate-500/30 to-transparent"></div>
      )}

      {/* Content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
};

export default GlassPanel; 