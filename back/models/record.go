package models

import "time"

type Record struct {
	StudentName    string
	AttendanceTime time.Time
	LeaveTime      time.Time
	StayTime       int
}
