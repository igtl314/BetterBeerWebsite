# Go Data collection
Welcome to my Systembolaget beer download tool. It is made possible by using the not so "private" oscip sub key that is possible to find on the browser request made to systembolaget.

## Setup
To install the go depdencancy run.
```bash
go mod download
go get github.com/chai2010/webp
```
To then actually run the datacollection double check the backendURL in the function [databaseFile](./databaseFunctions.go)

