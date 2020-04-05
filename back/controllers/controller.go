package controllers

import (
	"back/models"
	studentRepository "back/repository/student"
	"back/utils"
	"fmt"

	"database/sql"
	"encoding/csv"
	"encoding/json"
	"io"
	"log"
	"net/http"
	"os"
	"strconv"

	"github.com/gorilla/mux"
)

type Controller struct{}

var students []models.Student

func logFatal(err error) {
	if err != nil {
		log.Fatal(err)
	}
}

// ユーザ出席情報取得(出席ページ)
func (c Controller) GetStudents(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		fmt.Println("start")
		var student models.Student
		var error models.Error

		students = []models.Student{}

		// SQLでユーザ出席情報を取得
		studentRepo := studentRepository.StudentRepository{}
		students, err := studentRepo.GetStudents(db, student, students)
		if err != nil {
			error.Message = "Server error"
			utils.SendError(w, http.StatusInternalServerError, error)
			return
		}

		utils.SendSuccess(w, students)
	}
}

// ユーザ出席状態更新(出席、退席時)
func (c Controller) UpdateAttendanceStatus(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var student models.Student
		var error models.Error

		// httpリクエストのパラメーターを取得
		json.NewDecoder(r.Body).Decode(&student)

		// SQLで出席状態を更新
		studentRepo := studentRepository.StudentRepository{}
		err := studentRepo.UpdateAttendanceStatus(db, student)
		if err != nil {
			error.Message = "Server error"
			utils.SendError(w, http.StatusInternalServerError, error)
			return
		}

		utils.SendSuccess(w, nil)
	}
}

// 出席時間を記録
func (c Controller) RecordAttendanceTime(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var student models.Student
		var error models.Error

		// httpリクエストのパラメーターを取得
		json.NewDecoder(r.Body).Decode(&student)

		// SQLで出席時間を記録
		studentRepo := studentRepository.StudentRepository{}
		err := studentRepo.RecordAttendanceTime(db, student)
		if err != nil {
			error.Message = "Server error"
			utils.SendError(w, http.StatusInternalServerError, error)
			return
		}

		utils.SendSuccess(w, nil)
	}
}

// 退席時間を記録
func (c Controller) RecordLeaveTime(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var student models.Student
		var error models.Error

		// httpリクエストのパラメーターを取得
		json.NewDecoder(r.Body).Decode(&student)

		// SQLで退席時間を記録
		studentRepo := studentRepository.StudentRepository{}
		err := studentRepo.RecordLeaveTime(db, student)
		if err != nil {
			error.Message = "Server error"
			utils.SendError(w, http.StatusInternalServerError, error)
			return
		}

		utils.SendSuccess(w, nil)
	}
}

// ユーザリスト取得(生徒管理ページ)
func (c Controller) GetStudentList(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var student models.Student
		var error models.Error

		students = []models.Student{}

		// SQLでユーザ出席情報を取得
		studentRepo := studentRepository.StudentRepository{}
		students, err := studentRepo.GetStudentList(db, student, students)
		if err != nil {
			error.Message = "Server error"
			utils.SendError(w, http.StatusInternalServerError, error)
			return
		}

		utils.SendSuccess(w, students)
	}
}

// ユーザ削除機能
func (c Controller) UpdateEnrollmentStatus(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var student models.Student
		var error models.Error

		students = []models.Student{}

		// httpリクエストのパラメーターを取得
		json.NewDecoder(r.Body).Decode(&student)

		// SQLで出席状態を更新
		studentRepo := studentRepository.StudentRepository{}
		err := studentRepo.UpdateEnrollmentStatus(db, student)
		if err != nil {
			error.Message = "Server error"
			utils.SendError(w, http.StatusInternalServerError, error)
			return
		}

		// SQLでユーザ出席情報を取得
		students, err := studentRepo.GetStudentList(db, student, students)
		if err != nil {
			error.Message = "Server error"
			utils.SendError(w, http.StatusInternalServerError, error)
			return
		}

		utils.SendSuccess(w, students)
	}
}

