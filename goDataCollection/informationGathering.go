package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"image/png"
	"net/http"
	"os"
	"sync"

	"github.com/chai2010/webp"
)

func ImageDownload(product Product, headers *http.Header) []byte {
	var buf bytes.Buffer

	if len(product.Images) > 0 {
		unencodedImg, _ := MakeRequest("GET", product.Images[0].ImageURL+"_100.png?q=75&w=128", "", "", *headers)
		img, err := png.Decode(bytes.NewReader(unencodedImg))
		if err != nil {
			fmt.Println("Error decoding image:", err)
			return []byte{}
		}

		if err := webp.Encode(&buf, img, &webp.Options{Quality: 80}); err != nil {
			fmt.Println("Error encoding image as WebP:", err)
			return []byte{}
		}
		return buf.Bytes()
	} else {
		fmt.Println("Error: no images found for product", product.ProductName, "with ID:", product.ProductID)
		return []byte{}
	}
}

func FetchStoreName(storeID int, headers *http.Header) Store {
	if name, ok := storeNames[storeID]; ok {
		return Store{StoreID: storeID, StoreName: name}
	}
	storeURL := fmt.Sprintf("https://api-extern.systembolaget.se/sb-api-ecommerce/v1/store/%04d", storeID)
	body, err := MakeRequest("GET", storeURL, "", "", *headers)
	if err != nil {
		fmt.Println("Error fetching store info:", err)
		return Store{StoreID: storeID, StoreName: fmt.Sprintf("%d", storeID)}
	}
	var storeResp StoreResponse
	if err := json.Unmarshal(body, &storeResp); err != nil {
		fmt.Println("Error unmarshalling store info:", err)
		return Store{StoreID: storeID, StoreName: fmt.Sprintf("%d", storeID)}
	}
	return Store{StoreID: storeID, StoreName: storeResp.StoreName}
}

func FetchStockInfo(product Product, headers *http.Header) StockInfo {
	var StockResponse StockInfo
	var defaultStockResponse = StockInfo{
		Stock: 0,
		Shelf: "-",
	}

	stockURL := fmt.Sprintf("https://api-systembolaget.azure-api.net/sb-api-ecommerce/v1/stockbalance/store/%04d/%d", product.StoreID, product.ProductID)
	body, err := MakeRequest("GET", stockURL, "", "", *headers)

	if err != nil {
		fmt.Println("Error making request:", err)
		return defaultStockResponse
	}
	if err := json.Unmarshal(body, &StockResponse); err != nil {
		fmt.Println("Error unmarshalling JSON:", err)
		return defaultStockResponse
	}
	StockResponse.Shelf = StockResponse.Shelf[:5]

	return StockResponse
}

func FetchProductData(product Product, wg *sync.WaitGroup, headers *http.Header, databasewg *sync.WaitGroup, productChan chan Product) {
	var imageData []byte
	var apk float64

	product.ProductStockInfo = FetchStockInfo(product, headers)
	/*Download image and save to S3*/
	//Check if image already exists
	filename := fmt.Sprintf("/app/images/%d.webp", product.ProductID)
	//REDO
	if _, err := os.Stat(filename); err != nil {
		imageData = ImageDownload(product, headers)
		//product.ProductImageURL = SaveImageToS3(product, imageData)
		SaveToFile(filename, imageData)
	}
	product.ProductImageURL = fmt.Sprintf("%d.webp", product.ProductID)

	apk = (product.ProductAlcohol / 100 * product.ProductVolume) / product.ProductPrice
	product.ProductApk = RoundToDecimal(apk, 1)
	/*Add to database*/
	databasewg.Add(1)
	/*Comment out for testing*/
	productChan <- product

	defer wg.Done()

}
