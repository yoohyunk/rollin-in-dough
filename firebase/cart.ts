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

interface CartItem {
  productId: string;
  name: string;
  quantity: number;
  price: number;
  image?: string;
}

// create
const addItemToCart = async (userId: string, item: CartItem) => {
  try {
    const cartRef = collection(db, "users", userId, "cart");
    const q = query(cartRef, where("productId", "==", item.productId));
    const snapshot = await getDocs(q);

    if (!snapshot.empty) {
      const docRef = snapshot.docs[0].ref;
      await updateDoc(docRef, {
        quantity: snapshot.docs[0].data().quantity + item.quantity,
      });
    } else {
      await addDoc(cartRef, {
        productId: item.productId,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        ...(item.image && { image: item.image }),
      });
    }
  } catch (error) {
    console.error("Error adding item to cart:", error);
  }
};

// get all
const getAllItemsFromCart = async (userId: string): Promise<CartItem[]> => {
  try {
    const snapshot = await getDocs(collection(db, "users", userId, "cart"));
    return snapshot.docs.map((doc) => ({
      productId: doc.data().productId,
      name: doc.data().name,
      quantity: doc.data().quantity,
      price: doc.data().price,
      image: doc.data().image || "",
    }));
  } catch (error) {
    console.error("Error loading cart:", error);
    return [];
  }
};

// delete
const deleteItemFromCart = async (userId: string, productId: string) => {
  try {
    const q = query(
      collection(db, "users", userId, "cart"),
      where("productId", "==", productId)
    );
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      await deleteDoc(snapshot.docs[0].ref);
      console.log("Item removed:", productId);
    }
  } catch (error) {
    console.error("Error removing item from cart:", error);
  }
};

// clear
const clearCart = async (userId: string) => {
  try {
    const snapshot = await getDocs(collection(db, "users", userId, "cart"));
    const deletePromises = snapshot.docs.map((d) => deleteDoc(d.ref));
    await Promise.all(deletePromises);
    console.log("Cart cleared for user:", userId);
  } catch (error) {
    console.error("Error clearing cart:", error);
  }
};

// updating cart item quantity
const updateCartItemQuantity = async (
  userId: string,
  productId: string,
  newQuantity: number
) => {
  try {
    const q = query(
      collection(db, "users", userId, "cart"),
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
  userId: string,
  localItems: CartItem[]
): Promise<CartItem[]> => {
  try {
    if (!localItems.length) {
      return getAllItemsFromCart(userId);
    }
    const firestoreItems = await getAllItemsFromCart(userId);

    for (const localItem of localItems) {
      const existingItem = firestoreItems.find(
        (item) => item.productId === localItem.productId
      );

      if (existingItem) {
        await updateCartItemQuantity(
          userId,
          existingItem.productId,
          existingItem.quantity + localItem.quantity
        );
      } else {
        await addItemToCart(userId, localItem);
      }
    }

    return getAllItemsFromCart(userId);
  } catch (error) {
    console.error("Error syncing carts:", error);
    throw error;
  }
};

export {
  addItemToCart,
  getAllItemsFromCart,
  deleteItemFromCart,
  clearCart,
  syncLocalCartWithFirestore,
};
