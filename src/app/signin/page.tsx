// app/signin/page.tsx
"use client";

import { useState, useEffect } from "react";
import { signIn, signUp } from "@/lib/auth-actions";

interface FieldErrors {
  email?: string;
  password?: string;
  confirmPassword?: string;
  name?: string;
}

interface PasswordRequirements {
  minLength: boolean;
  hasUpperCase: boolean;
  hasLowerCase: boolean;
  hasNumber: boolean;
  hasSpecialChar: boolean;
}

export default function SignInPage() {
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [isDuplicateEmail, setIsDuplicateEmail] = useState(false);
  
  // Sign In form states
  const [signInEmail, setSignInEmail] = useState("");
  const [signInPassword, setSignInPassword] = useState("");
  const [signInErrors, setSignInErrors] = useState<FieldErrors>({});
  const [signInTouched, setSignInTouched] = useState({ email: false, password: false });

  // Sign Up form states
  const [signUpName, setSignUpName] = useState("");
  const [signUpEmail, setSignUpEmail] = useState("");
  const [signUpPassword, setSignUpPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [signUpErrors, setSignUpErrors] = useState<FieldErrors>({});
  const [signUpTouched, setSignUpTouched] = useState({ 
    name: false, 
    email: false, 
    password: false,
    confirmPassword: false 
  });
  const [showPasswordRequirements, setShowPasswordRequirements] = useState(false);
  const [passwordRequirements, setPasswordRequirements] = useState<PasswordRequirements>({
    minLength: false,
    hasUpperCase: false,
    hasLowerCase: false,
    hasNumber: false,
    hasSpecialChar: false,
  });

  // Real-time validation functions
  const validateEmail = (email: string): string | undefined => {
    if (!email) return "Email is required";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return "Please enter a valid email address";
    if (email.length > 255) return "Email is too long";
    return undefined;
  };

  const validateSignInPassword = (password: string): string | undefined => {
    if (!password) return "Password is required";
    if (password.length < 6) return "Password must be at least 6 characters";
    return undefined;
  };

  const validateName = (name: string): string | undefined => {
    if (!name) return "Name is required";
    if (name.trim().length < 2) return "Name must be at least 2 characters";
    if (name.length > 100) return "Name is too long";
    if (!/^[a-zA-Z\s'-]+$/.test(name)) return "Name can only contain letters, spaces, hyphens and apostrophes";
    return undefined;
  };

  const checkPasswordRequirements = (password: string): PasswordRequirements => {
    return {
      minLength: password.length >= 8,
      hasUpperCase: /[A-Z]/.test(password),
      hasLowerCase: /[a-z]/.test(password),
      hasNumber: /[0-9]/.test(password),
      hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    };
  };

  const validateSignUpPassword = (password: string): string | undefined => {
    if (!password) return "Password is required";
    const requirements = checkPasswordRequirements(password);
    if (!requirements.minLength) return "Password must be at least 8 characters";
    if (!requirements.hasUpperCase) return "Password must contain an uppercase letter";
    if (!requirements.hasLowerCase) return "Password must contain a lowercase letter";
    if (!requirements.hasNumber) return "Password must contain a number";
    if (!requirements.hasSpecialChar) return "Password must contain a special character";
    if (password.length > 128) return "Password is too long";
    return undefined;
  };

  const validateConfirmPassword = (password: string, confirm: string): string | undefined => {
    if (!confirm) return "Please confirm your password";
    if (password !== confirm) return "Passwords do not match";
    return undefined;
  };

  // Real-time validation for Sign In
  useEffect(() => {
    if (signInTouched.email) {
      const emailError = validateEmail(signInEmail);
      setSignInErrors(prev => ({ ...prev, email: emailError }));
    }
  }, [signInEmail, signInTouched.email]);

  useEffect(() => {
    if (signInTouched.password) {
      const passwordError = validateSignInPassword(signInPassword);
      setSignInErrors(prev => ({ ...prev, password: passwordError }));
    }
  }, [signInPassword, signInTouched.password]);

  // Real-time validation for Sign Up
  useEffect(() => {
    if (signUpTouched.name) {
      const nameError = validateName(signUpName);
      setSignUpErrors(prev => ({ ...prev, name: nameError }));
    }
  }, [signUpName, signUpTouched.name]);

  useEffect(() => {
    if (signUpTouched.email) {
      const emailError = validateEmail(signUpEmail);
      setSignUpErrors(prev => ({ ...prev, email: emailError }));
    }
  }, [signUpEmail, signUpTouched.email]);

  useEffect(() => {
    // Update password requirements in real-time
    const requirements = checkPasswordRequirements(signUpPassword);
    setPasswordRequirements(requirements);

    if (signUpTouched.password) {
      const passwordError = validateSignUpPassword(signUpPassword);
      setSignUpErrors(prev => ({ ...prev, password: passwordError }));
    }
  }, [signUpPassword, signUpTouched.password]);

  useEffect(() => {
    if (signUpTouched.confirmPassword) {
      const confirmError = validateConfirmPassword(signUpPassword, confirmPassword);
      setSignUpErrors(prev => ({ ...prev, confirmPassword: confirmError }));
    }
  }, [confirmPassword, signUpPassword, signUpTouched.confirmPassword]);

  async function handleSignIn(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setIsDuplicateEmail(false);
    
    // Mark all fields as touched
    setSignInTouched({ email: true, password: true });

    // Final validation
    const emailError = validateEmail(signInEmail);
    const passwordError = validateSignInPassword(signInPassword);

    if (emailError || passwordError) {
      setSignInErrors({ email: emailError, password: passwordError });
      return;
    }

    setLoading(true);
    
    const formData = new FormData();
    formData.append("email", signInEmail);
    formData.append("password", signInPassword);
    
    try {
      const result = await signIn(formData);
      if (result?.error) {
        setError(result.error);
        setLoading(false);
      }
    } catch (err: any) {
      if (err?.digest?.startsWith('NEXT_REDIRECT')) {
        return;
      }
      setError("An error occurred. Please try again.");
      setLoading(false);
    }
  }

  async function handleSignUp(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setIsDuplicateEmail(false);
    
    // Mark all fields as touched
    setSignUpTouched({ name: true, email: true, password: true, confirmPassword: true });

    // Final validation
    const nameError = validateName(signUpName);
    const emailError = validateEmail(signUpEmail);
    const passwordError = validateSignUpPassword(signUpPassword);
    const confirmError = validateConfirmPassword(signUpPassword, confirmPassword);

    if (nameError || emailError || passwordError || confirmError) {
      setSignUpErrors({ 
        name: nameError, 
        email: emailError, 
        password: passwordError,
        confirmPassword: confirmError 
      });
      return;
    }

    setLoading(true);
    
    const formData = new FormData();
    formData.append("name", signUpName);
    formData.append("email", signUpEmail);
    formData.append("password", signUpPassword);
    
    try {
      const result = await signUp(formData);
      if (result?.error) {
        // Check if it's a duplicate email error
        if (result.error.toLowerCase().includes('already registered') || 
            result.error.toLowerCase().includes('already exists') ||
            result.error.toLowerCase().includes('email already')) {
          setIsDuplicateEmail(true);
          setError(`This email is already registered. Please sign in instead or use a different email.`);
        } else {
          setError(result.error);
        }
        setLoading(false);
      }
    } catch (err: any) {
      if (err?.digest?.startsWith('NEXT_REDIRECT')) {
        return;
      }
      setError("An error occurred. Please try again.");
      setLoading(false);
    }
  }

  const getPasswordStrength = (): { strength: string; color: string; width: string } => {
    const reqs = passwordRequirements;
    const metCount = Object.values(reqs).filter(Boolean).length;
    
    if (metCount === 0) return { strength: "", color: "", width: "0%" };
    if (metCount <= 2) return { strength: "Weak", color: "bg-red-500", width: "33%" };
    if (metCount <= 4) return { strength: "Medium", color: "bg-yellow-500", width: "66%" };
    return { strength: "Strong", color: "bg-green-500", width: "100%" };
  };

  const passwordStrength = getPasswordStrength();

  const switchToSignIn = () => {
    setIsDuplicateEmail(false);
    setError("");
    setSignUpEmail("");
    setSignUpPassword("");
    setConfirmPassword("");
    setSignUpName("");
    setSignUpErrors({});
    setSignUpTouched({ name: false, email: false, password: false, confirmPassword: false });
    
    // Scroll to sign in form
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Pre-fill the sign-in email if available
    if (signUpEmail) {
      setSignInEmail(signUpEmail);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4 py-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="text-center text-3xl font-bold text-white">
            Sign in to your account
          </h2>
        </div>

        {/* General Error Display */}
        {error && (
          <div className={`${
            isDuplicateEmail 
              ? 'bg-blue-900/50 border-blue-500 text-blue-200' 
              : 'bg-red-900/50 border-red-500 text-red-200'
          } border px-4 py-3 rounded`}>
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <p className="font-medium mb-1">
                  {isDuplicateEmail ? '📧 Account Already Exists' : '❌ Error'}
                </p>
                <p className="text-sm">{error}</p>
              </div>
              {isDuplicateEmail && (
                <button
                  onClick={switchToSignIn}
                  className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded transition-colors whitespace-nowrap"
                >
                  Go to Sign In
                </button>
              )}
            </div>
          </div>
        )}

        {/* Sign In Form */}
        <form onSubmit={handleSignIn} className="mt-8 space-y-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="signin-email" className="block text-sm font-medium text-gray-300 mb-1">
                Email address
              </label>
              <input
                id="signin-email"
                name="email"
                type="email"
                autoComplete="email"
                value={signInEmail}
                onChange={(e) => {
                  setSignInEmail(e.target.value);
                  // Clear general error when user starts typing
                  if (error) {
                    setError("");
                    setIsDuplicateEmail(false);
                  }
                }}
                onBlur={() => setSignInTouched(prev => ({ ...prev, email: true }))}
                disabled={loading}
                className={`appearance-none relative block w-full px-3 py-2 border ${
                  signInErrors.email ? 'border-red-500' : 'border-gray-700'
                } bg-gray-900 text-white placeholder-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-[#EB9C1C] focus:border-transparent disabled:opacity-50 transition-colors`}
                placeholder="you@example.com"
              />
              {signInErrors.email && (
                <p className="mt-1 text-sm text-red-400 flex items-center gap-1">
                  <span>⚠</span> {signInErrors.email}
                </p>
              )}
            </div>
            <div>
              <label htmlFor="signin-password" className="block text-sm font-medium text-gray-300 mb-1">
                Password
              </label>
              <input
                id="signin-password"
                name="password"
                type="password"
                autoComplete="current-password"
                value={signInPassword}
                onChange={(e) => {
                  setSignInPassword(e.target.value);
                  // Clear general error when user starts typing
                  if (error) {
                    setError("");
                    setIsDuplicateEmail(false);
                  }
                }}
                onBlur={() => setSignInTouched(prev => ({ ...prev, password: true }))}
                disabled={loading}
                className={`appearance-none relative block w-full px-3 py-2 border ${
                  signInErrors.password ? 'border-red-500' : 'border-gray-700'
                } bg-gray-900 text-white placeholder-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-[#EB9C1C] focus:border-transparent disabled:opacity-50 transition-colors`}
                placeholder="Enter your password"
              />
              {signInErrors.password && (
                <p className="mt-1 text-sm text-red-400 flex items-center gap-1">
                  <span>⚠</span> {signInErrors.password}
                </p>
              )}
              <div className="mt-2 text-right">
                <a href="/forgot-password" className="text-xs text-[#EB9C1C] hover:text-[#d18a1a] transition-colors">
                  Forgot password?
                </a>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-black bg-[#EB9C1C] hover:bg-[#d18a1a] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#EB9C1C] disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-[1.02] active:scale-[0.98]"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        {/* Sign Up Form */}
        <div className="mt-8">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-700" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-black text-gray-400">
                Or create new account
              </span>
            </div>
          </div>

          <form onSubmit={handleSignUp} className="mt-6 space-y-4">
            <div>
              <label htmlFor="signup-name" className="block text-sm font-medium text-gray-300 mb-1">
                Full name
              </label>
              <input
                id="signup-name"
                name="name"
                type="text"
                autoComplete="name"
                value={signUpName}
                onChange={(e) => setSignUpName(e.target.value)}
                onBlur={() => setSignUpTouched(prev => ({ ...prev, name: true }))}
                disabled={loading}
                className={`appearance-none relative block w-full px-3 py-2 border ${
                  signUpErrors.name ? 'border-red-500' : 'border-gray-700'
                } bg-gray-900 text-white placeholder-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-[#EB9C1C] focus:border-transparent disabled:opacity-50 transition-colors`}
                placeholder="John Doe"
              />
              {signUpErrors.name && (
                <p className="mt-1 text-sm text-red-400 flex items-center gap-1">
                  <span>⚠</span> {signUpErrors.name}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="signup-email" className="block text-sm font-medium text-gray-300 mb-1">
                Email address
              </label>
              <input
                id="signup-email"
                name="email"
                type="email"
                autoComplete="email"
                value={signUpEmail}
                onChange={(e) => {
                  setSignUpEmail(e.target.value);
                  // Clear duplicate email flag when user changes email
                  if (isDuplicateEmail) {
                    setIsDuplicateEmail(false);
                    setError("");
                  }
                }}
                onBlur={() => setSignUpTouched(prev => ({ ...prev, email: true }))}
                disabled={loading}
                className={`appearance-none relative block w-full px-3 py-2 border ${
                  signUpErrors.email || isDuplicateEmail ? 'border-red-500' : 'border-gray-700'
                } bg-gray-900 text-white placeholder-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-[#EB9C1C] focus:border-transparent disabled:opacity-50 transition-colors`}
                placeholder="you@example.com"
              />
              {signUpErrors.email && (
                <p className="mt-1 text-sm text-red-400 flex items-center gap-1">
                  <span>⚠</span> {signUpErrors.email}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="signup-password" className="block text-sm font-medium text-gray-300 mb-1">
                Password
              </label>
              <input
                id="signup-password"
                name="password"
                type="password"
                autoComplete="new-password"
                value={signUpPassword}
                onChange={(e) => setSignUpPassword(e.target.value)}
                onFocus={() => setShowPasswordRequirements(true)}
                onBlur={() => {
                  setSignUpTouched(prev => ({ ...prev, password: true }));
                  setShowPasswordRequirements(false);
                }}
                disabled={loading}
                className={`appearance-none relative block w-full px-3 py-2 border ${
                  signUpErrors.password ? 'border-red-500' : 'border-gray-700'
                } bg-gray-900 text-white placeholder-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-[#EB9C1C] focus:border-transparent disabled:opacity-50 transition-colors`}
                placeholder="Create a strong password"
              />
              
              {/* Password Strength Indicator */}
              {signUpPassword && (
                <div className="mt-2">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-gray-400">Password strength:</span>
                    <span className={`text-xs font-medium ${
                      passwordStrength.strength === 'Strong' ? 'text-green-400' :
                      passwordStrength.strength === 'Medium' ? 'text-yellow-400' : 'text-red-400'
                    }`}>
                      {passwordStrength.strength}
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-gray-700 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${passwordStrength.color} transition-all duration-300`}
                      style={{ width: passwordStrength.width }}
                    />
                  </div>
                </div>
              )}

              {/* Password Requirements */}
              {(showPasswordRequirements || signUpPassword) && (
                <div className="mt-2 p-3 bg-gray-900/50 rounded-md border border-gray-800">
                  <p className="text-xs text-gray-400 mb-2 font-medium">Password must contain:</p>
                  <ul className="space-y-1 text-xs">
                    <li className={`flex items-center gap-2 ${passwordRequirements.minLength ? 'text-green-400' : 'text-gray-500'}`}>
                      <span>{passwordRequirements.minLength ? '✓' : '○'}</span>
                      At least 8 characters
                    </li>
                    <li className={`flex items-center gap-2 ${passwordRequirements.hasUpperCase ? 'text-green-400' : 'text-gray-500'}`}>
                      <span>{passwordRequirements.hasUpperCase ? '✓' : '○'}</span>
                      One uppercase letter (A-Z)
                    </li>
                    <li className={`flex items-center gap-2 ${passwordRequirements.hasLowerCase ? 'text-green-400' : 'text-gray-500'}`}>
                      <span>{passwordRequirements.hasLowerCase ? '✓' : '○'}</span>
                      One lowercase letter (a-z)
                    </li>
                    <li className={`flex items-center gap-2 ${passwordRequirements.hasNumber ? 'text-green-400' : 'text-gray-500'}`}>
                      <span>{passwordRequirements.hasNumber ? '✓' : '○'}</span>
                      One number (0-9)
                    </li>
                    <li className={`flex items-center gap-2 ${passwordRequirements.hasSpecialChar ? 'text-green-400' : 'text-gray-500'}`}>
                      <span>{passwordRequirements.hasSpecialChar ? '✓' : '○'}</span>
                      One special character (!@#$%^&*)
                    </li>
                  </ul>
                </div>
              )}
            </div>

            <div>
              <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-300 mb-1">
                Confirm Password
              </label>
              <input
                id="confirm-password"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                onBlur={() => setSignUpTouched(prev => ({ ...prev, confirmPassword: true }))}
                disabled={loading}
                className={`appearance-none relative block w-full px-3 py-2 border ${
                  signUpErrors.confirmPassword ? 'border-red-500' : 'border-gray-700'
                } bg-gray-900 text-white placeholder-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-[#EB9C1C] focus:border-transparent disabled:opacity-50 transition-colors`}
                placeholder="Re-enter your password"
              />
              {signUpErrors.confirmPassword && (
                <p className="mt-1 text-sm text-red-400 flex items-center gap-1">
                  <span>⚠</span> {signUpErrors.confirmPassword}
                </p>
              )}
              {!signUpErrors.confirmPassword && confirmPassword && signUpPassword === confirmPassword && (
                <p className="mt-1 text-sm text-green-400 flex items-center gap-1">
                  <span>✓</span> Passwords match
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-2.5 px-4 border border-gray-700 rounded-md shadow-sm text-sm font-medium text-white bg-gray-900 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#EB9C1C] disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-[1.02] active:scale-[0.98]"
            >
              {loading ? "Creating account..." : "Create account"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}