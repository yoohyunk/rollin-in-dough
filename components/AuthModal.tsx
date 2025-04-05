"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { signInWithEmail, signUpWithEmail } from "@/firebase/auth";
import { useEffect, useState } from "react";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import SignInWithGoogle from "@/components/SignInWithGoogle";
import { PiUserBold } from "react-icons/pi";

import { useRouter, useSearchParams } from "next/navigation";

export default function AuthModal() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [currentForm, setCurrentForm] = useState<"login" | "signup">("login");
  const [open, setOpen] = useState(false);

  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const isNotLogin = searchParams?.get("isNotLogin");
    if (isNotLogin === "true") {
      setOpen(true);
      const url = new URL(window.location.href);
      url.searchParams.delete("isNotLogin");
      router.replace(url.pathname + url.search);
    }
  }, [searchParams, router]);

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    if (currentForm === "login") {
      if (!email || !password) {
        setError("Please fill in all required fields.");
        return;
      }
    } else if (currentForm === "signup") {
      if (!firstName || !lastName || !email || !password || !passwordConfirm) {
        setError("Please fill in all required fields.");
        return;
      }
      if (!passwordRegex.test(password)) {
        setError(
          "Password must be at least 8 characters long and include both letters and numbers."
        );
        setPassword("");
        setPasswordConfirm("");
        return;
      }
      if (password !== passwordConfirm) {
        setError("Passwords do not match.");
        setPassword("");
        setPasswordConfirm("");
        return;
      }
    }
    try {
      if (currentForm === "login") {
        await signInWithEmail(email, password);
      } else if (currentForm === "signup") {
        await signUpWithEmail(firstName, lastName, email, password);
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred");
      }
      console.error("Sign in error:", err);
    }
  };

  return (
    <div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger className="font-semibold">
          <div className="flex flex-row items-center gap-1">
            <PiUserBold />
            <div className="hidden md:block font-semibold">Log in</div>
          </div>
        </DialogTrigger>
        {currentForm === "login" ? (
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Log In</DialogTitle>
              <DialogDescription>Log In with Email</DialogDescription>
            </DialogHeader>
            <div className="flex flex-col gap-4">
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              {error && <p style={{ color: "red" }}>{error}</p>}
            </div>
            <DialogFooter>
              <div className="flex flex-col gap-2 w-full">
                <Button
                  type="submit"
                  onClick={handleEmailSignIn}
                  className="w-full"
                >
                  Log In
                </Button>
                <div className="w-full flex items-center">
                  <div className="flex-1">
                    <Separator className="border-t border-gray-300" />
                  </div>
                  <span className="mx-2 text-sm text-muted-foreground">or</span>
                  <div className="flex-1">
                    <Separator className="border-t border-gray-300" />
                  </div>
                </div>
                <div className="w-full">
                  <SignInWithGoogle />
                </div>
                <div>
                  Don{"'"}t have an account?{" "}
                  <button
                    onClick={() => {
                      setCurrentForm("signup");
                      setError(null);
                      setEmail("");
                      setPassword("");
                    }}
                    className="text-blue-400 hover:text-blue-600"
                  >
                    Sign up
                  </button>
                </div>
              </div>
            </DialogFooter>
          </DialogContent>
        ) : (
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Sign Up</DialogTitle>
              <DialogDescription>Sign Up with Email</DialogDescription>
            </DialogHeader>
            <div className="flex flex-col gap-4">
              <Input
                type="text"
                placeholder="First Name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
              <Input
                type="text"
                placeholder="Last Name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <Input
                type="password"
                placeholder="Confirm Password"
                value={passwordConfirm}
                onChange={(e) => setPasswordConfirm(e.target.value)}
                required
              />
              {error && <p style={{ color: "red" }}>{error}</p>}
            </div>
            <DialogFooter>
              <div className="flex flex-col gap-2 w-full">
                <Button
                  type="submit"
                  onClick={handleEmailSignIn}
                  className="w-full"
                >
                  Sign Up
                </Button>
                <div className="w-full flex items-center">
                  <div className="flex-1">
                    <Separator className="border-t border-gray-300" />
                  </div>
                  <span className="mx-2 text-sm text-muted-foreground">or</span>
                  <div className="flex-1">
                    <Separator className="border-t border-gray-300" />
                  </div>
                </div>
                <div className="w-full">
                  <SignInWithGoogle />
                </div>
                <div>
                  Have an account?{" "}
                  <button
                    onClick={() => {
                      setCurrentForm("login");
                      setFirstName("");
                      setLastName("");
                      setEmail("");
                      setPassword("");
                      setPasswordConfirm("");
                    }}
                    className="px-4 py-2 text-[#fc3296] border border-[#fc3296] rounded hover:bg-[#fc3296] hover:text-white transition-all"
                  >
                    Sign in
                  </button>
                </div>
              </div>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
}
