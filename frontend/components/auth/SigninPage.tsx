"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Shield,
  ShieldCheck,
  Lock,
  Mail,
  User,
  Building2,
  BadgeCheck,
  Eye,
  EyeOff,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Radio,
  FileCheck2,
  Sliders,
  LogIn,
  Info,
} from "lucide-react";
import { useAuth } from "@/lib/store/auth-context";
import { ROLES } from "@/lib/fixtures/roles";
import type { Role } from "@/lib/types";
import { ClusterStatusBadge } from "./ClusterStatusBadge";

const ROLE_ICONS: Record<Role, typeof Shield> = {
  kseb_epm: Shield,
  district_eoc: Radio,
  district_collector: FileCheck2,
  budget_planner: Sliders,
};

const AGENCIES = [
  "Kerala State Electricity Board (Dam Safety)",
  "District Disaster Management Authority (DDMA)",
  "District Administration & Revenue Department",
  "Disaster Mitigation & Finance Directorate",
  "National Disaster Response Force (NDRF)",
  "Irrigation & Water Resources Department",
];

export function SigninPage() {
  const router = useRouter();
  const { register, skipLogin, isLoading: authLoading } = useAuth();
  const [isPending, startTransition] = useTransition();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [badgeId, setBadgeId] = useState("");
  const [agency, setAgency] = useState(AGENCIES[0]);
  const [role, setRole] = useState<Role>("kseb_epm");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [authorizedAgreed, setAuthorizedAgreed] = useState(false);

  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleSkipLogin = async () => {
    try {
      await skipLogin();
      startTransition(() => {
        router.push("/");
      });
    } catch {
      startTransition(() => {
        router.push("/");
      });
    }
  };


  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!name.trim() || !email.trim() || !badgeId.trim()) {
      setErrorMsg("Please fill in all required official identity fields.");
      return;
    }

    if (password.length < 6) {
      setErrorMsg("Password must be at least 6 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg("Passwords do not match. Please re-enter.");
      return;
    }

    if (!authorizedAgreed) {
      setErrorMsg("Please confirm your statutory emergency authority declaration.");
      return;
    }

    try {
      const user = await register({
        name,
        email,
        password,
        role,
        badgeId,
        agency,
        phoneNumber: phone,
      });
      setSuccessMsg(`Official registration complete for ${user.name}. Clearance granted.`);
      startTransition(() => {
        setTimeout(() => router.push("/"), 500);
      });
    } catch (err: any) {
      setErrorMsg(err.message || "Registration failed. Please check your inputs.");
    }
  };

  const passwordStrength = (pass: string) => {
    if (!pass) return 0;
    let score = 0;
    if (pass.length >= 6) score += 25;
    if (pass.length >= 10) score += 25;
    if (/[A-Z]/.test(pass) && /[a-z]/.test(pass)) score += 25;
    if (/[0-9!@#$%^&*]/.test(pass)) score += 25;
    return score;
  };

  const strength = passwordStrength(password);

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-[var(--background)] px-4 py-8 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="pointer-events-none absolute -left-40 top-1/4 h-96 w-96 rounded-full bg-cyan-500/10 blur-[120px]" />
      <div className="pointer-events-none absolute -right-40 bottom-1/4 h-96 w-96 rounded-full bg-blue-500/10 blur-[120px]" />

      <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 relative z-10">
        {/* Cluster Status Telemetry Banner */}
        <ClusterStatusBadge />

        {/* Registration Card */}
        <div className="glass-card relative overflow-hidden rounded-3xl border border-gray-200/60 bg-white/80 p-6 shadow-2xl backdrop-blur-2xl sm:p-10">
          {/* Header Branding */}
          <div className="flex flex-col items-center text-center">
            <button
              type="button"
              onClick={handleSkipLogin}
              title="Click logo to skip and open dashboard"
              className="group relative flex h-16 w-16 items-center justify-center rounded-2xl bg-white p-2.5 shadow-md shadow-blue-500/15 ring-1 ring-gray-200/80 transition-all hover:scale-110 hover:shadow-xl hover:shadow-blue-500/25 active:scale-95 cursor-pointer mb-2"
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
            <h1 className="mt-2 text-2xl font-black tracking-tight text-gray-900 sm:text-3xl">
              Register Official Credentials
            </h1>
            <p className="mt-1 max-w-md text-xs font-semibold text-gray-600 sm:text-sm">
              Create an authorized official profile for TerraCascade EAP Command
            </p>
          </div>


          {/* Feedback Alerts */}
          {errorMsg && (
            <div className="mt-6 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50/95 p-4 text-xs font-semibold text-red-800 shadow-sm animate-in fade-in">
              <AlertCircle className="h-5 w-5 flex-shrink-0 text-red-600" />
              <div className="flex-1 leading-relaxed">{errorMsg}</div>
            </div>
          )}

          {successMsg && (
            <div className="mt-6 flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50/95 p-4 text-xs font-semibold text-emerald-800 shadow-sm animate-in fade-in">
              <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-emerald-600" />
              <div className="flex-1 leading-relaxed">{successMsg}</div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSignUp} className="mt-6 space-y-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-gray-700">
                  Full Official Name *
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400">
                    <User className="h-4 w-4" />
                  </div>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Anand Menon"
                    className="glass-input pl-11 !py-3 !text-sm"
                    required
                    autoFocus
                  />
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-gray-700">
                  Official Email Address *
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400">
                    <Mail className="h-4 w-4" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="anand.menon@kerala.gov.in"
                    className="glass-input pl-11 !py-3 !text-sm"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-gray-700">
                  Officer / Badge ID *
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400">
                    <BadgeCheck className="h-4 w-4" />
                  </div>
                  <input
                    type="text"
                    value={badgeId}
                    onChange={(e) => setBadgeId(e.target.value)}
                    placeholder="e.g. KSEB-EPM-09 or DDMA-ENG-05"
                    className="glass-input pl-11 !py-3 !text-sm font-mono"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-gray-700">
                  Department / Agency
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400">
                    <Building2 className="h-4 w-4" />
                  </div>
                  <select
                    value={agency}
                    onChange={(e) => setAgency(e.target.value)}
                    className="glass-select pl-11 !py-3 !text-sm"
                  >
                    {AGENCIES.map((a) => (
                      <option key={a} value={a}>
                        {a}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Role Selection Grid */}
            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-gray-700">
                Designated Emergency Command Role *
              </label>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {ROLES.map((r) => {
                  const Icon = ROLE_ICONS[r.id];
                  const isSelected = role === r.id;
                  return (
                    <div
                      key={r.id}
                      onClick={() => setRole(r.id)}
                      className={`cursor-pointer rounded-2xl border p-4 transition-all ${
                        isSelected
                          ? "border-blue-600 bg-blue-50/80 shadow-md ring-2 ring-blue-500/20"
                          : "border-gray-200/80 bg-white/60 hover:bg-gray-50"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5 font-bold text-gray-900">
                          <div
                            className={`flex h-7 w-7 items-center justify-center rounded-lg ${
                              isSelected ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600"
                            }`}
                          >
                            <Icon className="h-4 w-4" />
                          </div>
                          <span className="text-xs sm:text-sm font-extrabold">{r.shortLabel}</span>
                        </div>
                        {isSelected && <CheckCircle2 className="h-4 w-4 text-blue-600" />}
                      </div>
                      <p className="mt-2 text-[11px] font-semibold text-gray-500 leading-relaxed">
                        {r.focus}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Passwords */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-gray-700">
                  Password (min. 6 chars) *
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400">
                    <Lock className="h-4 w-4" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="glass-input pl-11 pr-11 !py-3 !text-sm"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {/* Strength Meter */}
                {password && (
                  <div className="mt-2 flex items-center gap-2">
                    <div className="h-1.5 flex-1 rounded-full bg-gray-200 overflow-hidden">
                      <div
                        className={`h-full transition-all duration-300 ${
                          strength <= 25
                            ? "w-1/4 bg-red-500"
                            : strength <= 50
                            ? "w-2/4 bg-amber-500"
                            : strength <= 75
                            ? "w-3/4 bg-blue-500"
                            : "w-full bg-emerald-500"
                        }`}
                      />
                    </div>
                    <span className="text-[10px] font-bold text-gray-500">
                      {strength <= 25 ? "Weak" : strength <= 50 ? "Fair" : strength <= 75 ? "Good" : "Strong"}
                    </span>
                  </div>
                )}
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-gray-700">
                  Confirm Password *
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400">
                    <Lock className="h-4 w-4" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="glass-input pl-11 !py-3 !text-sm"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Official Certification Declaration */}
            <div className="rounded-2xl border border-blue-200/60 bg-blue-50/50 p-4">
              <label className="flex items-start gap-3 text-xs font-semibold text-gray-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={authorizedAgreed}
                  onChange={(e) => setAuthorizedAgreed(e.target.checked)}
                  className="mt-0.5 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span>
                  I certify that I am a designated emergency official under the Kerala State Disaster Management Authority or KSEB Dam Safety Wing, and I agree to all actions being logged into the immutable audit timeline.
                </span>
              </label>
            </div>

            <button
              type="submit"
              disabled={authLoading || isPending}
              className="w-full flex items-center justify-center gap-2 rounded-2xl bg-blue-600 px-6 py-4 text-sm font-black text-white shadow-lg shadow-blue-600/30 hover:bg-blue-700 active:scale-[0.99] transition-all disabled:opacity-50"
            >
              {authLoading || isPending ? (
                <div className="flex items-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  <span>Registering Credentials into MongoDB Cluster...</span>
                </div>
              ) : (
                <>
                  <span>Create Official Profile & Connect</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          {/* Navigation to Log In page */}
          <div className="mt-6 flex items-center justify-center rounded-2xl border border-gray-200/80 bg-gray-50/80 p-3.5 text-center text-xs font-semibold text-gray-700">
            <span>Already have an authorized official profile?</span>
            <Link
              href="/login"
              className="ml-2 flex items-center gap-1 font-bold text-blue-600 hover:text-blue-800 hover:underline"
            >
              <LogIn className="h-3.5 w-3.5" />
              <span>Log In Here &rarr;</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
