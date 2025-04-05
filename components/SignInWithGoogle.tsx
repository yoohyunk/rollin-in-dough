"use client";
import { signInWithGoogle } from "@/firebase/auth";
import { Button } from "@/components/ui/button";

export default function SignInWithGoogle() {
  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error("Google sign in error:", error);
    }
  };

  return (
    <div>
      <Button onClick={handleGoogleSignIn} className="w-full">
        Sign in with Google
      </Button>
    </div>
  );
}
