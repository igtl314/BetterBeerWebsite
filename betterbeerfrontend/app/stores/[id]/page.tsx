'use client';

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { StockInfoWithProduct, Store } from "@/types/store";
import { Beer } from "@/types/beer";
import BeerCard from "../../_compoments/BeerCard";
import { Spinner, Button, Pagination, Select, SelectItem } from "@heroui/react";
import { fetchStoreById } from "@/app/_actions/stores";
import Link from "next/link";

export default function StorePage() {
  const params = useParams();
  const storeId = params.id as string;

  const [store, setStore] = useState<Store | null>(null);
  const [products, setProducts] = useState<Beer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(30);

  useEffect(() => {
    const fetchStoreData = async () => {
      try {
        // Fetch store details with all products included
        //Make this into a server action
        const storeResponse = await fetchStoreById(storeId);
        setStore(storeResponse);

        // Extract products from the store data
        if (storeResponse.stockInfo) {
          const beers = storeResponse.stockInfo.map((item: StockInfoWithProduct) => item.product);
          setProducts(beers);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    if (storeId) {
      fetchStoreData();
    }
  }, [storeId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Spinner size="lg" color="primary" />
          <p className="mt-4 text-gray-600">Loading store...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center p-8 bg-white rounded-lg shadow-lg max-w-md">
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-danger-600 mb-3">Error</h2>
          <p className="text-default-600 mb-6">{error}</p>
          <Button color="primary" variant="shadow" as={Link} href="/">
            Back to Stores
          </Button>
        </div>
      </div>
    );
  }

  // Calculate pagination
  const totalPages = itemsPerPage === 0 ? 1 : Math.ceil(products.length / itemsPerPage);
  const startIndex = itemsPerPage === 0 ? 0 : (currentPage - 1) * itemsPerPage;
  const endIndex = itemsPerPage === 0 ? products.length : startIndex + itemsPerPage;
  const displayedProducts = products.slice(startIndex, endIndex);

  const handleItemsPerPageChange = (value: string) => {
    const newValue = value === "all" ? 0 : parseInt(value);
    setItemsPerPage(newValue);
    setCurrentPage(1); // Reset to first page when changing items per page
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Button 
            color="primary" 
            variant="shadow" 
            as={Link}
            href="/"
            className="mb-6"
          >
            ← Back to Stores
          </Button>
          
          {store && (
            <div className="text-center mb-6">
              <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-3">
                {store.name}
              </h1>
              <p className="text-xl text-default-600">
                {products.length} Available Products
              </p>
            </div>
          )}

          {products.length > 0 && (
            <div className="flex justify-between items-center mb-6 bg-white/80 backdrop-blur-sm p-4 rounded-lg shadow-sm">
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-default-700">Items per page:</span>
                <Select
                  size="sm"
                  className="w-32"
                  selectedKeys={[itemsPerPage === 0 ? "all" : itemsPerPage.toString()]}
                  onChange={(e) => handleItemsPerPageChange(e.target.value)}
                >
                  <SelectItem key="30">30</SelectItem>
                  <SelectItem key="50">50</SelectItem>
                  <SelectItem key="all">All</SelectItem>
                </Select>
              </div>
              <div className="text-sm text-default-600">
                Showing {startIndex + 1}-{Math.min(endIndex, products.length)} of {products.length}
              </div>
            </div>
          )}
        </div>

        {products.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🍺</div>
            <p className="text-xl text-default-500">No products available in this store</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 max-w-7xl mx-auto mb-8">
              {displayedProducts.map((beer) => (
                <BeerCard key={beer.ID} beer={beer} />
              ))}
            </div>

            {itemsPerPage > 0 && totalPages > 1 && (
              <div className="flex justify-center mt-8">
                <Pagination
                  total={totalPages}
                  page={currentPage}
                  onChange={setCurrentPage}
                  showControls
                  color="primary"
                  size="lg"
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
