import { useNavigationContext } from '../contexts/NavigationContext';

/**
 * Re-exports the context hook to maintain compatibility with existing consumers
 * (like useGameViewModel) without requiring refactoring of imports.
 */
export const useAppNavigation = () => {
  return useNavigationContext();
};
