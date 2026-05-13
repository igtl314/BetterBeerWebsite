import { Beer } from "./beer";

export type Store = {
  id: number;
  name: string;
};

export type StockInfo = {
  ProductId: number;
  StoreId: number;
  Stock: number;
  Location: string;
};

export type StockInfoWithProduct = StockInfo & {
  product: Beer;
};

export type StoreWithStockInfo = Store & {
  stockInfo: StockInfoWithProduct[];
};
