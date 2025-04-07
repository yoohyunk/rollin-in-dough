import {
  addDoc,
  collection,
  getDocs,
  deleteDoc,
  updateDoc,
  query,
  where,
} from "firebase/firestore";
import { db } from "@/firebase/firebaseConfig";
import { getAuth } from "firebase/auth";

import type { CartItem } from "@/types/customerData";

// create
const addItemToCart = async (cartItem: CartItem): Promise<number | null> => {
  try {
    const auth = getAuth();
    const userId = auth.currentUser?.uid;
    if (!userId) throw new Error("User not authenticated");

    const cartRef = collection(db, "users", userId, "cart");
    const q = query(cartRef, where("productId", "==", cartItem.product.id));
    const snapshot = await getDocs(q);

    if (!snapshot.empty) {
      const docRef = snapshot.docs[0].ref;
      await updateDoc(docRef, {
        quantity: cartItem.quantity,
      });
      return cartItem.quantity;
    } else {
      await addDoc(cartRef, {
        productId: cartItem.product.id,
        variationId: cartItem.product.variationId || "",

        quantity: cartItem.quantity,
      });
      return cartItem.quantity;
    }
  } catch (err) {
    console.error("Error adding to cart:", err);
    return null;
  }
};

// get all
const getAllItemsFromCart = async (): Promise<CartItem[]> => {
  try {
    const auth = getAuth();
    const userId = auth.currentUser?.uid;
    if (!userId) {
      throw new Error(
        "User ID is undefined. Please ensure the user is authenticated."
      );
    }

    const snapshot = await getDocs(collection(db, "users", userId, "cart"));

    const mappedItems = snapshot.docs.map((doc) => ({
      product: {
        id: doc.data().productId,
        variationId: doc.data().variationId || "",
      },
      quantity: doc.data().quantity,
    }));

    return mappedItems;
  } catch (error) {
    console.error("Error loading cart:", error);
    return [];
  }
};

// delete
const deleteItemFromCart = async (productId: string) => {
  try {
    const auth = getAuth();
    const userId = auth.currentUser?.uid;
    const q = query(
      collection(db, "users", userId!, "cart"),
      where("productId", "==", productId)
    );
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      await deleteDoc(snapshot.docs[0].ref);
    }
  } catch (error) {
    console.error("Error removing item from cart:", error);
  }
};

// clear
const clearCart = async () => {
  try {
    const auth = getAuth();
    const userId = auth.currentUser?.uid;
    if (!userId) {
      throw new Error(
        "User ID is undefined. Please ensure the user is authenticated."
      );
    }
    const snapshot = await getDocs(collection(db, "users", userId, "cart"));
    const deletePromises = snapshot.docs.map((d) => deleteDoc(d.ref));
    await Promise.all(deletePromises);
  } catch (error) {
    console.error("Error clearing cart:", error);
  }
};

// updating cart item quantity
const updateCartItemQuantity = async (
  productId: string,
  newQuantity: number
) => {
  try {
    const auth = getAuth();
    const userId = auth.currentUser?.uid;
    const q = query(
      collection(db, "users", userId!, "cart"),
      where("productId", "==", productId)
    );
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      await updateDoc(snapshot.docs[0].ref, { quantity: newQuantity });
    }
  } catch (error) {
    console.error("Error updating item quantity:", error);
  }
};

// Ssync
const syncLocalCartWithFirestore = async (
  localItems: CartItem[]
): Promise<void> => {
  try {
    const auth = getAuth();
    const userId = auth.currentUser?.uid;
    if (!userId) {
      throw new Error(
        "User ID is undefined. Please ensure the user is authenticated."
      );
    }
    // if (!localItems.length) {
    //   return getAllItemsFromCart();
    // }
    const firestoreItems = await getAllItemsFromCart();

    for (const localItem of localItems) {
      const existingItem = firestoreItems.find(
        (item) => item.product.id === localItem.product.id
      );

      if (existingItem) {
        await updateCartItemQuantity(
          existingItem.product.id,
          existingItem.quantity
        );
      } else {
        await addItemToCart(localItem);
      }
    }
  } catch (error) {
    console.error("Error syncing carts:", error);
    throw error;
  }
};

export {
  addItemToCart,
  getAllItemsFromCart,
  deleteItemFromCart,
  updateCartItemQuantity,
  clearCart,
  syncLocalCartWithFirestore,
};
