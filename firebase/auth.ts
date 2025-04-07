// auth.ts
import { auth, googleProvider } from "./firebaseConfig";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  User,
  getAdditionalUserInfo,
  sendEmailVerification,
  updateProfile,
} from "firebase/auth";

import { Address } from "@/types/customerData";

const defaultAddress: Address = {
  address_line_1: "",
  locality: "",
  administrative_district_level_1: "",
  postal_code: "",
};
const defaultPhoneNumber = "";

export const signUpWithEmail = async (
  given_name: string,
  family_name: string,
  email_address: string,
  password: string
): Promise<User> => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email_address,
      password
    );
    const user = userCredential.user;

    if (!user) {
      throw new Error("User is not signed in");
    }
    await updateProfile(user, {
      displayName: `${given_name} ${family_name}`,
    });

    // Send email verification to the new user
    await sendEmailVerification(user);

    return user;
  } catch (error) {
    console.error("Error signing up:", error);
    throw error;
  }
};

export const signInWithEmail = async (
  email: string,
  password: string
): Promise<User> => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;
    if (!user.emailVerified) {
      return user;
    }

    if (user) {
      const token = await user.getIdToken();
      await fetch("/api/set-cookie", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: token }),
      });
    }

    const displayName = user.displayName || "";
    const nameParts = displayName.split(" ");
    const given_name = nameParts[0] || "";
    const family_name = nameParts.slice(1).join(" ") || "";
    const email_address = user.email;

    const squareRes = await fetch("/api/create-customer", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        given_name,
        family_name,
        email_address,
        phone_number: defaultPhoneNumber,
        address: defaultAddress,
      }),
    });

    if (!squareRes.ok) {
      throw new Error("Failed to create Square customer");
    }

    return userCredential.user;
  } catch (error) {
    console.error("Error signing in with email:", error);
    throw error;
  }
};

export const signInWithGoogle = async (): Promise<User> => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;

    const additionalUserInfo = getAdditionalUserInfo(result);
    const isNewUser = additionalUserInfo?.isNewUser;

    const displayName = user.displayName || "";
    const nameParts = displayName.split(" ");
    const given_name = nameParts[0] || "";
    const family_name = nameParts.slice(1).join(" ") || "";

    if (user) {
      const token = await user.getIdToken();
      await fetch("/api/set-cookie", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: token }),
      });
    }

    if (isNewUser) {
      const squareRes = await fetch("/api/create-customer", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          given_name,
          family_name,
          email_address: user.email,
          phone_number: defaultPhoneNumber,
          address: defaultAddress,
        }),
      });

      if (!squareRes.ok) {
        throw new Error("Failed to create Square customer");
      }
    }

    return user;
  } catch (error) {
    console.error("Error with Google sign in:", error);
    throw error;
  }
};

export const userSignOut = async () => {
  if (auth.currentUser) {
    auth.signOut();
    await fetch("/api/set-cookie", {
      method: "DELETE",
    });
  }
};
