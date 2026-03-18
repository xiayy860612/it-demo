import { useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';

interface CelebrationAnimationProps {
  trigger: boolean;
  duration?: number;
}

export function CelebrationAnimation({ trigger, duration = 2000 }: CelebrationAnimationProps) {
  const lastTrigger = useRef(false);

  useEffect(() => {
    // Check if this is a new trigger (false → true transition)
    if (trigger && !lastTrigger.current) {
      // Respect prefers-reduced-motion
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      if (!prefersReducedMotion) {
        // Fire confetti animation
        const end = Date.now() + duration;

        const frame = () => {
          void confetti({
            particleCount: 3,
            angle: 60,
            spread: 55,
            origin: { x: 0, y: 0.6 },
          });
          void confetti({
            particleCount: 3,
            angle: 120,
            spread: 55,
            origin: { x: 1, y: 0.6 },
          });

          if (Date.now() < end) {
            requestAnimationFrame(frame);
          }
        };

        frame();
      }
    }

    // Update last trigger
    lastTrigger.current = trigger;
  }, [trigger, duration]);

  // This component doesn't render anything visible
  return null;
}
