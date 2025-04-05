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

interface CartItem {
  productId: string;
  variationId?: string;

  quantity: number;
}

// create
const addItemToCart = async (
  item: Omit<CartItem, "quantity">,
  quantity: number
): Promise<number | null> => {
  try {
    const auth = getAuth();
    const userId = auth.currentUser?.uid;
    if (!userId) throw new Error("User not authenticated");

    const cartRef = collection(db, "users", userId, "cart");
    const q = query(cartRef, where("productId", "==", item.productId));
    const snapshot = await getDocs(q);

    if (!snapshot.empty) {
      const docRef = snapshot.docs[0].ref;
      await updateDoc(docRef, {
        quantity,
      });
      return quantity;
    } else {
      await addDoc(cartRef, {
        productId: item.productId,
        variationId: item.variationId || "",

        quantity,
      });
      return quantity;
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
    return snapshot.docs.map((doc) => ({
      productId: doc.data().productId,
      variationId: doc.data().variationId || "",

      quantity: doc.data().quantity,
    }));
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
): Promise<CartItem[]> => {
  try {
    const auth = getAuth();
    const userId = auth.currentUser?.uid;
    if (!userId) {
      throw new Error(
        "User ID is undefined. Please ensure the user is authenticated."
      );
    }
    if (!localItems.length) {
      return getAllItemsFromCart();
    }
    const firestoreItems = await getAllItemsFromCart();

    for (const localItem of localItems) {
      const existingItem = firestoreItems.find(
        (item) => item.productId === localItem.productId
      );

      if (existingItem) {
        await updateCartItemQuantity(
          existingItem.productId,
          existingItem.quantity + localItem.quantity
        );
      } else {
        await addItemToCart(
          {
            productId: localItem.productId,
            variationId: localItem.variationId,
          },
          localItem.quantity
        );
      }
    }

    return getAllItemsFromCart();
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
