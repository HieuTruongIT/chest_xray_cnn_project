package config

import (
	"log"
	"os"
)

var (
	MongoURI    string
	MongoDBName string
	ServerPort  string
)

func LoadEnv() {
	MongoURI = os.Getenv("MONGODB_URI")
	MongoDBName = os.Getenv("MONGO_DB_NAME")
	ServerPort = os.Getenv("SERVER_PORT")

	if MongoURI == "" || MongoDBName == "" || ServerPort == "" {
		log.Fatal("Missing required environment variables")
	}
}
