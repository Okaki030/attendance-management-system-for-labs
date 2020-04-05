package studentRepository

import (
	"back/models"
	"database/sql"
	"fmt"
)

type StudentRepository struct{}

// ユーザの出席情報を取得
func (b StudentRepository) GetStudents(db *sql.DB, student models.Student, students []models.Student) ([]models.Student, error) {

	rows, err := db.Query(`select student_id, student_name,pic,attendance_status from student where enrollment_status = true order by grade desc`)
	if err != nil {
		return []models.Student{}, err
	}

	for rows.Next() {
		err := rows.Scan(&(student.Id), &(student.Name), &(student.Pic), &(student.Status))
		students = append(students, student)
		if err != nil {
			return []models.Student{}, err
		}
	}

	return students, nil
}

// ユーザの出席状態を更新
func (b StudentRepository) UpdateAttendanceStatus(db *sql.DB, student models.Student) error {

	var err error

	fmt.Println(student.Status)
	// 出席状態なら退席、退席状態なら出席にする
	if student.Status == 1 {
		_, err = db.Exec(`
		UPDATE student 
			SET attendance_status=false 
			WHERE student_id=?`, student.Id)
	} else {
		_, err = db.Exec(`
		UPDATE student 
			SET attendance_status=true 
			WHERE student_id=?`, student.Id)
	}
	if err != nil {
		return err
	}

	return nil
}

// 出席時間を記録
func (b StudentRepository) RecordAttendanceTime(db *sql.DB, student models.Student) error {

	var err error

	_, err = db.Exec(`
	INSERT INTO record (student_id, start_time) 
		VALUES (?, now())`, student.Id)
	if err != nil {
		return err
	}

	return nil
}

// 退席時間を記録
func (b StudentRepository) RecordLeaveTime(db *sql.DB, student models.Student) error {

	var err error

	_, err = db.Exec(`
	UPDATE record 
		SET end_time=now(),stay_time=timestampdiff(minute,start_time,now()) 
		WHERE student_id=? 
		order by start_time desc limit 1`, student.Id)
	if err != nil {
		return err
	}

	return nil
}

// ユーザリストを取得
func (b StudentRepository) GetStudentList(db *sql.DB, student models.Student, students []models.Student) ([]models.Student, error) {

	rows, err := db.Query(`SELECT student_id, student_name, grade, pic FROM student WHERE enrollment_status = true order BY grade DESC`)
	if err != nil {
		return []models.Student{}, err
	}

	for rows.Next() {
		err := rows.Scan(&(student.Id), &(student.Name), &(student.Grade), &(student.Pic))
		students = append(students, student)
		if err != nil {
			return []models.Student{}, err
		}
	}

	return students, nil
}

// 生徒の在籍状況を削除に
func (b StudentRepository) UpdateEnrollmentStatus(db *sql.DB, student models.Student) error {

	var err error

	_, err = db.Exec(`
	UPDATE attendance_db.student 
		SET enrollment_status=0
		WHERE student_id=?`, student.Id)
	if err != nil {
		return err
	}

	return nil
}

// 新しい生徒を登録
func (b StudentRepository) RecordStudent(db *sql.DB, student models.Student) error {

	var err error

	_, err = db.Exec(`
	INSERT INTO 
		student (student_name,grade,pic,attendance_status,enrollment_status)
		values (?,?,?,0,1) `, student.Name, student.Grade, student.Pic)
	if err != nil {
		return err
	}

	return nil
}

// 生徒情報を更新
func (b StudentRepository) UpdateStudent(db *sql.DB, student models.Student) error {

	var err error

	_, err = db.Exec(`
	UPDATE attendance_db.student 
		SET student_name=?, grade=?, pic=?
		WHERE student_id=? `, student.Name, student.Grade, student.Pic, student.Id)
	if err != nil {
		return err
	}

	return nil
}

// 出席記録を取得
func (b StudentRepository) OutputAttendanceRecordForCSV(db *sql.DB, studentId int, record models.Record, records []models.Record) ([]models.Record, error) {

	rows, err := db.Query(`
		SELECT student.student_name,record.start_time, record.end_time, record.stay_time 
			FROM attendance_db.record
			INNER JOIN
			attendance_db.student
			ON record.student_id=student.student_id 
			WHERE record.student_id=?`, studentId)
	if err != nil {
		return []models.Record{}, err
	}

	for rows.Next() {
		err := rows.Scan(&(record.StudentName), &(record.AttendanceTime), &(record.LeaveTime), &(record.StayTime))
		records = append(records, record)
		if err != nil {
			return []models.Record{}, err
		}
	}

	return records, nil
}
