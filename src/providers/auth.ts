import type { AuthProvider } from "@refinedev/core";
import { User, SignUpPayload } from "@/types";
import { authClient } from "@/lib/auth-client";

export const authProvider: AuthProvider = {
  register: async (params) => {
    if ("providerName" in params && params.providerName) {
      try {
        await authClient.signIn.social({
          provider: params.providerName,
          callbackURL: `${window.location.origin}/`,
        });
        return { success: true };
      } catch (error) {
        console.error("Social register error:", error);
        return {
          success: false,
          error: {
            name: "Registration failed",
            message: "Unable to sign up with provider. Please try again.",
          },
        };
      }
    }

    const { email, password, name, image, imageCldPubId } =
      params as SignUpPayload;

    try {
      const { data, error } = await authClient.signUp.email({
        name,
        email,
        password,
        image,
        imageCldPubId,
      } as SignUpPayload);

      if (error) {
        return {
          success: false,
          error: {
            name: "Registration failed",
            message:
              error?.message || "Unable to create account. Please try again.",
          },
        };
      }

      localStorage.setItem("user", JSON.stringify(data.user));

      return { success: true, redirectTo: "/" };
    } catch (error) {
      console.error("Register error:", error);
      return {
        success: false,
        error: {
          name: "Registration failed",
          message: "Unable to create account. Please try again.",
        },
      };
    }
  },
  login: async (params) => {
    if ("providerName" in params && params.providerName) {
      try {
        await authClient.signIn.social({
          provider: params.providerName,
          callbackURL: `${window.location.origin}/`,
        });
        return { success: true };
      } catch (error) {
        console.error("Social login error:", error);
        return {
          success: false,
          error: {
            name: "Login failed",
            message: "Unable to sign in with provider. Please try again.",
          },
        };
      }
    }

    const { email, password } = params as { email: string; password: string };

    try {
      const { data, error } = await authClient.signIn.email({
        email,
        password,
      });

      if (error) {
        console.error("Login error from auth client:", error);
        return {
          success: false,
          error: {
            name: "Login failed",
            message: error?.message || "Please try again later.",
          },
        };
      }

      localStorage.setItem("user", JSON.stringify(data.user));

      return { success: true, redirectTo: "/" };
    } catch (error) {
      console.error("Login exception:", error);
      return {
        success: false,
        error: {
          name: "Login failed",
          message: "Please try again later.",
        },
      };
    }
  },
  logout: async () => {
    const { error } = await authClient.signOut();

    if (error) {
      console.error("Logout error:", error);
      return {
        success: false,
        error: {
          name: "Logout failed",
          message: "Unable to log out. Please try again.",
        },
      };
    }

    localStorage.removeItem("user");

    return { success: true, redirectTo: "/login" };
  },
  onError: async (error) => {
    if (error.response?.status === 401) {
      return { logout: true };
    }
    return { error };
  },
  check: async () => {
    const cachedUser = localStorage.getItem("user");

    if (cachedUser) {
      return { authenticated: true };
    }

    try {
      const { data } = await authClient.getSession();

      if (data?.user) {
        localStorage.setItem("user", JSON.stringify(data.user));
        return { authenticated: true };
      }
    } catch (error) {
      console.error("Session check error:", error);
    }

    return {
      authenticated: false,
      logout: true,
      redirectTo: "/login",
      error: {
        name: "Unauthorized",
        message: "Check failed",
      },
    };
  },
  getPermissions: async () => {
    let user = localStorage.getItem("user");

    if (!user) {
      const { data } = await authClient.getSession();
      if (data?.user) {
        localStorage.setItem("user", JSON.stringify(data.user));
        user = JSON.stringify(data.user);
      }
    }

    if (!user) return null;
    const parsedUser: User = JSON.parse(user);

    return { role: parsedUser.role };
  },
  getIdentity: async () => {
    let user = localStorage.getItem("user");

    if (!user) {
      const { data } = await authClient.getSession();
      if (data?.user) {
        localStorage.setItem("user", JSON.stringify(data.user));
        user = JSON.stringify(data.user);
      }
    }

    if (!user) return null;
    const parsedUser: User = JSON.parse(user);

    return {
      id: parsedUser.id,
      name: parsedUser.name,
      email: parsedUser.email,
      image: parsedUser.image,
      role: parsedUser.role,
      imageCldPubId: parsedUser.imageCldPubId,
    };
  },
};