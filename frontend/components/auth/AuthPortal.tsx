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
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Radio,
  FileCheck2,
  Sliders,
  Layers,
  Info,
} from "lucide-react";
import { useAuth } from "@/lib/store/auth-context";
import { ROLES } from "@/lib/fixtures/roles";
import type { Role } from "@/lib/types";
import { ClusterStatusBadge } from "./ClusterStatusBadge";

interface AuthPortalProps {
  initialTab?: "signin" | "signup";
}

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

export function AuthPortal({ initialTab = "signin" }: AuthPortalProps) {
  const router = useRouter();
  const { login, register, quickLoginDemo, isLoading: authLoading } = useAuth();
  const [tab, setTab] = useState<"signin" | "signup">(initialTab);
  const [isPending, startTransition] = useTransition();

  // Sign In State
  const [signInIdentifier, setSignInIdentifier] = useState("");
  const [signInPassword, setSignInPassword] = useState("");
  const [showSignInPassword, setShowSignInPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Sign Up State
  const [signUpName, setSignUpName] = useState("");
  const [signUpEmail, setSignUpEmail] = useState("");
  const [signUpBadgeId, setSignUpBadgeId] = useState("");
  const [signUpAgency, setSignUpAgency] = useState(AGENCIES[0]);
  const [signUpRole, setSignUpRole] = useState<Role>("kseb_epm");
  const [signUpPhone, setSignUpPhone] = useState("");
  const [signUpPassword, setSignUpPassword] = useState("");
  const [signUpConfirmPassword, setSignUpConfirmPassword] = useState("");
  const [showSignUpPassword, setShowSignUpPassword] = useState(false);
  const [authorizedAgreed, setAuthorizedAgreed] = useState(false);

  // Status & Feedback
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!signInIdentifier.trim() || !signInPassword) {
      setErrorMsg("Please enter both an Officer Email / Badge ID and password.");
      return;
    }

    try {
      const user = await login(signInIdentifier, signInPassword);
      setSuccessMsg(`Welcome, Officer ${user.name}. Clearance verified.`);
      startTransition(() => {
        setTimeout(() => router.push("/"), 400);
      });
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to authenticate. Please check your credentials.");
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!signUpName.trim() || !signUpEmail.trim() || !signUpBadgeId.trim()) {
      setErrorMsg("Please fill in all required official identity fields.");
      return;
    }

    if (signUpPassword.length < 6) {
      setErrorMsg("Password must be at least 6 characters long.");
      return;
    }

    if (signUpPassword !== signUpConfirmPassword) {
      setErrorMsg("Passwords do not match. Please re-enter.");
      return;
    }

    if (!authorizedAgreed) {
      setErrorMsg("Please confirm your statutory emergency authority authorization.");
      return;
    }

    try {
      const user = await register({
        name: signUpName,
        email: signUpEmail,
        password: signUpPassword,
        role: signUpRole,
        badgeId: signUpBadgeId,
        agency: signUpAgency,
        phoneNumber: signUpPhone,
      });
      setSuccessMsg(`Account registered for Officer ${user.name} under ${user.agency}. Access granted.`);
      startTransition(() => {
        setTimeout(() => router.push("/"), 500);
      });
    } catch (err: any) {
      setErrorMsg(err.message || "Registration failed. Please check your inputs.");
    }
  };

  const handleQuickDemoLogin = async (role: Role) => {
    setErrorMsg(null);
    setSuccessMsg(null);
    try {
      await quickLoginDemo(role);
      const roleDef = ROLES.find((r) => r.id === role);
      setSuccessMsg(`Quick-authenticated as ${roleDef?.label ?? role}. Redirecting to Command Hub...`);
      startTransition(() => {
        setTimeout(() => router.push("/"), 350);
      });
    } catch (err: any) {
      setErrorMsg(err.message || "Quick sign in failed.");
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

  const strength = passwordStrength(signUpPassword);

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-6 py-4">
      {/* Cluster Status Telemetry Banner */}
      <ClusterStatusBadge />

      {/* Main Authentication Container */}
      <div className="glass-card relative overflow-hidden rounded-3xl border border-gray-200/60 bg-white/75 p-6 shadow-xl backdrop-blur-2xl sm:p-10">
        {/* Glow Accent Circles */}
        <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-blue-500/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-cyan-500/10 blur-3xl" />

        {/* Header Branding */}
        <div className="relative z-10 flex flex-col items-center text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-500 shadow-md shadow-blue-500/20">
            <ShieldCheck className="h-8 w-8 text-white" />
          </div>
          <h1 className="mt-4 text-2xl font-black tracking-tight text-gray-900 sm:text-3xl">
            TerraCascade EAP Command
          </h1>
          <p className="mt-1 max-w-md text-xs font-semibold text-gray-600 sm:text-sm">
            Emergency Action Plan command portal for the Idamalayar & Periyar River Basin.
          </p>

          {/* Statutory Advisory */}
          <div className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-blue-200/80 bg-blue-50/80 px-3 py-1 text-[11px] font-bold text-blue-800">
            <Info className="h-3.5 w-3.5 text-blue-600" />
            <span>Authorized Official Clearance • Secure MongoDB Cluster Backend</span>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="relative z-10 mt-8 flex justify-center">
          <div className="glass-pill inline-flex rounded-full p-1.5 shadow-inner">
            <button
              type="button"
              onClick={() => {
                setTab("signin");
                setErrorMsg(null);
                setSuccessMsg(null);
              }}
              className={`flex items-center gap-2 rounded-full px-6 py-2.5 text-xs sm:text-sm font-black transition-all ${
                tab === "signin"
                  ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <Lock className="h-4 w-4" />
              Officer Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setTab("signup");
                setErrorMsg(null);
                setSuccessMsg(null);
              }}
              className={`flex items-center gap-2 rounded-full px-6 py-2.5 text-xs sm:text-sm font-black transition-all ${
                tab === "signup"
                  ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <BadgeCheck className="h-4 w-4" />
              Register Official
            </button>
          </div>
        </div>

        {/* Alerts & Notifications */}
        {errorMsg && (
          <div className="relative z-10 mt-6 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50/90 p-4 text-xs font-semibold text-red-800 shadow-sm animate-in fade-in slide-in-from-top-2">
            <AlertCircle className="h-5 w-5 flex-shrink-0 text-red-600" />
            <div className="flex-1 leading-relaxed">{errorMsg}</div>
          </div>
        )}

        {successMsg && (
          <div className="relative z-10 mt-6 flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50/90 p-4 text-xs font-semibold text-emerald-800 shadow-sm animate-in fade-in slide-in-from-top-2">
            <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-emerald-600" />
            <div className="flex-1 leading-relaxed">{successMsg}</div>
          </div>
        )}

        {/* TAB 1: SIGN IN */}
        {tab === "signin" && (
          <div className="relative z-10 mt-8 space-y-8 animate-in fade-in duration-300">
            <form onSubmit={handleSignIn} className="space-y-5">
              <div>
                <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-gray-700">
                  Official Email or Officer Badge ID
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400">
                    <Mail className="h-4 w-4" />
                  </div>
                  <input
                    type="text"
                    value={signInIdentifier}
                    onChange={(e) => setSignInIdentifier(e.target.value)}
                    placeholder="e.g. epm.biju@kseb.in or KSEB-EPM-04"
                    className="glass-input pl-11 !py-3.5 !text-sm"
                    required
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700">
                    Password / Clearance Passcode
                  </label>
                  <span className="text-[11px] font-semibold text-blue-600 cursor-pointer hover:underline" onClick={() => setErrorMsg("Demo passcode for all pre-seeded officers is: Password123!")}>
                    Demo Passcode Hint?
                  </span>
                </div>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400">
                    <Lock className="h-4 w-4" />
                  </div>
                  <input
                    type={showSignInPassword ? "text" : "password"}
                    value={signInPassword}
                    onChange={(e) => setSignInPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="glass-input pl-11 pr-11 !py-3.5 !text-sm"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowSignInPassword(!showSignInPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400 hover:text-gray-600"
                  >
                    {showSignInPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-xs font-semibold text-gray-600 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  Remember officer credentials on this workstation
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
                    <span>Verifying Credentials & MongoDB Session...</span>
                  </div>
                ) : (
                  <>
                    <span>Authenticate & Enter Command Hub</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>

            {/* Quick Demo Officer 1-Click Sign In */}
            <div className="border-t border-gray-200/80 pt-6">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-bold uppercase tracking-wider text-gray-500 flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                  Fast-Login as Verified Emergency Officer
                </p>
                <span className="text-[11px] font-semibold text-gray-400">1-Click Demo Evaluation</span>
              </div>

              <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                {ROLES.map((r) => {
                  const Icon = ROLE_ICONS[r.id];
                  return (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => handleQuickDemoLogin(r.id)}
                      className="group flex items-start gap-3 rounded-2xl border border-gray-200/80 bg-white/60 p-3 text-left shadow-sm hover:border-blue-500 hover:bg-blue-50/50 hover:shadow-md transition-all active:scale-[0.98]"
                    >
                      <div className="mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-700 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="text-xs font-black text-gray-900 group-hover:text-blue-700 truncate">
                            {r.shortLabel}
                          </p>
                          <span className="text-[10px] font-bold text-gray-400">Sign In &rarr;</span>
                        </div>
                        <p className="text-[11px] font-semibold text-gray-500 line-clamp-1">
                          {r.id === "kseb_epm" && "Biju P.N • Dam Safety"}
                          {r.id === "district_eoc" && "Salim M. • Emergency Ops"}
                          {r.id === "district_collector" && "Dr. Renu Raj • District Magistrate"}
                          {r.id === "budget_planner" && "Priya V. • Finance Directorate"}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: REGISTER OFFICIAL */}
        {tab === "signup" && (
          <form onSubmit={handleSignUp} className="relative z-10 mt-8 space-y-6 animate-in fade-in duration-300">
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
                    value={signUpName}
                    onChange={(e) => setSignUpName(e.target.value)}
                    placeholder="e.g. Anand Menon"
                    className="glass-input pl-11 !py-3 !text-sm"
                    required
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
                    value={signUpEmail}
                    onChange={(e) => setSignUpEmail(e.target.value)}
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
                    value={signUpBadgeId}
                    onChange={(e) => setSignUpBadgeId(e.target.value)}
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
                    value={signUpAgency}
                    onChange={(e) => setSignUpAgency(e.target.value)}
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

            {/* Operational Role Selection Grid */}
            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-gray-700">
                Designated Emergency Command Role *
              </label>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {ROLES.map((r) => {
                  const Icon = ROLE_ICONS[r.id];
                  const isSelected = signUpRole === r.id;
                  return (
                    <div
                      key={r.id}
                      onClick={() => setSignUpRole(r.id)}
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

            {/* Password & Confirmation */}
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
                    type={showSignUpPassword ? "text" : "password"}
                    value={signUpPassword}
                    onChange={(e) => setSignUpPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="glass-input pl-11 pr-11 !py-3 !text-sm"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowSignUpPassword(!showSignUpPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400 hover:text-gray-600"
                  >
                    {showSignUpPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {/* Strength Meter */}
                {signUpPassword && (
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
                    type={showSignUpPassword ? "text" : "password"}
                    value={signUpConfirmPassword}
                    onChange={(e) => setSignUpConfirmPassword(e.target.value)}
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
        )}

        {/* Footer info */}
        <div className="relative z-10 mt-8 text-center text-[11px] font-semibold text-gray-500">
          <span>TerraCascade EAP Command • Idamalayar Dam & Periyar River System</span>
          <div className="mt-1 flex items-center justify-center gap-2 text-gray-400">
            <span>MongoDB Cluster Integration</span>
            <span>•</span>
            <Link href="/" className="text-blue-600 hover:underline">
              Return to Live Command Hub
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
