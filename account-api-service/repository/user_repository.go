package repository

import (
	"context"
	"firebase-auth-server/model"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type UserRepository struct {
	Collection *mongo.Collection
}

func NewUserRepository(col *mongo.Collection) *UserRepository {
	return &UserRepository{Collection: col}
}

func (r *UserRepository) FindByUID(ctx context.Context, uid string) (*model.User, error) {
	filter := bson.M{"uid": uid}
	var u model.User
	err := r.Collection.FindOne(ctx, filter).Decode(&u)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			return nil, nil
		}
		return nil, err
	}
	return &u, nil
}

func (r *UserRepository) CreateUser(ctx context.Context, user model.User) error {
	_, err := r.Collection.InsertOne(ctx, user)
	return err
}

func (r *UserRepository) UpsertUser(ctx context.Context, user model.User) error {
	filter := bson.M{"uid": user.UID}
	update := bson.M{"$set": user}
	opts := options.Update().SetUpsert(true)
	_, err := r.Collection.UpdateOne(ctx, filter, update, opts)
	return err
}
