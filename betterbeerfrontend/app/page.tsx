import { Store } from "@/types/store";
import StoreCard from "./_compoments/StoreCard";
import { fetchStores } from "./_actions/stores";

export default async function Home() {
  let stores: Store[] = [];
  let error: string | null = null;

  try {
    console.log('Fetching stores'); 
    stores = await fetchStores();
  } catch (err) {
    error = err instanceof Error ? err.message : 'An error occurred';
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center p-8 bg-white rounded-lg shadow-lg max-w-md">
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-danger-600 mb-3">Error</h2>
          <p className="text-default-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Better Beer Stores
          </h1>
          <p className="text-xl text-default-600 max-w-2xl mx-auto">
            Discover amazing beer selections at stores near you
          </p>
        </div>

        {stores.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🍺</div>
            <p className="text-xl text-default-500">No stores available at the moment</p>
            <p className="text-sm text-default-400 mt-2">Check back soon for updates!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {stores.map((store) => (
              <StoreCard key={store.id} store={store} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
