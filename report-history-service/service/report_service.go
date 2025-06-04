package service

import (
	"context"
	"errors"
	"report-history-service/model"
	"report-history-service/repository"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type ReportService struct {
	repo *repository.ReportRepository
}

func NewReportService(repo *repository.ReportRepository) *ReportService {
	return &ReportService{repo: repo}
}

func (s *ReportService) SaveReport(ctx context.Context, report *model.Report, pdfData []byte) error {
	if report.Uid == "" || report.FileName == "" || len(pdfData) == 0 {
		return errors.New("invalid report data")
	}
	fileID, err := s.repo.UploadPDFToGridFS(ctx, report.FileName, pdfData)
	if err != nil {
		return err
	}
	report.PdfFileID = fileID
	report.Status = "Đã hoàn thành"
	return s.repo.Save(ctx, report)
}

func (s *ReportService) GetReportsByUid(ctx context.Context, uid string) ([]model.Report, error) {
	return s.repo.FindByUid(ctx, uid)
}

func (s *ReportService) DeleteReportById(ctx context.Context, idStr string) error {
	id, err := primitive.ObjectIDFromHex(idStr)
	if err != nil {
		return errors.New("invalid report id")
	}
	return s.repo.DeleteById(ctx, id)
}

func (s *ReportService) RenameReport(ctx context.Context, idStr, newFileName string) error {
	id, err := primitive.ObjectIDFromHex(idStr)
	if err != nil {
		return errors.New("invalid report id")
	}
	return s.repo.UpdateFileName(ctx, id, newFileName)
}
