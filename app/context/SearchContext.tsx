import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { useLocation, useNavigate } from "@remix-run/react";

interface SearchContextType {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  triggerSearch: (value: string) => void;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export function SearchProvider({ children }: { children: ReactNode }) {
  const [searchQuery, setSearchQuery] = useState("");
  const location = useLocation();
  const navigate = useNavigate();

  const triggerSearch = (value: string) => {
    setSearchQuery(value);
    const currentPath = location.pathname;

    if (currentPath.startsWith("/konfigurator")) {
      // Bleibe im Konfigurator, kein Redirect
      return;
    } else {
      // Wechsle in den Webshop mit Query-Parameter
      navigate(`/webshop?q=${encodeURIComponent(value)}`);
    }
  };

  return (
    <SearchContext.Provider value={{ searchQuery, setSearchQuery, triggerSearch }}>
      {children}
    </SearchContext.Provider>
  );
}

export function useSearch() {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error("useSearch must be used within a SearchProvider");
  }
  return context;
}
