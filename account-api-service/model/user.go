package model

type User struct {
	UID         string `json:"uid" bson:"uid"`
	Name        string `json:"name" bson:"name"`
	Email       string `json:"email" bson:"email"`
	PhoneNumber string `json:"phoneNumber" bson:"phoneNumber"`
	Provider    string `json:"provider" bson:"provider"`
	PhotoURL    string `json:"photoURL" bson:"photoURL"`
}

type Profile struct {
	UID            string   `json:"uid" bson:"uid"`
	Name           string   `json:"name,omitempty" bson:"name,omitempty"`
	PhoneNumber    string   `json:"phoneNumber,omitempty" bson:"phoneNumber,omitempty"`
	Age            int      `json:"age,omitempty" bson:"age,omitempty"`
	Gender         string   `json:"gender,omitempty" bson:"gender,omitempty"`
	Birthdate      string   `json:"birthdate,omitempty" bson:"birthdate,omitempty"`
	Address        string   `json:"address,omitempty" bson:"address,omitempty"`
	BloodType      string   `json:"bloodType,omitempty" bson:"bloodType,omitempty"`
	Height         float64  `json:"height,omitempty" bson:"height,omitempty"`
	Weight         float64  `json:"weight,omitempty" bson:"weight,omitempty"`
	MedicalHistory []string `json:"medicalHistory,omitempty" bson:"medicalHistory,omitempty"`
	PhotoURL       string   `json:"photoURL,omitempty" bson:"photoURL,omitempty"`
}
