"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn, useSession } from "next-auth/react";
import { Eye, EyeOff, Loader2, Mail, Lock, User, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";

interface SignupResponse {
  message?: string;
}

export default function SignupPage() {
  const router = useRouter();
  const { status } = useSession();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (status === "authenticated") {
      router.replace("/");
    }
  }, [router, status]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (!agreeTerms) {
      setError("Please agree to the terms and conditions.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          phone,
          password,
        }),
      });

      const responseBody = (await response.json()) as SignupResponse;

      if (!response.ok) {
        throw new Error(responseBody.message || "Unable to create account.");
      }

      const signInResult = await signIn("credentials", {
        email,
        password,
        redirect: false,
        callbackUrl: "/",
      });

      if (signInResult?.error) {
        throw new Error("Account created, but automatic login failed. Please login manually.");
      }

      router.push(signInResult?.url || "/");
      router.refresh();
    } catch (signupError) {
      setError(signupError instanceof Error ? signupError.message : "Something went wrong.");
      setIsLoading(false);
    }
  };

  if (status === "loading") {
    return (
      <Card className="w-full max-w-md">
        <CardContent className="flex items-center justify-center py-10">
          <Loader2 className="size-6 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Create Account</CardTitle>
        <CardDescription>Sign up to start diagnosing your car problems</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {error && <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">{error}</div>}

          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="name"
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={(event) => setName(event.target.value)}
                className="pl-10"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="john@example.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="pl-10"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="phone"
                type="tel"
                placeholder="+91 98765 43210"
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Create a password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="pl-10 pr-10"
                required
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1/2 size-8 -translate-y-1/2"
                onClick={() => setShowPassword((current) => !current)}
              >
                {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Use at least 8 characters with uppercase, lowercase, and a number.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="confirmPassword"
                type={showPassword ? "text" : "password"}
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                className="pl-10"
                required
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Checkbox
              id="terms"
              checked={agreeTerms}
              onCheckedChange={(checked) => setAgreeTerms(checked === true)}
            />
            <Label htmlFor="terms" className="cursor-pointer text-sm font-normal">
              I agree to the Terms of Service and Privacy Policy
            </Label>
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 size-4 animate-spin" />
                Creating account...
              </>
            ) : (
              "Create Account"
            )}
          </Button>

          <Separator className="my-2" />

          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/login" className="text-primary hover:underline">
              Sign in
            </Link>
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
