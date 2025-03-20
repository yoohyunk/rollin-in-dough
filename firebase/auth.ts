// auth.ts
import { auth, googleProvider, db } from "./firebaseConfig"; // adjust the path if needed
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  User,
} from "firebase/auth";
import { doc, setDoc, getDoc, updateDoc } from "firebase/firestore";

/**
 * Creates a new user with email and password, then stores additional user info in Firestore.
 *
 * @param email - The user's email address (used for authentication, not stored in Firestore).
 * @param password - The user's password.
 * @param firstName - The user's first name.
 * @param lastName - The user's last name.
 * @returns The authenticated Firebase user.
 */
export const signUpWithEmail = async (
  email: string,
  password: string,
  firstName: string,
  lastName: string
): Promise<User> => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;
    // Save additional user info in Firestore under "users" collection, storing uid instead of email
    await setDoc(doc(db, "users", user.uid), {
      firstName,
      lastName,
      uid: user.uid,
      createdAt: new Date(),
      // Add any additional fields here
    });
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
    return userCredential.user;
  } catch (error) {
    console.error("Error signing in with email:", error);
    throw error;
  }
};
/**
 * Signs in a user with Google and stores additional info if the user is signing in for the first time.
 *
 * @returns The authenticated Firebase user.
 */
export const signInWithGoogle = async (): Promise<User> => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    const userDocRef = doc(db, "users", user.uid);
    const userDoc = await getDoc(userDocRef);
    if (!userDoc.exists()) {
      // Store additional info if user document doesn't exist yet, storing uid instead of email
      await setDoc(userDocRef, {
        displayName: user.displayName,
        uid: user.uid,
        createdAt: new Date(),
        // Add any additional fields here
      });
    }
    return user;
  } catch (error) {
    console.error("Error with Google sign in:", error);
    throw error;
  }
};

/**
 * Updates or adds the address for a given user in Firestore.
 *
 * @param userId - The Firebase user ID.
 * @param address - An object containing address details.
 * @example address = { street: "123 Main St", city: "Anytown", state: "CA", zip: "12345" }
 */
export const updateUserAddress = async (
  userId: string,
  address: { street: string; city: string; state: string; zip: string }
): Promise<void> => {
  try {
    const userDocRef = doc(db, "users", userId);
    await updateDoc(userDocRef, { address });
    console.log("Address updated successfully for user:", userId);
  } catch (error) {
    console.error("Error updating address:", error);
    throw error;
  }
};
