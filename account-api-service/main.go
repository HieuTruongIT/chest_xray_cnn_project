package main

import (
	"firebase-auth-server/config"
	"firebase-auth-server/db"
	"firebase-auth-server/handler"
	"firebase-auth-server/repository"
	"firebase-auth-server/routers"
	"firebase-auth-server/service"
	"log"
)

func main() {
	cfg := config.LoadConfig()
	client := db.Connect(cfg.MongoURI)

	userCol := client.Database("authdb").Collection("users")
	profileCol := client.Database("authdb").Collection("profiles")

	userRepo := repository.NewUserRepository(userCol)
	profileRepo := repository.NewProfileRepository(profileCol)

	userService := service.NewUserService(userRepo)
	profileService := service.NewProfileService(profileRepo)

	authHandler := handler.NewAuthHandler(userService, profileService)

	router := routers.SetupRouter(authHandler)

	log.Println("Server started at :" + cfg.ServerPort)
	if err := router.Run(":" + cfg.ServerPort); err != nil {
		log.Fatal(err)
	}
}
