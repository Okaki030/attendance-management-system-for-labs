import React, { Component } from 'react';
import './Student-management.css';
import StudentList from './Student-list';

class StudentManagement extends Component{
    
    render(){
        return(
            <div className="student-mamagement-wrap">
                <StudentList />
            </div>
        )
    }
}

export default StudentManagement;