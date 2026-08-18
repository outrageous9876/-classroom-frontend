import type { AuthProvider } from "@refinedev/core";

const AUTH_KEY = "classroom-auth-email";

export const authProvider: AuthProvider = {
  login: async ({ email }) => {
    if (email) {
      localStorage.setItem(AUTH_KEY, email);
      return { success: true, redirectTo: "/" };
    }

    return {
      success: false,
      error: {
        name: "Login failed",
        message: "Invalid email or password",
      },
    };
  },
  register: async ({ email }) => {
    if (email) {
      localStorage.setItem(AUTH_KEY, email);
      return { success: true, redirectTo: "/" };
    }

    return {
      success: false,
      error: {
        name: "Register failed",
        message: "Invalid email or password",
      },
    };
  },
  logout: async () => {
    localStorage.removeItem(AUTH_KEY);
    return { success: true, redirectTo: "/login" };
  },
  onError: async (error) => {
    return { error };
  },
  check: async () => {
    const email = localStorage.getItem(AUTH_KEY);

    if (email) {
      return { authenticated: true };
    }

    return {
      authenticated: false,
      redirectTo: "/login",
    };
  },
  getPermissions: async () => null,
  getIdentity: async () => {
    const email = localStorage.getItem(AUTH_KEY);

    if (!email) {
      return null;
    }

    return { id: email, name: email, email };
  },
};
