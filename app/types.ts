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