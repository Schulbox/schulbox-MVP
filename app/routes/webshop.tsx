// app/routes/webshop.tsx
import { useEffect } from "react";
import { useNavigate } from "@remix-run/react";

export default function Webshop() {
  const navigate = useNavigate();
  
  // Redirect to Shopify store
  useEffect(() => {
    // Shopify store URL
    const shopifyStoreUrl = "https://nqwde0-ua.myshopify.com";
    
    // Redirect to Shopify store
    window.location.href = shopifyStoreUrl;
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">🎒 Schulbox Webshop</h1>
      <div className="flex flex-col items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
        <p className="text-gray-600">Sie werden zum Schulbox Webshop weitergeleitet...</p>
      </div>
    </div>
  );
}
