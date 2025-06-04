package model

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type Report struct {
	ID        primitive.ObjectID `bson:"_id,omitempty" json:"id"`
	Uid       string             `bson:"uid" json:"uid"`
	FileName  string             `bson:"file_name" json:"fileName"`
	PdfFileID primitive.ObjectID `bson:"pdf_file_id,omitempty" json:"pdfFileId"`
	Status    string             `bson:"status" json:"status"`
	CreatedAt time.Time          `bson:"created_at" json:"createdAt"`
	UpdatedAt time.Time          `bson:"updated_at" json:"updatedAt"`
}
