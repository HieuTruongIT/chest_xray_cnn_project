package repository

import (
	"context"
	"firebase-auth-server/model"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type ProfileRepository struct {
	Collection *mongo.Collection
}

func NewProfileRepository(col *mongo.Collection) *ProfileRepository {
	return &ProfileRepository{Collection: col}
}

func (r *ProfileRepository) UpsertProfile(ctx context.Context, uid string, data map[string]interface{}) error {
	filter := bson.M{"uid": uid}
	update := bson.M{"$set": data}
	opts := options.Update().SetUpsert(true)
	_, err := r.Collection.UpdateOne(ctx, filter, update, opts)
	return err
}

func (r *ProfileRepository) FindProfileByUID(ctx context.Context, uid string) (*model.Profile, error) {
	filter := bson.M{"uid": uid}
	var profile model.Profile
	err := r.Collection.FindOne(ctx, filter).Decode(&profile)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			return nil, nil
		}
		return nil, err
	}
	return &profile, nil
}
