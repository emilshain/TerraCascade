"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Lock,
  Mail,
  User,
  Shield,
  BadgeCheck,
  Eye,
  EyeOff,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Zap,
} from "lucide-react";
import { useAuth } from "@/lib/store/auth-context";
import { ROLES } from "@/lib/fixtures/roles";
import type { Role } from "@/lib/types";

const ROLE_AGENCIES: Record<Role, string> = {
  kseb_epm: "Kerala State Electricity Board (Dam Safety)",
  district_eoc: "District Disaster Management Authority (DDMA)",
  district_collector: "District Administration & Revenue Department",
  budget_planner: "Disaster Mitigation & Finance Directorate",
};

export function SigninPage() {
  const router = useRouter();
  const { register, skipLogin, isLoading: authLoading, clusterStatus } = useAuth();
  const [isPending, startTransition] = useTransition();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [badgeId, setBadgeId] = useState("");
  const [role, setRole] = useState<Role>("kseb_epm");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agreedToAudit, setAgreedToAudit] = useState(true);

  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleSkip = async () => {
    setErrorMsg(null);
    setSuccessMsg("Demo bypass activated. Loading Command Dashboard...");
    try {
      await skipLogin();
      startTransition(() => {
        setTimeout(() => router.push("/"), 250);
      });
    } catch {
      startTransition(() => {
        router.push("/");
      });
    }
  };

  const handleFillDemo = (selectedRole: Role = "kseb_epm") => {
    const roleDef = ROLES.find((r) => r.id === selectedRole);
    setRole(selectedRole);
    if (selectedRole === "kseb_epm") {
      setName("Er. Biju Varghese");
      setEmail("epm.biju@kseb.in");
      setBadgeId("KSEB-EPM-04");
    } else if (selectedRole === "district_eoc") {
      setName("Radhika Nair");
      setEmail("eoc.ernakulam@kerala.gov.in");
      setBadgeId("DDMA-EOC-12");
    } else if (selectedRole === "district_collector") {
      setName("Dr. N. S. K. Umesh IAS");
      setEmail("collector.ekm@kerala.gov.in");
      setBadgeId("IAS-KL-2015-09");
    } else {
      setName("Suresh Kumar");
      setEmail("mitigation.finance@kerala.gov.in");
      setBadgeId("DMA-FIN-02");
    }
    setPassword("Password123!");
    setConfirmPassword("Password123!");
    setErrorMsg(null);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!name.trim() || !email.trim() || !badgeId.trim()) {
      setErrorMsg("Please fill in your name, email, and officer badge ID.");
      return;
    }

    if (password.length < 6) {
      setErrorMsg("Password must be at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg("Passwords do not match.");
      return;
    }

    if (!agreedToAudit) {
      setErrorMsg("Please accept the statutory emergency audit logging declaration.");
      return;
    }

    try {
      const user = await register({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password,
        role,
        badgeId: badgeId.trim().toUpperCase(),
        agency: ROLE_AGENCIES[role] || "Kerala State Emergency Services",
      });
      setSuccessMsg(`Official registration complete for ${user.name}. Clearance granted.`);
      startTransition(() => {
        setTimeout(() => router.push("/"), 350);
      });
    } catch (err: any) {
      setErrorMsg(err.message || "Registration failed. Please check your details.");
    }
  };

  const isConnected = clusterStatus?.connected ?? false;

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-[var(--background)] px-4 py-8 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="pointer-events-none absolute -left-32 top-1/4 h-80 w-80 rounded-full bg-blue-500/10 blur-[100px]" />
      <div className="pointer-events-none absolute -right-32 bottom-1/4 h-80 w-80 rounded-full bg-cyan-500/10 blur-[100px]" />

      <div className="mx-auto flex w-full max-w-md flex-col gap-4 relative z-10">
        {/* Minimal Cluster Status Pill */}
        <div className="flex items-center justify-between px-2 text-xs font-semibold text-gray-500">
          <div className="flex items-center gap-2">
            <span
              className={`h-2 w-2 rounded-full ${
                isConnected ? "bg-emerald-500 animate-pulse" : "bg-amber-500"
              }`}
            />
            <span className="text-[11px] font-bold text-gray-700">
              MongoDB: {clusterStatus ? (isConnected ? "Atlas Connected" : "Connecting...") : "Cluster"}
            </span>
          </div>
          {isConnected && clusterStatus?.latencyMs !== undefined && clusterStatus.latencyMs > 0 && (
            <span className="text-[10px] font-mono text-emerald-600 font-bold">
              {clusterStatus.latencyMs}ms
            </span>
          )}
        </div>

        {/* Minimal Signup Card */}
        <div className="glass-card relative overflow-hidden rounded-3xl border border-gray-200/70 bg-white/80 p-8 shadow-2xl backdrop-blur-2xl sm:p-10">
          {/* Logo (Click to Skip to Dashboard) */}
          <div className="flex flex-col items-center text-center">
            <button
              type="button"
              onClick={handleSkip}
              title="Click logo to skip signup and open dashboard"
              className="group relative flex h-16 w-16 items-center justify-center rounded-2xl bg-white p-2.5 shadow-md shadow-blue-500/15 ring-1 ring-gray-200/80 transition-all hover:scale-110 hover:shadow-xl hover:shadow-blue-500/25 active:scale-95 cursor-pointer"
            >
              <img
                src="/logo.svg"
                alt="TerraCascade Logo"
                className="h-full w-full object-contain transition-transform group-hover:rotate-6"
              />
              <span className="absolute -bottom-7 whitespace-nowrap rounded-full bg-blue-600 px-2 py-0.5 text-[9px] font-black uppercase tracking-wider text-white opacity-0 shadow-sm transition-opacity group-hover:opacity-100">
                Click to Skip
              </span>
            </button>

            <h1 className="mt-4 text-2xl font-black tracking-tight text-gray-900">
              Create Profile
            </h1>
            <p className="text-xs font-semibold text-gray-500 mt-0.5">
              Register Authorized Official Credentials
            </p>
          </div>

          {/* Feedback Alerts */}
          {errorMsg && (
            <div className="mt-5 flex items-start gap-2.5 rounded-2xl border border-red-200 bg-red-50/95 p-3.5 text-xs font-semibold text-red-800 shadow-sm animate-in fade-in">
              <AlertCircle className="h-4 w-4 flex-shrink-0 text-red-600 mt-0.5" />
              <div className="flex-1 leading-relaxed">{errorMsg}</div>
            </div>
          )}

          {successMsg && (
            <div className="mt-5 flex items-start gap-2.5 rounded-2xl border border-emerald-200 bg-emerald-50/95 p-3.5 text-xs font-semibold text-emerald-800 shadow-sm animate-in fade-in">
              <CheckCircle2 className="h-4 w-4 flex-shrink-0 text-emerald-600 mt-0.5" />
              <div className="flex-1 leading-relaxed">{successMsg}</div>
            </div>
          )}

          {/* Minimal Form */}
          <form onSubmit={handleSignUp} className="mt-6 space-y-3.5">
            {/* Full Name */}
            <div>
              <label className="mb-1 block text-xs font-bold text-gray-700">
                Full Official Name
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400">
                  <User className="h-4 w-4" />
                </div>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Er. Anand Menon"
                  className="glass-input pl-10 !py-2.5 !text-sm"
                  required
                />
              </div>
            </div>

            {/* Official Email */}
            <div>
              <label className="mb-1 block text-xs font-bold text-gray-700">
                Official Email
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400">
                  <Mail className="h-4 w-4" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="anand.menon@kerala.gov.in"
                  className="glass-input pl-10 !py-2.5 !text-sm"
                  required
                />
              </div>
            </div>

            {/* Officer Badge ID & Role Grid */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs font-bold text-gray-700">
                  Badge ID
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400">
                    <BadgeCheck className="h-4 w-4" />
                  </div>
                  <input
                    type="text"
                    value={badgeId}
                    onChange={(e) => setBadgeId(e.target.value)}
                    placeholder="KSEB-EPM-04"
                    className="glass-input pl-10 !py-2.5 !text-sm font-mono uppercase"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-xs font-bold text-gray-700">
                  Command Role
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400">
                    <Shield className="h-4 w-4" />
                  </div>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as Role)}
                    className="glass-select pl-10 !py-2.5 !text-xs font-bold text-gray-800"
                  >
                    {ROLES.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.shortLabel}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Password & Confirm Password */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-gray-700">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setPassword("Password123!");
                      setConfirmPassword("Password123!");
                    }}
                    className="text-[10px] font-bold text-blue-600 hover:underline"
                  >
                    Demo
                  </button>
                </div>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400">
                    <Lock className="h-4 w-4" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="glass-input pl-10 pr-9 !py-2.5 !text-sm"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="mb-1 block text-xs font-bold text-gray-700">
                  Confirm
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400">
                    <Lock className="h-4 w-4" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="glass-input pl-10 !py-2.5 !text-sm"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Audit compliance checkbox */}
            <div className="pt-1">
              <label className="flex items-center gap-2 text-xs font-medium text-gray-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreedToAudit}
                  onChange={(e) => setAgreedToAudit(e.target.checked)}
                  className="h-3.5 w-3.5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span>Authorized responder statutory audit logging</span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={authLoading || isPending}
              className="w-full flex items-center justify-center gap-2 rounded-2xl bg-blue-600 px-5 py-3.5 text-sm font-black text-white shadow-lg shadow-blue-600/25 hover:bg-blue-700 active:scale-[0.99] transition-all disabled:opacity-50 mt-2 cursor-pointer"
            >
              {authLoading || isPending ? (
                <div className="flex items-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  <span>Registering...</span>
                </div>
              ) : (
                <>
                  <span>Create Official Account</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Pre-fill Pills */}
          <div className="mt-5 border-t border-gray-100 pt-3.5">
            <p className="text-[11px] font-bold text-gray-500 mb-2 flex items-center justify-between">
              <span>Auto-Fill Demo Role:</span>
              <button
                type="button"
                onClick={handleSkip}
                className="text-[10px] font-black text-blue-600 hover:underline flex items-center gap-1"
              >
                <Zap className="h-3 w-3 text-amber-500" />
                <span>Skip to Dashboard &rarr;</span>
              </button>
            </p>
            <div className="flex flex-wrap gap-1.5">
              {ROLES.map((r) => (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => handleFillDemo(r.id)}
                  className="rounded-xl border border-gray-200/80 bg-white/70 px-2.5 py-1 text-[11px] font-bold text-gray-700 hover:border-blue-500 hover:bg-blue-50 hover:text-blue-700 transition-all cursor-pointer"
                >
                  {r.shortLabel}
                </button>
              ))}
            </div>
          </div>

          {/* Sign In Navigation */}
          <div className="mt-5 text-center text-xs font-semibold text-gray-500">
            <span>Already registered?</span>{" "}
            <Link href="/login" className="font-bold text-blue-600 hover:underline">
              Official Sign In &rarr;
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
