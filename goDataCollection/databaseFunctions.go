package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"
)

/* For production */
var backendURL = "http://backend:3000"

/*For testing*/
//var backendURL = "http://localhost:3000"

func AddStoreToDatabase(store Store) {

	jsonData := map[string]interface{}{
		"id":   store.StoreID,
		"name": store.StoreName,
	}
	fmt.Println("Adding store to database with ID:", store.StoreID)

	// Marshal the map to JSON bytes
	jsonBytes, err := json.Marshal(jsonData)
	if err != nil {
		fmt.Println("Error marshaling JSON:", err)
		return
	}
	resp, err := http.Post(backendURL+"/stores", "application/json", bytes.NewBuffer(jsonBytes))
	if err != nil {
		fmt.Println("Error sending POST request:", err)
		return
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK && resp.StatusCode != http.StatusCreated {
		fmt.Printf("Unexpected status code adding store to database: %d\n", resp.StatusCode)
		return
	}
}

func AddProductToDatabase(product Product) {
	// Create a new product structure to send

	fmt.Println("Adding product to database:", product.ProductName, "with ID:", product.ProductID)
	productToAdd := DatabaseProduct{
		ID:              product.ProductID,
		ProductName:     product.ProductName,
		ProductNameThin: product.ProductNameThin,
		ProductCountry:  product.ProductCountry,
		ProductCategory: product.ProductCatergory,
		ProductInfo:     product.ProductInfo,
		ProductImageURL: product.ProductImageURL,
		ProductVolume:   product.ProductVolume,
		ProductPrice:    product.ProductPrice,
		ProductAlcohol:  product.ProductAlcohol,
		ProductApk:      product.ProductApk,
	}

	// Convert product to JSON
	jsonData, err := json.Marshal(productToAdd)
	if err != nil {
		fmt.Println("Error marshaling JSON:", err)
		return
	}

	// Create HTTP POST request
	resp, err := http.Post(backendURL+"/products", "application/json", bytes.NewBuffer(jsonData))
	if err != nil {
		fmt.Println("Error sending POST request:", err)
		return
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK && resp.StatusCode != http.StatusCreated {
		fmt.Printf("Unexpected status code adding product to database: %d\n", resp.StatusCode)
		return
	}
}

func AddStockInfoToDatabase(ProductStockInfo StockInfo, storeID int, productId int) {
	// Create a new product structure to send

	productToAdd := DatabaseStock{
		ProductId: productId,
		StoreId:   storeID,
		Stock:     ProductStockInfo.Stock,
		Location:  ProductStockInfo.Shelf,
	}

	// Convert product to JSON
	jsonData, err := json.Marshal(productToAdd)
	if err != nil {
		fmt.Println("Error marshaling JSON:", err)
		return
	}

	// Create HTTP POST request
	resp, err := http.Post(backendURL+"/stock", "application/json", bytes.NewBuffer(jsonData))
	if err != nil {
		fmt.Println("Error sending POST request:", err)
		return
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK && resp.StatusCode != http.StatusCreated {
		fmt.Printf("Unexpected status code adding stock info to database: %d\n", resp.StatusCode)
		return
	}
}
