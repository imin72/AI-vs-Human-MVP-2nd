
import { useRef, useCallback, TouchEvent } from 'react';

interface SwipeConfig {
  onSwipeRight?: () => void;
  onSwipeLeft?: () => void;
  threshold?: number;
  edgeOnly?: boolean;
}

export const useSwipeGesture = ({ 
  onSwipeRight, 
  onSwipeLeft, 
  threshold = 60, // Minimum distance
  edgeOnly = true 
}: SwipeConfig) => {
  const touchStartRef = useRef<{ x: number, y: number, time: number } | null>(null);

  // Check if running in standalone mode (PWA installed)
  // iOS Safari "standalone" property or standard display-mode check
  const isStandalone = typeof window !== 'undefined' && (
    window.matchMedia('(display-mode: standalone)').matches || 
    (window.navigator as any).standalone === true
  );

  const onTouchStart = useCallback((e: TouchEvent) => {
    // Only track single touch to avoid conflict with pinch-to-zoom
    if (e.targetTouches.length !== 1) return;
    
    const clientX = e.targetTouches[0].clientX;

    // EDGE GUARD: If the touch starts extremely close to the left edge (< 30px),
    // it is highly likely a native iOS swipe-back gesture.
    // We strictly ignore these to avoid "double navigation" or visual glitches where
    // both the browser and our app try to handle the back action.
    if (clientX < 30) return;

    touchStartRef.current = {
      x: clientX,
      y: e.targetTouches[0].clientY,
      time: Date.now()
    };
  }, []);

  const onTouchEnd = useCallback((e: TouchEvent) => {
    if (!touchStartRef.current) return;

    // Use changedTouches for the ended touch
    const touchEnd = {
      x: e.changedTouches[0].clientX,
      y: e.changedTouches[0].clientY,
      time: Date.now()
    };

    const deltaX = touchEnd.x - touchStartRef.current.x;
    const deltaY = touchEnd.y - touchStartRef.current.y;
    const duration = touchEnd.time - touchStartRef.current.time;

    // Logic:
    // 1. Must be fast enough (< 500ms) to distinguish from scroll
    // 2. Must be horizontal dominant (Abs(X) > Abs(Y) * 1.5)
    // 3. Must exceed threshold
    
    const isFast = duration < 500;
    const isHorizontal = Math.abs(deltaX) > Math.abs(deltaY) * 1.5;
    const isSignificant = Math.abs(deltaX) > threshold;

    if (isFast && isHorizontal && isSignificant) {
      // Swipe Right (Back Action)
      if (deltaX > 0 && onSwipeRight) {
        // CONFLICT FIX:
        // Only enable custom swipe-back in standalone mode where native nav is absent.
        // In browser mode, rely on native browser controls.
        if (isStandalone) {
           // Double check edge (though onTouchStart filters strict edge, we check loose edge here)
           const isEdge = touchStartRef.current.x < 50;
           if (!edgeOnly || isEdge) {
               onSwipeRight();
           }
        }
      } 
      // Swipe Left (Forward/Next Action - Optional)
      else if (deltaX < 0 && onSwipeLeft) {
        onSwipeLeft();
      }
    }

    touchStartRef.current = null;
  }, [onSwipeRight, onSwipeLeft, threshold, edgeOnly, isStandalone]);

  return { onTouchStart, onTouchEnd };
};