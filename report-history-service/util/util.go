package util

import (
	"fmt"
	"time"
)

func FormatTimestamp(t time.Time) string {
	return t.Format("2006-01-02 15:04:05")
}

func ParseTimestamp(s string) (time.Time, error) {
	return time.Parse("2006-01-02 15:04:05", s)
}

func GenerateID() string {
	return fmt.Sprintf("rpt_%d", time.Now().UnixNano())
}
