package model

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type Result struct {
	ID         primitive.ObjectID `bson:"_id,omitempty" json:"id"`
	UID        string             `bson:"uid" json:"uid"`
	Prediction interface{}        `bson:"prediction" json:"prediction"`
	CreatedAt  time.Time          `bson:"createdAt" json:"createdAt"`
}
