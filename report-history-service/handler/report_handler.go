package handler

import (
	"encoding/base64"
	"net/http"
	"report-history-service/model"
	"report-history-service/service"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/mongo"
)

type ReportHandler struct {
	service *service.ReportService
}

func NewReportHandler(svc *service.ReportService) *ReportHandler {
	return &ReportHandler{service: svc}
}

func AuthMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		uid := c.GetHeader("X-User-UID")
		if uid == "" {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Missing X-User-UID header"})
			return
		}
		c.Set("uid", uid)
		c.Next()
	}
}

func (h *ReportHandler) SaveReport(c *gin.Context) {
	uid, _ := c.Get("uid")
	type SaveRequest struct {
		FileName  string `json:"fileName"`
		PdfBase64 string `json:"pdfBase64"`
	}
	var req SaveRequest
	if err := c.ShouldBindJSON(&req); err != nil || req.FileName == "" || req.PdfBase64 == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request body"})
		return
	}
	pdfData, err := base64.StdEncoding.DecodeString(req.PdfBase64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid base64 PDF data"})
		return
	}
	report := &model.Report{Uid: uid.(string), FileName: req.FileName}
	if err := h.service.SaveReport(c.Request.Context(), report, pdfData); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save report: " + err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Report saved successfully"})
}

func (h *ReportHandler) GetMyReports(c *gin.Context) {
	uid, _ := c.Get("uid")
	reports, err := h.service.GetReportsByUid(c.Request.Context(), uid.(string))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get reports: " + err.Error()})
		return
	}
	var resp []gin.H
	for _, r := range reports {
		resp = append(resp, gin.H{
			"id":        r.ID.Hex(),
			"fileName":  r.FileName,
			"status":    r.Status,
			"createdAt": r.CreatedAt.Format("2006-01-02 15:04:05"),
		})
	}
	c.JSON(http.StatusOK, resp)
}

func (h *ReportHandler) DeleteReport(c *gin.Context) {
	id := c.Param("id")
	if id == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Missing report id"})
		return
	}
	err := h.service.DeleteReportById(c.Request.Context(), id)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			c.JSON(http.StatusNotFound, gin.H{"error": "Report not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete report: " + err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Report deleted successfully"})
}

func (h *ReportHandler) RenameReport(c *gin.Context) {
	id := c.Param("id")
	if id == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Missing report id"})
		return
	}
	type RenameRequest struct {
		NewFileName string `json:"newFileName"`
	}
	var req RenameRequest
	if err := c.ShouldBindJSON(&req); err != nil || req.NewFileName == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request body"})
		return
	}
	err := h.service.RenameReport(c.Request.Context(), id, req.NewFileName)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			c.JSON(http.StatusNotFound, gin.H{"error": "Report not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to rename report: " + err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Rename successful"})
}