//　新たしい生徒を登録
func (c Controller) RecordStudent(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var student models.Student
		var error models.Error

		students = []models.Student{}

		// httpリクエストのパラメーターを取得
		json.NewDecoder(r.Body).Decode(&student)

		fmt.Println("生徒登録", student)

		// SQLで生徒を登録
		studentRepo := studentRepository.StudentRepository{}
		err := studentRepo.RecordStudent(db, student)
		if err != nil {
			error.Message = "Server error"
			utils.SendError(w, http.StatusInternalServerError, error)
			return
		}

		// SQLでユーザ出席情報を取得
		students, err := studentRepo.GetStudentList(db, student, students)
		if err != nil {
			error.Message = "Server error"
			utils.SendError(w, http.StatusInternalServerError, error)
			return
		}

		utils.SendSuccess(w, students)
	}
}

//　生徒情報更新機能
func (c Controller) UpdateStudent(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var student models.Student
		var error models.Error

		students = []models.Student{}

		// httpリクエストのパラメーターを取得
		json.NewDecoder(r.Body).Decode(&student)

		// SQLで生徒を登録
		studentRepo := studentRepository.StudentRepository{}
		err := studentRepo.UpdateStudent(db, student)
		if err != nil {
			error.Message = "Server error"
			utils.SendError(w, http.StatusInternalServerError, error)
			return
		}

		// SQLでユーザ出席情報を取得
		students, err := studentRepo.GetStudentList(db, student, students)
		if err != nil {
			error.Message = "Server error"
			utils.SendError(w, http.StatusInternalServerError, error)
			return
		}

		utils.SendSuccess(w, students)
	}
}

// 画像をアップロード
func (c Controller) UploadImage(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {

		var error models.Error

		picFile, handler, err := r.FormFile("file")
		if err != nil {
			error.Message = "Server error"
			utils.SendError(w, http.StatusInternalServerError, error)
			return
		}

		pathToSaveImage := "./../flont/public/" + handler.Filename
		f, err := os.Create(pathToSaveImage)
		if err != nil {
			error.Message = "Server error"
			utils.SendError(w, http.StatusInternalServerError, error)
			return
		}
		defer f.Close()

		io.Copy(f, picFile)

		utils.SendSuccess(w, students)
	}
}

// 出席記録をcsvファイルとして出力する
func (c Controller) OutputAttendanceRecordForCSV(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var record models.Record
		var error models.Error

		records := []models.Record{}

		// csvファイルのカラム
		var column = []string{
			"attendance_time",
			"leave_time",
			"stay_time",
		}

		recordsString := []string{}

		vars := mux.Vars(r)
		studentId, err := strconv.Atoi(vars["id"])
		if err != nil {
			error.Message = "Server error"
			utils.SendError(w, http.StatusInternalServerError, error)
			return
		}

		// SQLで出席記録を取得する
		studentRepo := studentRepository.StudentRepository{}
		records, err = studentRepo.OutputAttendanceRecordForCSV(db, studentId, record, records)
		if err != nil {
			error.Message = "Server error"
			utils.SendError(w, http.StatusInternalServerError, error)
			return
		}

		// 書き込むファイルを作成
		filePath := "./record/" + records[0].StudentName + ".csv"
		fmt.Println(filePath)
		file, err := os.Create(filePath)
		if err != nil {
			error.Message = "Server error"
			utils.SendError(w, http.StatusInternalServerError, error)
			return
		}
		defer file.Close()

		writer := csv.NewWriter(file) // utf8
		writer.Write(column)

		// 出席記録をcsv書き込み用にparse
		for _, record := range records {
			recordsString = []string{}
			recordsString = append(recordsString, record.AttendanceTime.String())
			recordsString = append(recordsString, record.LeaveTime.String())
			recordsString = append(recordsString, strconv.Itoa(record.StayTime))
			writer.Write(recordsString)
		}

		writer.Flush()

		utils.SendSuccess(w, nil)
	}
}
