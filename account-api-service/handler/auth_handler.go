package handler

import (
	"firebase-auth-server/model"
	"firebase-auth-server/service"
	"net/http"

	"github.com/gin-gonic/gin"
)

type AuthHandler struct {
	userService    *service.UserService
	profileService *service.ProfileService
}

func NewAuthHandler(userService *service.UserService, profileService *service.ProfileService) *AuthHandler {
	return &AuthHandler{
		userService:    userService,
		profileService: profileService,
	}
}

func (h *AuthHandler) SaveUser(c *gin.Context) {
	var user model.User
	if err := c.ShouldBindJSON(&user); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request"})
		return
	}

	err := h.userService.SaveUser(c.Request.Context(), user)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save user"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "User saved"})
}

func (h *AuthHandler) UpdateProfile(c *gin.Context) {
	uid := c.GetHeader("X-User-UID")
	if uid == "" {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Missing user UID"})
		return
	}

	var updates map[string]interface{}
	if err := c.ShouldBindJSON(&updates); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request body"})
		return
	}

	err := h.profileService.UpdateProfile(c.Request.Context(), uid, updates)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update profile"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Profile updated successfully"})
}

func (h *AuthHandler) GetProfile(c *gin.Context) {
	uid := c.GetHeader("X-User-UID")

	if uid == "" {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Missing user UID"})
		return
	}

	profile, err := h.profileService.GetUserProfile(c.Request.Context(), uid)
	if err != nil {
		c.JSON(500, gin.H{"error": err.Error()})
		return
	}
	if profile == nil {
		c.JSON(404, gin.H{"error": "Profile not found"})
		return
	}

	c.JSON(200, profile)
}
