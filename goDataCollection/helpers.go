package main

import (
	"bytes"
	"fmt"
	"io"
	"net/http"
	"os"
	"strconv"
	"time"
)

func StringInSlice(str string, list []string) bool {
	for _, v := range list {
		if v == str {
			return true
		}
	}
	return false
}

func RoundToDecimal(value float64, decimalPlaces int) float64 {
	format := "%." + strconv.Itoa(decimalPlaces) + "f"
	strValue := fmt.Sprintf(format, value)
	roundedValue, err := strconv.ParseFloat(strValue, 64)
	if err != nil {
		fmt.Println("Error rounding value:", err)
		return value // Return the original value in case of an error
	}
	return roundedValue
}

func MakeRequest(method, url, querystring, payload string, headers http.Header) ([]byte, error) {
	req, err := http.NewRequest(method, fmt.Sprintf("%s?%s", url, querystring), bytes.NewBufferString(payload))
	if err != nil {
		return nil, fmt.Errorf("error creating request: %w", err)
	}

	req.Header = headers

	client := &http.Client{
		Timeout: time.Second * 20,
	}

	resp, err := client.Do(req)
	if err != nil {
		return nil, fmt.Errorf("error making request: %w", err)
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, fmt.Errorf("error reading response body: %w", err)
	}

	return body, nil
}

func SaveToFile(filename string, data []byte) error {
	return os.WriteFile(filename, data, 0644)
}

func ToInt(s string) int {
	i, err := strconv.Atoi(s)
	if err != nil {
		fmt.Println("Error converting string to int:", err)
		return 0
	}
	return i
}
