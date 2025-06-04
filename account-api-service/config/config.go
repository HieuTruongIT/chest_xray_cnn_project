package config

import (
	"os"

	"github.com/joho/godotenv"
)

type Config struct {
	MongoURI   string
	ServerPort string
}

func LoadConfig() *Config {
	_ = godotenv.Load()

	return &Config{
		MongoURI:   os.Getenv("MONGODB_URI"),
		ServerPort: os.Getenv("SERVER_PORT"),
	}
}
