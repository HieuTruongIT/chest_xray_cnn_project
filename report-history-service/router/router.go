package router

import (
	"report-history-service/handler"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func NewRouter(reportHandler *handler.ReportHandler) *gin.Engine {
	r := gin.Default()

	config := cors.Config{
		AllowOrigins:     []string{"http://localhost:3000"},
		AllowMethods:     []string{"POST", "GET", "PUT", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Authorization", "Content-Type", "X-User-UID"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}
	r.Use(cors.New(config))

	r.Use(handler.AuthMiddleware())

	api := r.Group("/api/v1")
	{
		api.POST("/report/save", reportHandler.SaveReport)
		api.GET("/report/myreport", reportHandler.GetMyReports)
		api.DELETE("/report/delete/:id", reportHandler.DeleteReport)
		api.PUT("/report/rename/:id", reportHandler.RenameReport)
	}

	return r
}
