package main

import (
	"database/sql"
	"fmt"
	"log"
	"net/http"

	"back/controllers"
	"back/driver"

	"github.com/gorilla/mux"
	_ "github.com/subosito/gotenv"
)

var db *sql.DB

func main() {

	db = driver.ConnectDB()

	controller := controllers.Controller{}

	// ルーターの作成
	router := mux.NewRouter()
	// ハンドラの登録
	router.HandleFunc("/home", controller.GetStudents(db)).Methods("GET")                                               // 初期画面表示
	router.HandleFunc("/updateAttendance", controller.UpdateAttendanceStatus(db)).Methods("PUT")                        // 出席機能
	router.HandleFunc("/recordAttendanceTime", controller.RecordAttendanceTime(db)).Methods("POST")                     // 出席時間記録
	router.HandleFunc("/recordLeaveTime", controller.RecordLeaveTime(db)).Methods("PUT")                                // 退席時間記録
	router.HandleFunc("/studentList", controller.GetStudentList(db)).Methods("GET")                                     // 学生一覧画面表示
	router.HandleFunc("/updateEnrollment", controller.UpdateEnrollmentStatus(db)).Methods("PUT")                        // 在籍フラグ削除
	router.HandleFunc("/recordStudent", controller.RecordStudent(db)).Methods("POST")                                   // 新規生徒登録
	router.HandleFunc("/updateStudent", controller.UpdateStudent(db)).Methods("PUT")                                   // 新規生徒登録
	router.HandleFunc("/uploadImage", controller.UploadImage(db)).Methods("POST")                                       // 画像をアップロードする
	router.HandleFunc("/outputAttendanceRecordForCSV/{id}", controller.OutputAttendanceRecordForCSV(db)).Methods("GET") // 出席記録をcsvに出力

	// サーバー立ち上げ
	fmt.Println("Server is running at port 8080")
	log.Fatal(http.ListenAndServe(":8080", router))
}
