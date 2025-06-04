package service

import (
	"context"
	"firebase-auth-server/model"
	"firebase-auth-server/repository"
)

type ProfileService struct {
	Repo *repository.ProfileRepository
}

func NewProfileService(repo *repository.ProfileRepository) *ProfileService {
	return &ProfileService{Repo: repo}
}

func (s *ProfileService) UpdateProfile(ctx context.Context, uid string, updates map[string]interface{}) error {
	return s.Repo.UpsertProfile(ctx, uid, updates)
}

func (s *ProfileService) GetUserProfile(ctx context.Context, uid string) (*model.Profile, error) {
	return s.Repo.FindProfileByUID(ctx, uid)
}
