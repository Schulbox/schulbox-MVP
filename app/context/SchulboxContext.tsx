import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";

export type SchulboxItem = {
  id: string;
  title: string;
  quantity: number;
  price: number;
  image: string;
};

type SchulboxContextType = {
  items: SchulboxItem[];
  addToBox: (item: SchulboxItem) => void;
  removeFromBox: (id: string) => void;
  clearBox: () => void;
  totalItems: number;
  justAdded: boolean;
  increaseQuantity: (id: string) => void;
  decreaseQuantity: (id: string) => void;
};

const SchulboxContext = createContext<SchulboxContextType | undefined>(undefined);

export const SchulboxProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<SchulboxItem[]>(() => {
    if (typeof window !== "undefined") {
      try {
        return JSON.parse(localStorage.getItem("schulbox-items") || "[]");
      } catch {
        return [];
      }
    }
    return [];
  });

  const [justAdded, setJustAdded] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("schulbox-items", JSON.stringify(items));
    }
  }, [items]);

  const addToBox = useCallback((item: SchulboxItem) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i
        );
      } else {
        return [...prev, { ...item }];
      }
    });

    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 400);
  }, []);

  const removeFromBox = useCallback((id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const clearBox = useCallback(() => {
    setItems([]);
    localStorage.removeItem("schulbox-items");
  }, []);

  const increaseQuantity = useCallback((id: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  }, []);

  const decreaseQuantity = useCallback((id: string) => {
    setItems((prev) =>
      prev
        .map((item) =>
          item.id === id ? { ...item, quantity: item.quantity - 1 } : item
        )
        .filter((item) => item.quantity > 0)
    );
  }, []);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <SchulboxContext.Provider
      value={{
        items,
        addToBox,
        removeFromBox,
        clearBox,
        totalItems,
        justAdded,
        increaseQuantity,
        decreaseQuantity,
      }}
    >
      {children}
    </SchulboxContext.Provider>
  );
};

export const useSchulbox = () => {
  const context = useContext(SchulboxContext);
  if (!context) {
    throw new Error("useSchulbox must be used within a SchulboxProvider");
  }
  return context;
};
