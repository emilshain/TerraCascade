"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { Role } from "@/lib/types";
import { apiClient, type SafeUser, type ClusterStatus } from "@/lib/api-client";
import { useDemoStore } from "@/lib/store/demo-store";

interface AuthContextValue {
  user: SafeUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  clusterStatus: ClusterStatus | null;
  refreshClusterStatus: () => Promise<void>;
  login: (identifier: string, password: string) => Promise<SafeUser>;
  register: (payload: {
    name: string;
    email: string;
    password: string;
    role: Role;
    badgeId: string;
    agency?: string;
    phoneNumber?: string;
  }) => Promise<SafeUser>;
  quickLoginDemo: (role: Role) => Promise<void>;
  skipLogin: () => Promise<void>;
  logout: () => void;
}


const AuthContext = createContext<AuthContextValue | null>(null);

const AUTH_STORAGE_KEY = "terracascade_auth_session_v1";

export function AuthProvider({ children }: { children: ReactNode }) {
  const { setRole } = useDemoStore();
  const [user, setUser] = useState<SafeUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [clusterStatus, setClusterStatus] = useState<ClusterStatus | null>(null);

  const refreshClusterStatus = useCallback(async () => {
    try {
      const status = await apiClient.getClusterStatus();
      setClusterStatus(status);
    } catch {
      // Cluster status failure handled gracefully
    }
  }, []);

  // Initialize session from localStorage
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const stored = localStorage.getItem(AUTH_STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored) as { user: SafeUser; token: string };
          if (parsed.token && parsed.user) {
            setUser(parsed.user);
            setToken(parsed.token);
            setRole(parsed.user.role);
          }
        }
      } catch (err) {
        console.warn("[Auth] Failed to restore session:", err);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
    refreshClusterStatus();

    // Poll cluster telemetry every 30s
    const timer = setInterval(refreshClusterStatus, 30000);
    return () => clearInterval(timer);
  }, [refreshClusterStatus, setRole]);

  const saveSession = useCallback(
    (userData: SafeUser, tokenString: string) => {
      setUser(userData);
      setToken(tokenString);
      setRole(userData.role);
      try {
        localStorage.setItem(
          AUTH_STORAGE_KEY,
          JSON.stringify({ user: userData, token: tokenString })
        );
      } catch (err) {
        console.warn("[Auth] Could not write to localStorage:", err);
      }
    },
    [setRole]
  );

  const login = useCallback(
    async (identifier: string, password: string): Promise<SafeUser> => {
      setIsLoading(true);
      try {
        const res = await apiClient.login(identifier, password);
        saveSession(res.user, res.token);
        await refreshClusterStatus();
        return res.user;
      } finally {
        setIsLoading(false);
      }
    },
    [refreshClusterStatus, saveSession]
  );

  const register = useCallback(
    async (payload: {
      name: string;
      email: string;
      password: string;
      role: Role;
      badgeId: string;
      agency?: string;
      phoneNumber?: string;
    }): Promise<SafeUser> => {
      setIsLoading(true);
      try {
        const res = await apiClient.register(payload);
        saveSession(res.user, res.token);
        await refreshClusterStatus();
        return res.user;
      } finally {
        setIsLoading(false);
      }
    },
    [refreshClusterStatus, saveSession]
  );

  const quickLoginDemo = useCallback(
    async (role: Role) => {
      const demoAccounts: Record<
        Role,
        { identifier: string; pass: string; fallback: SafeUser }
      > = {
        kseb_epm: {
          identifier: "epm.biju@kseb.in",
          pass: "Password123!",
          fallback: {
            id: "demo-epm",
            name: "Biju P.N",
            email: "epm.biju@kseb.in",
            role: "kseb_epm",
            badgeId: "KSEB-EPM-04",
            agency: "Kerala State Electricity Board (Dam Safety)",
            isVerified: true,
          },
        },
        district_eoc: {
          identifier: "eoc.salim@kerala.gov.in",
          pass: "Password123!",
          fallback: {
            id: "demo-eoc",
            name: "Salim M.",
            email: "eoc.salim@kerala.gov.in",
            role: "district_eoc",
            badgeId: "DDMA-EOC-02",
            agency: "District Emergency Operations Centre",
            isVerified: true,
          },
        },
        district_collector: {
          identifier: "collector.ernakulam@kerala.gov.in",
          pass: "Password123!",
          fallback: {
            id: "demo-collector",
            name: "Dr. Renu Raj, IAS",
            email: "collector.ernakulam@kerala.gov.in",
            role: "district_collector",
            badgeId: "IAS-KL-COL-01",
            agency: "District Administration & DDMA Chairperson",
            isVerified: true,
          },
        },
        budget_planner: {
          identifier: "planner.priya@kerala.gov.in",
          pass: "Password123!",
          fallback: {
            id: "demo-planner",
            name: "Priya V.",
            email: "planner.priya@kerala.gov.in",
            role: "budget_planner",
            badgeId: "KDMA-FIN-08",
            agency: "Disaster Mitigation & Finance Directorate",
            isVerified: true,
          },
        },
      };

      const target = demoAccounts[role];
      if (!target) return;

      try {
        await login(target.identifier, target.pass);
      } catch {
        // Instant offline fallback for demo continuity
        saveSession(target.fallback, "demo-officer-local-token-2026");
      }
    },
    [login, saveSession]
  );

  const skipLogin = useCallback(async () => {
    await quickLoginDemo("kseb_epm");
  }, [quickLoginDemo]);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    try {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    } catch {
      // ignore
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: Boolean(user && token),
        isLoading,
        clusterStatus,
        refreshClusterStatus,
        login,
        register,
        quickLoginDemo,
        skipLogin,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );

}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}
