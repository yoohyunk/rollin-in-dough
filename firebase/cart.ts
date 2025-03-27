/* eslint-disable prettier/prettier */
import { addDoc, collection, getDocs, doc, deleteDoc } from "firebase/firestore";
import { db } from "./firebaseConfig";

interface CartItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

// CREATE 
const addItemToCart = async (userId: string, item: CartItem) => {
  try {
    const docRef = await addDoc(collection(db, "users", userId, "cart"), {
      id: item.id,
      name: item.name,
      quantity: item.quantity,
      price: item.price,
    });
    console.log("Added item ID:", docRef.id);
  } catch (error) {
    console.error("Error adding item to cart:", error);
  }
};

// GET ALL 
const getAllItemsFromCart = async (userId: string) => {
  try {
    const snapshot = await getDocs(collection(db, "users", userId, "cart"));
    snapshot.forEach((doc) => {
      console.log(doc.id, " => ", doc.data());
    });
  } catch (error) {
    console.error("Error fetching items from cart:", error);
  }
};

// DELETE 
const deleteItemFromCart = async (userId: string, itemId: string) => {
  try {
    const docRef = doc(db, "users", userId, "cart", itemId);
    await deleteDoc(docRef);
    console.log("Item deleted:", itemId);
  } catch (error) {
    console.error("Error deleting item from cart:", error);
  }
};

// CLEAR 
const clearCart = async (userId: string) => {
  try {
    const snapshot = await getDocs(collection(db, "users", userId, "cart"));
    for (const d of snapshot.docs) {
      await deleteDoc(d.ref);
    }
    console.log("Cart cleared for user:", userId);
  } catch (error) {
    console.error("Error clearing cart:", error);
  }
};

export {
  addItemToCart,
  getAllItemsFromCart,
  deleteItemFromCart,
  clearCart
};