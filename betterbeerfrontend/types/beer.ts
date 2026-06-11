export type Beer = {
  ID: number;
  ProductName: string;
  ProductNameThin: string;
  ProductCountry: string;
  ProductCategory: string;
  ProductInfo: string;
  ProductImageURL: string;
  ProductVolume: number;
  ProductPrice: number;
  ProductAlcohol: number;
  ProductApk: number;
}

export type BeerWithStores = Beer & {
  stockInfo: {
    StoreId: number;
    ProductId: number;
    Stock: number;
    Location: string;
    updatedAt: string;
    store: { id: number; name: string };
  }[];
};

export type BeerStock = {
  ID: number;
  ProductID: number;
  Location: string;
  Stock: number;
  StoreID: number;
  updatedAt: string; // ISO date string
}

export type User = {
  ID: number;
  Email: string;
  Name: string;
  Favorites: Beer[];
}