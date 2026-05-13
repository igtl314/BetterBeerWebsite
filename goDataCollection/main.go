package main

import (
	"encoding/json"
	"fmt"
	_ "image/jpeg"
	"net/http"
	"sync"
	"time"
)

type StockInfo struct {
	Stock int    `json:"stock"`
	Shelf string `json:"shelf"`
}

type Response struct {
	StoreID  string
	Products []Product `json:"products"`
	Metadata metadata  `json:"metadata"`
}

type metadata struct {
	NextPage int `json:"nextPage"`
}

type Images struct {
	ImageURL string `json:"imageUrl"`
}

type Product struct {
	StoreID          int
	ProductID        int      `json:"productId,string"`
	ProductName      string   `json:"productNameBold"`
	ProductNameThin  string   `json:"productNameThin"`
	ProductVolume    float64  `json:"volume"`
	ProductPrice     float64  `json:"price"`
	ProductAlcohol   float64  `json:"alcoholPercentage"`
	ProductCountry   string   `json:"country"`
	ProductCatergory string   `json:"categoryLevel2"`
	ProductInfo      string   `json:"catergoryLevel3"`
	Images           []Images `json:"images"`
	ProductApk       float64
	ProductStockInfo StockInfo
	ProductImageURL  string
}

type DatabaseProduct struct {
	ID              int
	ProductName     string
	ProductNameThin string
	ProductCountry  string
	ProductCategory string
	ProductInfo     string
	ProductImageURL string
	ProductVolume   float64
	ProductPrice    float64
	ProductAlcohol  float64
	ProductApk      float64
}
type DatabaseStock struct {
	StoreId   int
	ProductId int
	Location  string
	Stock     int
}

func main() {
	var wg sync.WaitGroup
	var databasewg sync.WaitGroup
	var Response Response
	var payload string

	productChan := make(chan Product)
	sem := make(chan struct{}, 1)
	page := 1

	url := "https://api-extern.systembolaget.se/sb-api-ecommerce/v1/productsearch/search" // Replace with the actual URL

	headers := http.Header{
		"Authority":                 {"api-extern.systembolaget.se"},
		"Accept":                    {"application/json, text/plain, */*"},
		"Accept-Language":           {"en,en-US;q=0.9,sv-SE;q=0.8,sv;q=0.7,en-GB;q=0.6"},
		"Ocp-Apim-Subscription-Key": {"cfc702aed3094c86b92d6d4ff7a54c84"},
		"Origin":                    {"https://www.systembolaget.se"},
		"Referer":                   {"https://www.systembolaget.se/"},
		"Sec-Ch-Ua":                 {"^\\^"},
	}
	payload = ""

	productsInStore := []int{}
	stores := []int{525}
	filterString := "&CategoryLevel1=%C3%96l&isInStoreAssortmentSearch=True"

	go func() {
		for product := range productChan {
			sem <- struct{}{} // Block if there are already 30 active instances of addToDatabase
			// Start a goroutine that processes the product and signals when it's done
			go func(product Product) {
				AddProductToDatabase(product)
				AddStockInfoToDatabase(product.ProductStockInfo, product.StoreID, product.ProductID)
				defer databasewg.Done()
				<-sem // Signal that this instance of addToDatabase is done

			}(product)
		}
	}()

	/*For loop*/
	for _, store := range stores {
		/*Comment out for testing*/
		AddStoreToDatabase(store)

		//storestr := fmt.Sprintf("storeId=%s", store)
		queryParameters := fmt.Sprintf("storeId=%04d%s", store, filterString)
		for page != -1 {

			fmt.Println("Store:", store, "Page:", page)
			querystring := fmt.Sprintf("%s&page=%d", queryParameters, page)

			body, _ := MakeRequest("GET", url, querystring, payload, headers)
			if err := json.Unmarshal(body, &Response); err != nil {
				fmt.Println("Error unmarshalling JSON:", err)
				return
			}
			/////////////////////

			//Now you can access each "beer" object in the "Products" slice
			for _, Product := range Response.Products {

				wg.Add(1)
				Product.StoreID = store
				productsInStore = append(productsInStore, Product.ProductID)
				go FetchProductData(Product, &wg, &headers, &databasewg, productChan)
			}

			page = Response.Metadata.NextPage
			// Debug purpose: limit to 2 pages

			/*Comment out for testing*/

			// if Response.Metadata.NextPage == 2 {
			// 	break
			// }
			time.Sleep(1 * time.Second)
		}
		time.Sleep(2 * time.Second)
		fmt.Println("Done with store:", store, "products in store:", len(productsInStore))

		wg.Wait()
		databasewg.Wait()
	}
	//ska nu kalla på en funktion som kollar på alla produkter från en viss butik och tar bort de som inte finns i den butiken

	fmt.Println("Program is exiting")
}
