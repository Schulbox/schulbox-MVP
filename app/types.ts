// app/types.ts

// Mögliche Benutzerrollen
export type UserRole = "lehrkraft" | "eltern" | "admin";

// Typ für das Benutzerprofil (wie im Loader verwendet)
export type User = {
  vorname?: string;
  nachname?: string;
  role?: UserRole;
  email: string;
} | null;

export type LoginResponse = {
  success?: boolean;
  tokens?: {
    refresh_token: string;
    access_token: string;
  };
  error?: string;
};

export type Product = {
  id: string;
  title: string;
  description: string;
  handle: string;
  images: {
    edges: {
      node: {
        url: string;
        altText: string | null;
      };
    }[];
  };
  priceRange: {
    minVariantPrice: {
      amount: string;
      currencyCode: string;
    };
  };
};
