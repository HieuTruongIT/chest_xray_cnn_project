package middleware

// import (
// 	"context"
// 	"firebase.google.com/go/auth"
// 	"github.com/gin-gonic/gin"
// 	"net/http"
// )

// type FirebaseMiddleware struct {
// 	AuthClient *auth.Client
// }

// func NewFirebaseMiddleware(authClient *auth.Client) *FirebaseMiddleware {
// 	return &FirebaseMiddleware{AuthClient: authClient}
// }

// func (m *FirebaseMiddleware) AuthRequired() gin.HandlerFunc {
// 	return func(c *gin.Context) {
// 		authHeader := c.GetHeader("Authorization")
// 		if authHeader == "" {
// 			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Missing Authorization header"})
// 			return
// 		}

// 		idToken := authHeader
// 		if len(idToken) > 7 && idToken[:7] == "Bearer " {
// 			idToken = idToken[7:]
// 		}

// 		token, err := m.AuthClient.VerifyIDToken(context.Background(), idToken)
// 		if err != nil {
// 			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Invalid ID token"})
// 			return
// 		}

// 		// Set uid vào context
// 		c.Set("uid", token.UID)

// 		c.Next()
// 	}
// }
