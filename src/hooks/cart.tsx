import React, {
  createContext,
  useState,
  useCallback,
  useContext,
  useEffect,
} from 'react';

import AsyncStorage from '@react-native-community/async-storage';

interface Product {
  id: string;
  title: string;
  image_url: string;
  price: number;
  quantity: number;
}

interface CartContext {
  products: Product[];
  addToCart(item: Omit<Product, 'quantity'>): void;
  increment(id: string): void;
  decrement(id: string): void;
}

const CartContext = createContext<CartContext | null>(null);

const CartProvider: React.FC = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  // console.log(products);
  useEffect(() => {
    async function loadProducts(): Promise<void> {
      // TODO LOAD ITEMS FROM ASYNC STORAGE
      const productsCarts = await AsyncStorage.getItem('@GoMarketplace:cart');

      if (productsCarts) {
        setProducts(JSON.parse(productsCarts));
      }
    }

    loadProducts();
  }, []);

  const addToCart = useCallback(
    async (product: Product) => {
      // TODO ADD A NEW ITEM TO THE CART

      const productExists = products.find(item => item.id === product.id);

      if (productExists) {
        const updateProducts = products.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );

        setProducts(updateProducts);
      } else {
        setProducts(item => [...item, { ...product, quantity: 1 }]);
      }

      await AsyncStorage.setItem(
        '@GoMarketplace:cart',
        JSON.stringify(products),
      );
    },
    [products],
  );

  const increment = useCallback(
    async id => {
      // TODO INCREMENTS A PRODUCT QUANTITY IN THE CART
      const incrementProduct = products.map(product =>
        product.id === id
          ? { ...product, quantity: product.quantity + 1 }
          : product,
      );

      setProducts(incrementProduct);

      try {
        await AsyncStorage.setItem(
          '@GoMarketplace:cart',
          JSON.stringify(incrementProduct),
        );
      } catch (error) {
        console.log(error);
      }
    },
    [products],
  );

  const decrement = useCallback(
    async id => {
      // TODO DECREMENTS A PRODUCT QUANTITY IN THE CART
      const productIndexRemove = products.findIndex(
        item => item.id === id && item.quantity < 2,
      );

      if (productIndexRemove >= 0) {
        const newProducts = products.filter(
          (item, index) => index !== productIndexRemove,
        );

        setProducts(newProducts);
        try {
          await AsyncStorage.setItem(
            '@GoMarketplace:cart',
            JSON.stringify(newProducts),
          );
        } catch (error) {
          console.log(error);
        }
        return;
      }

      const decrementProduct = products.map(item =>
        item.id === id ? { ...item, quantity: item.quantity - 1 } : item,
      );

      setProducts(decrementProduct);

      try {
        await AsyncStorage.setItem(
          '@GoMarketplace:cart',
          JSON.stringify(decrementProduct),
        );
      } catch (error) {
        console.log(error);
      }
    },
    [products],
  );

  const value = React.useMemo(
    () => ({ addToCart, increment, decrement, products }),
    [products, addToCart, increment, decrement],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

function useCart(): CartContext {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error(`useCart must be used within a CartProvider`);
  }

  return context;
}

export { CartProvider, useCart };
