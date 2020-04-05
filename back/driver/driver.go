package driver

import (
	"database/sql"
	_ "database/sql"
	"log"

	_ "github.com/go-sql-driver/mysql"
	_ "github.com/lib/pq"
)

var db *sql.DB

func ConnectDB() *sql.DB {

	// db接続
	db, err := sql.Open("mysql", "root:Attendance-2019@/attendance_db?parseTime=true&loc=Asia%2FTokyo")
	if err != nil {
		log.Fatal(err)
	}

	return db
}
