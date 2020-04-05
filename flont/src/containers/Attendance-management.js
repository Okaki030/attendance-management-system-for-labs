import React, { Component } from 'react';
import axios from 'axios';
import './Attendance-management.css';
import Student from '../components/Student';

// 学生出席情報取得API
const url ="http://localhost:8080/home";

class AttendanceManagement extends Component{
    constructor(){
        super();
        this.state={
            studentList:[]
        };
    }

    componentWillMount() {
        axios
            .get(url)
            .then(results => {
                this.setState({
                    studentList:results.data,
                });
            });
    }

    render(){
        return(
            <div className="attendance-wrap">
                {this.state.studentList.map((student) => {
                    return(
                        <Student
                            id = {student.Id}    
                            name = {student.Name}
                            pic = {student.Pic}
                            status = {student.Status}
                        />
                    )
                })}
            </div>
        )
    }
}

export default AttendanceManagement;