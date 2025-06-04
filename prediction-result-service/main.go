package main

import (
	"log"
	"prediction-result-service/config"
	"prediction-result-service/db"
	"prediction-result-service/routers"

	"github.com/joho/godotenv"
)

func main() {
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found")
	}

	config.LoadEnv()
	db.InitMongo()

	r := routers.SetupRouter()
	if err := r.Run(":" + config.ServerPort); err != nil {
		log.Fatal(err)
	}
}
