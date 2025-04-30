import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useRef,
  useCallback,
} from "react";
import { createClient } from "@supabase/supabase-js";

export type CartItem = {
  id: string;
  title: string;
  quantity: number;
  price: number;
  image: string;
};

type CartContextType = {
  items: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, amount: number) => void;
  totalItems: number;
  justAdded: boolean;
  setItems: React.Dispatch<React.SetStateAction<CartItem[]>>;
  clearCart: () => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

// Globale Sync-Funktion zum Triggern außerhalb der Komponente
type SyncCartFn = () => Promise<void>;
let syncCartGlobal: SyncCartFn | null = null;
export const triggerCartSync = async () => {
  if (syncCartGlobal) await syncCartGlobal();
};

// Sicheres JSON-Parsing mit Fallback
const safeParse = (raw: string | null): CartItem[] => {
  try {
    return raw ? JSON.parse(raw) : [];
  } catch {
    if (typeof window !== "undefined") {
      localStorage.removeItem("cart-items");
    }
    return [];
  }
};

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    if (typeof window !== "undefined") {
      return safeParse(localStorage.getItem("cart-items"));
    }
    return [];
  });

  const [justAdded, setJustAdded] = useState(false);
  const suppressSave = useRef(false);

  // Supabase-Client einmalig erzeugen (clientseitig)
  const supabase = useRef(
    typeof window !== "undefined"
      ? createClient(window.ENV?.SUPABASE_URL ?? "", window.ENV?.SUPABASE_ANON_KEY ?? "")
      : null
  ).current;



  // 🌀 Sync bei Login: Supabase + LocalStorage mergen
  useEffect(() => {
    const syncCart: SyncCartFn = async () => {
      if (!supabase || typeof window === "undefined") return;

      const { data: { user }, error } = await supabase.auth.getUser();
      if (error || !user) return;

      const syncFlagKey = `cart-synced-${user.id}`;
      if (localStorage.getItem(syncFlagKey) === "true") return;
      localStorage.setItem(syncFlagKey, "true");
      

      const { data, error: fetchError } = await supabase
        .from("warenkorb")
        .select("items")
        .eq("user_id", user.id)
        .single();

      const supabaseItems: CartItem[] = data?.items || [];
      const localItems = safeParse(localStorage.getItem("cart-items"));

// 🔄 Robuster Merge von Supabase- und LocalItems
const mergedMap = new Map<string, CartItem>();

// Supabase-Warenkorb als Basis
for (const item of supabaseItems) {
  mergedMap.set(item.id, { ...item });
}

// LocalStorage-Warenkorb hinzufügen oder Menge summieren
for (const item of localItems) {
  if (mergedMap.has(item.id)) {
    const existing = mergedMap.get(item.id)!;
    mergedMap.set(item.id, {
      ...existing,
      quantity: existing.quantity + item.quantity,
    });
  } else {
    mergedMap.set(item.id, { ...item });
  }
}

const merged = Array.from(mergedMap.values());



      await supabase.from("warenkorb").upsert({
        user_id: user.id,
        items: merged,
        updated_at: new Date().toISOString(),
      });

      setItems(merged);
      localStorage.removeItem("cart-items");
    };

    syncCartGlobal = syncCart;
    syncCart();
  }, [supabase]);

  // 💾 Speichern bei Änderungen (außer bei suppressSave)
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("cart-items", JSON.stringify(items));
    }

    if (suppressSave.current || items.length === 0 || !supabase) return;

    const save = async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error || !user) return;

      await supabase.from("warenkorb").upsert({
        user_id: user.id,
        items,
        updated_at: new Date().toISOString(),
      });
    };

    save();
  }, [items, supabase]);

  // 🛒 Funktionen
  const addToCart = useCallback((item: CartItem) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i
        );
      } else {
        return [...prev, { ...item, quantity: 1 }];
      }
    });

    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 400);
  }, []);

  const removeFromCart = useCallback((id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const updateQuantity = useCallback((id: string, amount: number) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + amount) }
          : item
      )
    );
  }, []);

  const clearCart = useCallback(() => {
    suppressSave.current = true;
    setItems([]);
    if (typeof window !== "undefined") {
      localStorage.removeItem("cart-items");

    // 🔄 Entferne Sync-Flag für den eingeloggten User
    const userId = localStorage.getItem("sb-user-id");
    if (userId) {
      localStorage.removeItem(`cart-synced-${userId}`);
      }
    }
    setTimeout(() => {
      suppressSave.current = false;
    }, 500);
  }, []);

  // 🔴 CustomEvent: remove-from-cart
  useEffect(() => {
    const handleRemove = (event: Event) => {
      const id = (event as CustomEvent).detail;
      removeFromCart(id);
    };
    window.addEventListener("remove-from-cart", handleRemove);
    return () => window.removeEventListener("remove-from-cart", handleRemove);
  }, [removeFromCart]);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        totalItems,
        justAdded,
        setItems,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

// Export Hook
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
