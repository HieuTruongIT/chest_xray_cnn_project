package routers

import (
	"prediction-result-service/handler"
	"prediction-result-service/middleware"
	"prediction-result-service/repository"
	"prediction-result-service/service"

	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func SetupRouter() *gin.Engine {
	r := gin.Default()

	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:3000"},
		AllowMethods:     []string{"GET", "POST"},
		AllowHeaders:     []string{"Content-Type", "X-UID"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))

	resultRepo := &repository.ResultRepository{}
	resultService := service.NewResultService(resultRepo)
	resultHandler := handler.NewResultHandler(resultService)

	v1 := r.Group("/api/v1/results")
	{
		v1.POST("/save", middleware.AuthMiddleware(), resultHandler.SaveResult)
		v1.GET("/:uid", middleware.AuthMiddleware(), resultHandler.GetResultsByUID)
	}

	return r
}
