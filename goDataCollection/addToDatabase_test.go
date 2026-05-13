package main

import (
	"sync"
	"testing"
)

func TestAddToDatabase(t *testing.T) {
	var databaseWg sync.WaitGroup
	// Create a test product
	product := Product{
		ProductID:        35654174,
		ProductName:      "Test Product",
		ProductNameThin:  "Test Product Thin",
		ProductCountry:   "Test Country",
		ProductCatergory: "Test Catergory",
		ProductInfo:      "Test Info",
		ProductImageURL:  "Test Image URL",
		ProductVolume:    0.7,
		ProductPrice:     106,
		ProductAlcohol:   0.6,
		ProductApk:       0.6,
		ProductStockInfo: StockInfo{
			Stock: 1,
			Shelf: "-",
		},
		StoreID: 2,
	}
	databaseWg.Add(1)

	// Call AddProductToDatabase with the test product
	AddProductToDatabase(product)
	defer databaseWg.Done()

	// Check if the product was correctly added to the database
	// This will depend on how your database is structured
	// For example, you might fetch the product from the database and compare it to the original product
}

//https://flowbite.com/docs/components/drawer/
