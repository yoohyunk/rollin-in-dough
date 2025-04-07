"use client";
import { createContext, useEffect, useState } from "react";
import type { CookieProduct } from "../../components/cookies";
import { CartItem, DisplayCartItem } from "@/types/customerData";
import { getAuth } from "@firebase/auth";
import {
  addItemToCart,
  getAllItemsFromCart,
  updateCartItemQuantity,
  clearCart as clearCartFirestore,
} from "@/firebase/cart";

type GetItemResponse = { items: CookieProduct[] };

interface CartContextValue {
  cart: DisplayCartItem[];
  updateCart: (
    quantity: number,
    cookieProduct: DisplayCartItem
  ) => Promise<void>;
  clearCart: () => Promise<void>;
}

const readLocalCart = (): CartItem[] => {
  const cartStr = localStorage.getItem("localCart") ?? "[]";
  const localCart: CartItem[] = JSON.parse(cartStr) ?? [];
  return localCart;
};

const transformLocalCart = async (
  localCartItems: CartItem[]
): Promise<DisplayCartItem[]> => {
  if (localCartItems.length === 0) {
    return [];
  }
  const response = await fetch(
    `/api/get-item?objectIds=${localCartItems.map((item) => item.product.id).join(",")}`
  );
  const { items }: GetItemResponse = await response.json();

  const formattedCart = items.map((item) => {
    const matchingCartItem = localCartItems.find(
      // <--- Use loadedCartItems instead of cartItems
      (cartItem) => cartItem.product.id === item.id
    );
    return {
      product: {
        id: item.id,
        variationId: item.variationId || "",
        name: item.name,
        price: item.price,
        imageUrl: item.imageUrl,
        description: item.description,
      },
      quantity: matchingCartItem ? matchingCartItem.quantity : 1,
    };
  });
  return formattedCart;
};

const checkAuth = () => {
  const auth = getAuth();
  return !!auth.currentUser?.uid;
};

/**
 * Compares local cart with firebse firestore cart then returns a new merged cart.
 * New items are merged from local cart, but quantities are preserved from firestore.
 */
const syncWithFirebase = async (localCart: CartItem[]): Promise<CartItem[]> => {
  const firestoreItems = await getAllItemsFromCart();

  const newItems = localCart.filter((localItem) => {
    const isLocalItemInFirestore = firestoreItems.find((firestoreItem) => {
      return firestoreItem.product.id === localItem.product.id;
    });
    return !isLocalItemInFirestore;
  });

  for (const newItem of newItems) {
    await addItemToCart(newItem);
    firestoreItems.push(newItem);
  }
  return firestoreItems;
};

export const useCart = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [displayCartItems, setDisplayCartItems] = useState<DisplayCartItem[]>(
    []
  );

  const isLoggedIn = checkAuth();

  useEffect(() => {
    const loadCart = async () => {
      let localCart = readLocalCart();
      let displayCart = await transformLocalCart(localCart);
      if (isLoggedIn) {
        const syncedCart = await syncWithFirebase(localCart);
        const newFirestoreItems = syncedCart.filter((firestoreItem) => {
          const isSyncedItemInLocalCart = localCart.find((localItem) => {
            return localItem.product.id === firestoreItem.product.id;
          });
          return !isSyncedItemInLocalCart;
        });
        const newDisplayItems = await transformLocalCart(newFirestoreItems);
        localCart = syncedCart;
        displayCart = [...displayCart, ...newDisplayItems];
      }
      updateLocalCart(localCart, true);
      setDisplayCartItems(displayCart);
    };
    loadCart();
  }, [isLoggedIn]);

  const updateLocalCart = (items: CartItem[], isUpdateStorage: boolean) => {
    setCartItems(items);
    if (isUpdateStorage) {
      localStorage.setItem("localCart", JSON.stringify(items));
    }
  };

  const clearCart = async () => {
    if (isLoggedIn) {
      await clearCartFirestore();
    }

    updateLocalCart([], true);
    setDisplayCartItems([]);
  };

  const updateCart = async (
    quantity: number,
    cookieProduct: DisplayCartItem
  ) => {
    try {
      const newLocalCart = structuredClone(cartItems);
      const newDisplayCart = structuredClone(displayCartItems);

      const currentItemIndex = cartItems.findIndex((item) => {
        return item.product.id === cookieProduct.product.id;
      });
      if (currentItemIndex === -1) {
        const newItem: CartItem = {
          product: {
            id: cookieProduct.product.id,
            variationId: cookieProduct.product.variationId,
          },
          quantity: 1,
        };
        newLocalCart.push(newItem);

        const isNewItemInDisplayCartItems = displayCartItems.find(
          (displayItem) => {
            return displayItem.product.id === newItem.product.id;
          }
        );
        if (!isNewItemInDisplayCartItems) {
          const newDisplayCartItem = await transformLocalCart([newItem]);
          newDisplayCart.push(newDisplayCartItem[0]);
        }
      } else {
        newLocalCart[currentItemIndex].quantity = quantity;
        newDisplayCart[currentItemIndex].quantity = quantity;
        if (newLocalCart[currentItemIndex].quantity === 0) {
          newLocalCart.splice(currentItemIndex, 1);
          newDisplayCart.splice(currentItemIndex, 1);
        }
      }

      if (isLoggedIn) {
        if (currentItemIndex === -1) {
          await addItemToCart(newLocalCart[newLocalCart.length - 1]);
        } else {
          await updateCartItemQuantity(cookieProduct.product.id, quantity);
        }
      }

      updateLocalCart(newLocalCart, true);
      setDisplayCartItems(newDisplayCart);
    } catch (error: unknown) {
      console.error(error);
      window.alert("unable to update cart");
    }
  };

  const addCookieToCart = async (product: CookieProduct) => {
    let selectedDisplayProduct = displayCartItems.find(
      (item) => item.product.id === product.id
    );

    if (selectedDisplayProduct === undefined) {
      selectedDisplayProduct = {
        product: {
          id: product.id,
          description: product.description,
          imageUrl: product.imageUrl,
          name: product.name,
          price: product.price,
          variationId: product.variationId,
        },
        quantity: 0,
      };
    }
    await updateCart(
      selectedDisplayProduct.quantity + 1,
      selectedDisplayProduct
    );
  };

  return {
    cart: displayCartItems,
    addCookieToCart,
    updateCart,
    clearCart,
  };
};

const CartContext = createContext<CartContextValue | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { cart, updateCart, clearCart } = useCart();
  return (
    <CartContext.Provider value={{ cart, updateCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};
