package main

import (
	"log"
	"os"

	"report-history-service/config"
	"report-history-service/handler"
	"report-history-service/repository"
	"report-history-service/router"
	"report-history-service/service"
)

func main() {
	config.ConnectMongo()

	reportRepo := repository.NewReportRepository()
	reportService := service.NewReportService(reportRepo)
	reportHandler := handler.NewReportHandler(reportService)

	r := router.NewRouter(reportHandler)

	port := config.ServerPort
	if port == "" {
		port = "8082"
	}

	log.Println(" Starting server at port:", port)

	if err := r.Run(":" + port); err != nil {
		log.Fatalf(" Failed to start server: %v", err)
		os.Exit(1)
	}
}
