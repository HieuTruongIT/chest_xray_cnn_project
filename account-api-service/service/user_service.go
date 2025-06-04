package service

import (
	"context"

	"firebase-auth-server/model"
	"firebase-auth-server/repository"
)

type UserService struct {
	UserRepo *repository.UserRepository
}

func NewUserService(repo *repository.UserRepository) *UserService {
	return &UserService{
		UserRepo: repo,
	}
}

func (s *UserService) SaveUser(ctx context.Context, user model.User) error {
	existingUser, err := s.UserRepo.FindByUID(ctx, user.UID)
	if err != nil {
		return err
	}

	if existingUser == nil {
		return s.UserRepo.CreateUser(ctx, user)
	}

	return nil
}
