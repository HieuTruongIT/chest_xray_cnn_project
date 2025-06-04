package handlers

import (
	"net/http"
	"server-email-notification/services"

	"github.com/gin-gonic/gin"
)

type NotifyLoginRequest struct {
	Email string `json:"email" binding:"required,email"`
	Name  string `json:"name"`
}

func SendLoginNotificationHandler(c *gin.Context) {
	var req NotifyLoginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Email không hợp lệ hoặc thiếu"})
		return
	}

	err := services.SendLoginNotificationEmail(req.Email, req.Name)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Không gửi được email"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Email xác nhận đã được gửi"})
}
