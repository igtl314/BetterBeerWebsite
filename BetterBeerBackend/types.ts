export type Product = {
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
};

export type Store = {
    id: number;
    name: string;
}
export type StockInfo = {
    ProductId: number;
    StoreId: number;
    Stock: number;
    Location: string;
};

export type User = {
    email: string;
    name: string;
}