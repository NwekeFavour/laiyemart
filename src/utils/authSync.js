import { useAuthStore } from "../store/useAuthStore";

export const encodeAuthForSync = (authData = useAuthStore.getState()) => {
  const { token, user, store } = authData;

  if (!token || !user) return null;

  const persistedAuth = {
    state: {
      token,
      user,
      store,
      isAuthenticated: true,
    },
    version: 0,
  };

  return encodeURIComponent(JSON.stringify(persistedAuth));
};
