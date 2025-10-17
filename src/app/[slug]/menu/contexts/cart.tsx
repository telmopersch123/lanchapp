"use client";
import { Product } from "@prisma/client";

import { createContext, useState } from "react";

interface CartProduct
  extends Pick<Product, "id" | "name" | "price" | "imageUrl"> {
  quantity: number;
}

export interface ICartContext {
  isOpen: boolean;
  products: CartProduct[];
  toggleCart: () => void;
  addProduct: (product: CartProduct) => void;
}

export const CartContext = createContext<ICartContext>({
  isOpen: false,
  products: [],
  toggleCart: () => {},
  addProduct: () => {},
});

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [products, setProducts] = useState<CartProduct[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const toggleCart = () => {
    setIsOpen((prev) => !prev);
  };

  const addProduct = (newProduct: CartProduct) => {
    setProducts((prevProducts) => {
      const existingProduct = prevProducts.find((p) => p.id === newProduct.id);

      if (existingProduct) {
        // Atualiza a quantidade, somando a anterior com a nova
        return prevProducts.map((p) =>
          p.id === newProduct.id
            ? { ...p, quantity: p.quantity + newProduct.quantity }
            : p
        );
      }

      // Se for um produto novo, adiciona normalmente
      return [...prevProducts, newProduct];
    });
  };
  return (
    <CartContext.Provider
      value={{
        isOpen,
        products,
        toggleCart,
        addProduct,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
