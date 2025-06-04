package repository

import (
	"context"
	"prediction-result-service/db"
	"prediction-result-service/model"
	"time"

	"go.mongodb.org/mongo-driver/bson"
)

type ResultRepository struct{}

func (r *ResultRepository) SaveResult(result model.Result) error {
	collection := db.MongoClient.Database(db.MongoDBName).Collection("results")
	_, err := collection.InsertOne(context.TODO(), result)
	return err
}

func (r *ResultRepository) GetResultsByUID(uid string) ([]model.Result, error) {
	collection := db.MongoClient.Database(db.MongoDBName).Collection("results")
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	cursor, err := collection.Find(ctx, bson.M{"uid": uid})
	if err != nil {
		return nil, err
	}

	var results []model.Result
	if err := cursor.All(ctx, &results); err != nil {
		return nil, err
	}

	return results, nil
}
