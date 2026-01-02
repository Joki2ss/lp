import { useAppStore } from '../store/useAppStore';

export function useHydratedStore() {
  const { state } = useAppStore();
  return state.hydrated;
}
