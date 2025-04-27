// app/routes/webshop.tsx
import { useState, useEffect } from "react";

export default function Webshop() {
  const [isLoading, setIsLoading] = useState(true);
  
  // Shopify store URL
  const shopifyStoreUrl = "https://nqwde0-ua.myshopify.com";
  
  useEffect(() => {
    // Kurze Verzögerung, um sicherzustellen, dass der iFrame geladen wird
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-6 w-full flex-grow">
        <h1 className="text-2xl font-bold mb-6">🎒 Schulbox Webshop</h1>
        
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
            <p className="text-gray-600">Der Webshop wird geladen...</p>
          </div>
        )}
        
        <div className={`w-full h-[calc(100vh-200px)] ${isLoading ? 'hidden' : 'block'}`}>
          <iframe 
            src={shopifyStoreUrl}
            title="Schulbox Webshop"
            className="w-full h-full border-0 rounded-lg shadow-lg"
            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
            sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
          />
        </div>
        
        <div className="mt-6 text-sm text-gray-500">
          <p>Bei Problemen mit der Anzeige des Webshops können Sie auch direkt <a href={shopifyStoreUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">zum Shopify-Shop</a> wechseln.</p>
        </div>
      </div>
    </div>
  );
}
