"use client";

import { Suspense, useState, useId } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { Lock, Mail, Eye, EyeOff, AlertCircle, ShieldCheck, Loader2 } from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/admin";

  const emailId = useId();
  const passwordId = useId();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const cleanEmail = email.trim();
    if (!cleanEmail || !password) {
      setError("Please enter both email and password.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await signIn("credentials", {
        email: cleanEmail,
        password,
        redirect: false,
      });

      if (res?.error || !res?.ok) {
        setError("Invalid email or password. Please try again.");
        setIsLoading(false);
        return;
      }

      // Successful login -> redirect to destination
      router.push(callbackUrl);
      router.refresh();
    } catch (err) {
      console.error("Login submission error:", err);
      setError("An unexpected error occurred. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      <div className="rounded-xl border border-navy-700/60 bg-navy-900/90 p-8 shadow-lg backdrop-blur-md">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-3.5 flex h-12 w-12 items-center justify-center rounded-full border border-gold-400/30 bg-gold-500/10 text-gold-400">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <h1 className="font-heading text-h3 font-semibold text-white tracking-wide">
            Admin Portal
          </h1>
          <p className="mt-1.5 text-small text-navy-200">
            Vrikszon Occultaura Management
          </p>
        </div>

        {/* Inline Error Notice */}
        {error && (
          <div
            role="alert"
            className="mb-6 flex items-start gap-3 rounded-base border border-rose-500/30 bg-rose-950/40 p-3.5 text-small text-rose-300 animate-in fade-in duration-200"
          >
            <AlertCircle className="h-5 w-5 shrink-0 text-rose-400 mt-0.5" />
            <span className="leading-relaxed">{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
          {/* Email Field */}
          <div>
            <label
              htmlFor={emailId}
              className="block text-small font-medium text-navy-100 mb-2"
            >
              Email Address
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-navy-300">
                <Mail className="h-4 w-4" />
              </div>
              <input
                id={emailId}
                type="email"
                name="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (error) setError(null);
                }}
                disabled={isLoading}
                placeholder="admin@vrikszon.com"
                className="h-12 w-full rounded-base border border-navy-700 bg-navy-950/80 pl-10 pr-4 text-body text-white placeholder:text-navy-400/60 focus:border-gold-400 focus:outline-none focus:ring-2 focus:ring-gold-400/20 transition-colors disabled:opacity-50"
              />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <label
              htmlFor={passwordId}
              className="block text-small font-medium text-navy-100 mb-2"
            >
              Password
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-navy-300">
                <Lock className="h-4 w-4" />
              </div>
              <input
                id={passwordId}
                type={showPassword ? "text" : "password"}
                name="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error) setError(null);
                }}
                disabled={isLoading}
                placeholder="••••••••••••"
                className="h-12 w-full rounded-base border border-navy-700 bg-navy-950/80 pl-10 pr-11 text-body text-white placeholder:text-navy-400/60 focus:border-gold-400 focus:outline-none focus:ring-2 focus:ring-gold-400/20 transition-colors disabled:opacity-50"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-navy-300 hover:text-navy-100 focus:outline-none transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="mt-6 flex h-12 w-full items-center justify-center gap-2 rounded-base bg-gold-500 font-medium text-navy-950 hover:bg-gold-400 focus:outline-none focus:ring-2 focus:ring-gold-400/40 active:bg-gold-600 disabled:opacity-60 transition-colors duration-fast cursor-pointer disabled:cursor-not-allowed shadow-sm"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Signing in...</span>
              </>
            ) : (
              <span>Sign In</span>
            )}
          </button>
        </form>
      </div>

      {/* Subtle security notice */}
      <p className="mt-6 text-center text-caption text-navy-400">
        Authorized personnel only. All access attempts are logged.
      </p>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-navy-950 px-4 py-12">
      <Suspense
        fallback={
          <div className="flex h-64 items-center justify-center text-gold-400">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        }
      >
        <LoginForm />
      </Suspense>
    </main>
  );
}
