import { useEffect, useState } from 'react';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';

const AnimatedCounter = ({ value, duration = 2, delay = 0 }) => {
  const count = useMotionValue(0);
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const numericValue = typeof value === 'string' ? parseFloat(value.replace(/[^0-9.]/g, '')) : value;
    
    // Only animate if we have a valid number
    if (!isNaN(numericValue) && numericValue > 0) {
      setTimeout(() => {
        const controls = animate(count, numericValue, {
          duration,
          ease: "easeOut",
          onUpdate: (latest) => {
            setDisplayValue(Math.round(latest));
          }
        });
        return controls.stop;
      }, delay * 1000);
    } else {
      setDisplayValue(numericValue || 0);
    }
  }, [value, duration, delay]);

  // Re-append the non-numeric parts (like '%', 'h', etc)
  const prefix = typeof value === 'string' ? value.replace(/[0-9.]/g, '') : '';
  const isPercent = typeof value === 'string' && value.includes('%');
  const isHours = typeof value === 'string' && value.includes('h');

  return (
    <span>
      {displayValue}
      {isPercent ? '%' : isHours ? 'h' : ''}
    </span>
  );
};

export default AnimatedCounter;
