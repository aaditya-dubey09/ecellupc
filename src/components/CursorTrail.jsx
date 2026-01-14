import { useEffect, useState, useRef } from 'react';

const CursorTrail = () => {
  const [trails, setTrails] = useState([]);
  const requestRef = useRef();
  
  // Brand colors for the glitter (Gold, Purple, Blue, White)
  const colors = [
    "#FBBF24", // Gold
    "#8B5CF6", // Purple
    "#3B82F6", // Blue
    "#FFFFFF"  // White Sparkle
  ];

  useEffect(() => {
    let frame = 0;
    
    const handleMouseMove = (e) => {
      // Limit sparkles to every 5th frame to prevent lag
      frame++;
      if (frame % 5 !== 0) return;

      const newSparkle = {
        id: Date.now(),
        x: e.clientX,
        y: e.clientY,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 4 + 2, // Random size between 2px and 6px
      };

      setTrails((prev) => [...prev, newSparkle]);

      // Remove the sparkle after 700ms (fades out)
      setTimeout(() => {
        setTrails((prev) => prev.filter((t) => t.id !== newSparkle.id));
      }, 700);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-[9999] overflow-hidden">
      {trails.map((sparkle) => (
        <span
          key={sparkle.id}
          className="absolute rounded-full animate-ping-slow"
          style={{
            left: sparkle.x,
            top: sparkle.y,
            width: `${sparkle.size}px`,
            height: `${sparkle.size}px`,
            backgroundColor: sparkle.color,
            boxShadow: `0 0 10px ${sparkle.color}`, // Glow effect
            opacity: 0.8,
            transform: 'translate(-50%, -50%)', // Center on mouse
            transition: 'opacity 0.7s ease-out, transform 0.7s ease-out',
          }}
        />
      ))}
    </div>
  );
};

export default CursorTrail;