import { useAppSelector } from "../store";

export function useIsLoggedIn(): boolean {
  return useAppSelector(({ auth }) => !!auth.code);
}
