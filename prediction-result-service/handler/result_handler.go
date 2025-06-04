package handler

import (
	"net/http"
	"prediction-result-service/service"

	"github.com/gin-gonic/gin"
)

type ResultHandler struct {
	Service *service.ResultService
}

func NewResultHandler(s *service.ResultService) *ResultHandler {
	return &ResultHandler{Service: s}
}

func (h *ResultHandler) SaveResult(c *gin.Context) {
	uidIf, exists := c.Get("uid")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "UID not found"})
		return
	}
	uid := uidIf.(string)

	var req struct {
		Prediction interface{} `json:"prediction"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request"})
		return
	}

	if err := h.Service.SaveResult(uid, req.Prediction); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Saved successfully"})
}

func (h *ResultHandler) GetResultsByUID(c *gin.Context) {
	uid := c.Param("uid")
	results, err := h.Service.GetResultsByUID(uid)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch"})
		return
	}

	c.JSON(http.StatusOK, results)
}
