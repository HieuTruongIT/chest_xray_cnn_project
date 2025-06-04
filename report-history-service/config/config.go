package config

import (
	"context"
	"log"
	"os"
	"time"

	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"

	"github.com/joho/godotenv"
)

var (
	MongoClient *mongo.Client
	DbName      string
	ServerPort  string
)

func LoadEnv() {
	err := godotenv.Load()
	if err != nil {
		log.Println("Warning: .env file not found, using system environment variables")
	}

	DbName = os.Getenv("MONGO_DB_NAME")
	ServerPort = os.Getenv("SERVER_PORT")
	if ServerPort == "" {
		ServerPort = "8082"
	}

}

func ConnectMongo() {
	LoadEnv()

	mongoURI := os.Getenv("MONGODB_URI")

	if mongoURI == "" {
		log.Fatal("MONGODB_URI is not set in environment")
	}

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	clientOptions := options.Client().ApplyURI(mongoURI)
	client, err := mongo.Connect(ctx, clientOptions)
	if err != nil {
		log.Fatal("Mongo connect error:", err)
	}

	err = client.Ping(ctx, nil)
	if err != nil {
		log.Fatal("Mongo ping error:", err)
	}

	MongoClient = client
}

func GetMongoCollection(collectionName string) *mongo.Collection {
	return MongoClient.Database(DbName).Collection(collectionName)
}
