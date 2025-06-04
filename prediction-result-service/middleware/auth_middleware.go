package middleware

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func AuthMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		uid := c.GetHeader("X-UID")
		if uid == "" {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Missing UID header"})
			c.Abort()
			return
		}
		c.Set("uid", uid)
		c.Next()
	}
}
