"use client";

import type React from "react";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";

type Errors = {
  email?: string;
  password?: string;
};

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function SignInPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [errors, setErrors] = useState<Errors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const setField = (name: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (typeof value === "string") validateField(name as keyof Errors, value);
  };

  const validateField = (name: keyof Errors, raw: string) => {
    const value = raw.trim();
    let msg = "";
    if (name === "email") {
      if (!value) msg = "Email is required.";
      else if (!emailRegex.test(value)) msg = "Enter a valid email.";
    }
    if (name === "password") {
      if (!value) msg = "Password is required.";
      else if (value.length < 8) msg = "Minimum 8 characters.";
    }
    setErrors((prev) => ({ ...prev, [name]: msg }));
    return msg === "";
  };

  const validateAll = () => {
    const okEmail = validateField("email", formData.email);
    const okPass = validateField("password", formData.password);
    return okEmail && okPass;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateAll()) return;
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      console.log("[Sign in data]:", {
        ...formData,
        email: formData.email.trim(),
        password: formData.password.trim(),
      });
    }, 800);
  };

  const handleGoogle = async () => {
    setIsGoogleLoading(true);
    try {
      console.log("[Google OAuth clicked]");
      await new Promise((r) => setTimeout(r, 600));
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const inputClass = (invalid?: boolean) =>
    [
      "h-12",
      "border-gray-300",
      "focus:border-[#3F2C77]",
      "focus:ring-[#3F2C77]",
      invalid &&
        "border-red-500 ring-1 ring-red-500 focus:ring-red-500 focus:border-red-500",
    ]
      .filter(Boolean)
      .join(" ");

  return (
    <div className="min-h-dvh flex flex-col md:flex-row">
      {/* Left 40% image section */}
      <aside className="relative hidden md:block md:basis-2/5">
        <Image
          src="/figmaAssets/Rectangle-334.png"
          alt="Hotel room"
          fill
          className="object-cover"
          priority
        />
        <div
          className="absolute inset-0"
          style={{ backgroundColor: "#3F2C77", opacity: 0.65 }}
        />
        <div className="absolute inset-0 flex items-center">
          <div className="px-8 lg:px-12">
            <h2 className="[font-family:'Poppins',Helvetica] text-white text-3xl lg:text-5xl font-bold max-w-[20ch]">
              Your perfect stay is one click away
            </h2>
          </div>
        </div>
      </aside>

      {/* Right 60% form section */}
      <main className="flex-1 md:basis-3/5 flex items-center justify-center py-10 px-6 lg:px-12 bg-white">
        <div className="w-full max-w-[720px] space-y-8">
          {/* Logo */}
          <div className="flex items-center justify-center gap-3">
            <img
              className="w-[141px] h-[94px]"
              alt="Logo"
              src="/figmaAssets/group-370.png"
            />
          </div>

          {/* Sign In Form */}
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div className="space-y-2">
              <Label
                htmlFor="email"
                className="[font-family:'Inter',Helvetica] text-gray-700 font-medium"
              >
                Your Email
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="info@abcd.com"
                value={formData.email}
                onChange={(e) => setField("email", e.target.value)}
                onBlur={(e) => validateField("email", e.target.value)}
                aria-invalid={Boolean(errors.email) || undefined}
                aria-describedby="email-error"
                className={inputClass(!!errors.email)}
                required
                data-testid="input-email"
              />
              {errors.email && (
                <p
                  id="email-error"
                  className="[font-family:'Inter',Helvetica] text-xs text-red-500"
                >
                  {errors.email}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="password"
                className="[font-family:'Inter',Helvetica] text-gray-700 font-medium"
              >
                Your Password
              </Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setField("password", e.target.value)}
                onBlur={(e) => validateField("password", e.target.value)}
                aria-invalid={Boolean(errors.password) || undefined}
                aria-describedby="password-error"
                className={inputClass(!!errors.password)}
                required
                data-testid="input-password"
              />
              {errors.password && (
                <p
                  id="password-error"
                  className="[font-family:'Inter',Helvetica] text-xs text-red-500"
                >
                  {errors.password}
                </p>
              )}
            </div>

            {/* Remember Me and Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 [font-family:'Inter',Helvetica] text-sm text-gray-600">
                <Checkbox
                  checked={formData.rememberMe}
                  onCheckedChange={(v) => setField("rememberMe", Boolean(v))}
                  className="border-gray-300 data-[state=checked]:bg-[#3F2C77] data-[state=checked]:border-[#3F2C77]"
                  data-testid="checkbox-remember-me"
                />
                Remember Me
              </label>

              <Link
                href="/forgot-password"
                className="[font-family:'Inter',Helvetica] text-sm text-blue-600 hover:underline"
                data-testid="link-forgot-password"
              >
                Forgot Password?
              </Link>
            </div>

            {/* Login Button */}
            <Button
              type="submit"
              className="w-full h-12 text-white transition-colors duration-200 hover:bg-[#2a2158]"
              style={{ backgroundColor: "#3F2C77" }}
              disabled={isSubmitting}
              aria-busy={isSubmitting}
              data-testid="button-login"
            >
              {isSubmitting ? "Logging in..." : "Login"}
            </Button>
          </form>

          {/* Divider */}
          <div className="relative">
            <Separator className="bg-gray-300" />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="bg-white px-4 [font-family:'Inter',Helvetica] text-gray-500 text-sm">
                OR
              </span>
            </div>
          </div>

          {/* Social Login */}
          <div className="space-y-3">
            <Button
              type="button"
              onClick={handleGoogle}
              aria-label="Continue with Google"
              className="w-full h-12 rounded-full border border-gray-300 bg-white text-gray-900 px-5 flex items-center justify-center gap-3 transition-all duration-300 ease-in-out hover:bg-gray-50 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-gray-300"
              variant="outline"
              disabled={isGoogleLoading}
              aria-busy={isGoogleLoading}
              data-testid="button-google-signin"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  fill="#EA4335"
                  d="M12 10.2v3.6h5.1c-.2 1.2-1.6 3.6-5.1 3.6-3.1 0-5.7-2.6-5.7-5.8S8.9 5.8 12 5.8c1.8 0 3 .8 3.7 1.5l2.5-2.4C16.7 3.4 14.6 2.5 12 2.5 6.9 2.5 2.8 6.6 2.8 11.7s4.1 9.2 9.2 9.2c5.3 0 8.8-3.7 8.8-8.9 0-.6-.1-1-.1-1.4H12z"
                />
                <path
                  fill="#34A853"
                  d="M3.7 7.3l3 2.2C7.8 7.4 9.7 5.9 12 5.9c1.8 0 3 .8 3.7 1.5l2.5-2.4C16.7 3.4 14.6 2.5 12 2.5 8.8 2.5 5.9 4.4 3.7 7.3z"
                />
                <path
                  fill="#FBBC05"
                  d="M12 20.9c2.6 0 4.8-.9 6.4-2.5l-2.9-2.3c-.8.5-1.8.9-3.5.9-3.6 0-5-2.4-5.2-3.7l-3 .2c.6 3 3.2 7.4 8.2 7.4z"
                />
                <path
                  fill="#4285F4"
                  d="M21.1 12.3c0-.6-.1-1-.1-1.4H12v3.6h5.1c-.3 1.8-2 3.6-5.1 3.6-3.1 0-5.7-2.6-5.7-5.8S8.9 5.8 12 5.8c1.8 0 3 .8 3.7 1.5l2.5-2.4C16.7 3.4 14.6 2.5 12 2.5 6.9 2.5 2.8 6.6 2.8 11.7s4.1 9.2 9.2 9.2c5.3 0 8.8-3.7 8.8-8.9 0-.6-.1-1-.1-1.4H12z"
                />
              </svg>
              <span className="[font-family:'Inter',Helvetica] text-[15px] font-medium">
                {isGoogleLoading ? "Connecting..." : "Continue with Google"}
              </span>
            </Button>
          </div>

          {/* Sign Up Link */}
          <p className="text-center [font-family:'Inter',Helvetica] text-gray-600">
            Don&apos;t have any account?{" "}
            <Link
              href="/customer/signup"
              className="text-blue-600 hover:underline"
              data-testid="link-signup"
            >
              Register
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
