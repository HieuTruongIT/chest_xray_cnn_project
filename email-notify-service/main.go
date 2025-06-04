package main

import (
	"log"
	"server-email-notification/routers"

	"github.com/joho/godotenv"
)

func main() {
	err := godotenv.Load()
	if err != nil {
		log.Println("Warning: Không tìm thấy file .env hoặc không thể load")
	}

	r := routers.SetupRouter()
	if err := r.Run(":8083"); err != nil {
		log.Fatal("Không thể chạy server:", err)
	}
}
