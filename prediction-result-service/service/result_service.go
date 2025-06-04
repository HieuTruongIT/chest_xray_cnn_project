package service

import (
	"prediction-result-service/model"
	"prediction-result-service/repository"
	"time"
)

type ResultService struct {
	Repo *repository.ResultRepository
}

func NewResultService(repo *repository.ResultRepository) *ResultService {
	return &ResultService{Repo: repo}
}

func (s *ResultService) SaveResult(uid string, prediction interface{}) error {
	result := model.Result{
		UID:        uid,
		Prediction: prediction,
		CreatedAt:  time.Now(),
	}
	return s.Repo.SaveResult(result)
}

func (s *ResultService) GetResultsByUID(uid string) ([]model.Result, error) {
	return s.Repo.GetResultsByUID(uid)
}
