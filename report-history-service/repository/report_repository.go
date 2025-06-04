package repository

import (
	"context"
	"report-history-service/config"
	"report-history-service/model"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/gridfs"
)

type ReportRepository struct {
	collection *mongo.Collection
	client     *mongo.Client
}

func NewReportRepository() *ReportRepository {
	return &ReportRepository{
		collection: config.GetMongoCollection("reports"),
		client:     config.MongoClient,
	}
}

func (r *ReportRepository) UploadPDFToGridFS(ctx context.Context, fileName string, data []byte) (primitive.ObjectID, error) {
	bucket, err := gridfs.NewBucket(r.client.Database(config.DbName))
	if err != nil {
		return primitive.NilObjectID, err
	}
	uploadStream, err := bucket.OpenUploadStream(fileName)
	if err != nil {
		return primitive.NilObjectID, err
	}
	defer uploadStream.Close()
	_, err = uploadStream.Write(data)
	if err != nil {
		return primitive.NilObjectID, err
	}
	return uploadStream.FileID.(primitive.ObjectID), nil
}

func (r *ReportRepository) Save(ctx context.Context, report *model.Report) error {
	report.CreatedAt = time.Now()
	report.UpdatedAt = time.Now()
	_, err := r.collection.InsertOne(ctx, report)
	return err
}

func (r *ReportRepository) FindByUid(ctx context.Context, uid string) ([]model.Report, error) {
	filter := bson.M{"uid": uid}
	cursor, err := r.collection.Find(ctx, filter)
	if err != nil {
		return nil, err
	}
	defer cursor.Close(ctx)
	var reports []model.Report
	for cursor.Next(ctx) {
		var report model.Report
		if err := cursor.Decode(&report); err != nil {
			return nil, err
		}
		reports = append(reports, report)
	}
	return reports, nil
}

func (r *ReportRepository) DeleteById(ctx context.Context, id primitive.ObjectID) error {
	res, err := r.collection.DeleteOne(ctx, bson.M{"_id": id})
	if err != nil {
		return err
	}
	if res.DeletedCount == 0 {
		return mongo.ErrNoDocuments
	}
	return nil
}

func (r *ReportRepository) UpdateFileName(ctx context.Context, id primitive.ObjectID, newFileName string) error {
	res, err := r.collection.UpdateOne(ctx,
		bson.M{"_id": id},
		bson.M{"$set": bson.M{"fileName": newFileName, "updatedAt": time.Now()}},
	)
	if err != nil {
		return err
	}
	if res.MatchedCount == 0 {
		return mongo.ErrNoDocuments
	}
	return nil
}
