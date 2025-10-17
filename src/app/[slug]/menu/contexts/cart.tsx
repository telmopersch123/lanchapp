"use client";
import { Product } from "@prisma/client";

import { createContext, useState } from "react";

export interface CartProduct
  extends Pick<Product, "id" | "name" | "price" | "imageUrl"> {
  quantity: number;
}

export interface ICartContext {
  isOpen: boolean;
  products: CartProduct[];
  total: number;
  totalQuantity: number;
  toggleCart: () => void;
  addProduct: (product: CartProduct) => void;
  decreaseCart: (productId: string) => void;
  increaseCart: (productId: string) => void;
  removeProduct: (productId: string) => void;
}

export const CartContext = createContext<ICartContext>({
  isOpen: false,
  products: [],
  total: 0,
  totalQuantity: 0,
  toggleCart: () => {},
  addProduct: () => {},
  decreaseCart: () => {},
  increaseCart: () => {},
  removeProduct: () => {},
});

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [products, setProducts] = useState<CartProduct[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const total = products.reduce(
    (total, product) => total + Number(product.price) * product.quantity,
    0
  );
  const totalQuantity = products.reduce(
    (total, product) => total + product.quantity,
    0
  );

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

  const removeProduct = (productId: string) => {
    setProducts((prevProducts) => {
      return prevProducts.filter((product) => product.id !== productId);
    });
  };

  const decreaseCart = (productId: string) => {
    setProducts((prevProducts) => {
      return prevProducts.map((product) => {
        if (product.id !== productId) return product;
        if (product.quantity === 1) return product;

        return {
          ...product,
          quantity: product.quantity - 1,
        };
      });
    });
  };

  const increaseCart = (productId: string) => {
    setProducts((prevProducts) => {
      return prevProducts.map((product) => {
        if (product.id !== productId) return product;
        return {
          ...product,
          quantity: product.quantity + 1,
        };
      });
    });
  };
  return (
    <CartContext.Provider
      value={{
        isOpen,
        products,
        total,
        totalQuantity,
        toggleCart,
        addProduct,
        decreaseCart,
        increaseCart,
        removeProduct,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
