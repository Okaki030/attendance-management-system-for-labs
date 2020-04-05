import React, { Component } from 'react';
import MaterialTable from 'material-table';
import './Student-list.css';
import axios from 'axios';
import { CSSTransition } from 'react-transition-group';
import StudentForm from './Student-form';
import StudentEditForm from './Student-edit-form';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';

class StudentList extends Component{
    constructor() { 
        super();
        this.state = {
            isModalOpen: false,
            isFormModalOpen: false,
            isEditFormModalOpen: false,
            studentId: "",
            studentName: "",
            studentGrade: "",
            studentPic: "",
            studentList: []
        };

        this.handleClickFormClose = this.handleClickFormClose.bind(this); 
        this.handleClickEditFormClose = this.handleClickEditFormClose.bind(this); 
    }

    componentWillMount() {
        console.log("hello")
        axios
            .get('http://localhost:8080/studentList')
            .then(results => {
                this.setState({
                    studentList:results.data,
                });
            });
    }

    updataEnrollmentStatus(id) { 
        const jsonStudentData = {
            "Id": id
        }
        
        axios
            .put('http://localhost:8080/updateEnrollment', jsonStudentData)
            .then(results => {
                this.setState({
                    studentList:results.data,
                });
            });
        
    }

    handleClickStudent(id, name) {
        this.setState({
            isModalOpen: true,
            studentId: id,
            studentName: name
        });
    }

    handleClickClose() {
        this.setState({isModalOpen: false});
    }

    handleClickForm() { 
        this.setState({ isFormModalOpen: true });
    }

    handleClickFormClose() { 
        this.setState({ isFormModalOpen: false });
    }

    handleClickEditForm(id, name, grade, pic) {
        this.setState({
            studentId: id,
            studentName: name,
            studentGrade: grade,
            studentPic: pic,
            isEditFormModalOpen: true
        });
    }
    
    handleClickEditFormClose() { 
        this.setState({ isEditFormModalOpen: false });
        axios
            .get('http://localhost:8080/studentList')
            .then(results => {
                this.setState({
                    studentList:results.data,
                });
            });
    }

    handleClickExportCsv(id) {
        const url = 'http://localhost:8080//outputAttendanceRecordForCSV/' + id;
        const jsonStudentData = {
            "Id": id
        }

        axios
            .get(url,jsonStudentData);
    }

    render() {
        const studentListRelay = [];
        // eslint-disable-next-line
        this.state.studentList.map((student) => { 
            studentListRelay.push({id: student.Id, name: student.Name, grade: student.Grade, pic: student.Pic})
        });

        // 削除モーダル
        const modal = (
            <div className='delete-modal'>
                <div className='delete-modal-box'>
                    <div className='delete-modal-introduction'>
                        {this.state.studentName}さんを削除してもよろしいですか？
                    </div>
                    <div className='delete-attend-select-btn'>
                        <button
                            className='delete-modal-close-btn'
                            onClick={() => {
                                this.handleClickClose();
                                this.updataEnrollmentStatus(this.state.studentId);
                            }}
                        >
                            はい
                        </button>
                        <button
                            className='delete-modal-close-btn'
                            onClick={() => {this.handleClickClose()}} 
                        >
                            いいえ
                        </button>
                    </div>
                </div>
            </div>
        );

        return (
            <div>
                <div className="form-button">
                    <Fab
                        color="grey"
                        size="small"
                        aria-label="add"
                        onClick={() => {this.handleClickForm()}}
                    >
                        <AddIcon />
                    </Fab>
                </div>
                <MaterialTable
                    title="Student List"
                    rowCount={30}
                    columns={[
                        { title: 'Name', field: 'name' }, // fieldがdataのkeyに対応している
                        {
                            title: 'Grade',
                            field: 'grade',
                            lookup: { 1: 'B1', 2: 'B2', 3: 'B3',4: 'B4',5: 'M1',6: 'M2',7: 'D1',8:'D2',9:'D3' },
                        },
                    ]}
                    data={studentListRelay}        
                    actions={[ // 表の左側に表示する
                        {
                            icon: 'edit',
                            tooltip: 'Edit User',
                            onClick: (event, rowData) => { // クリック時のイベント(複数設定できる)
                                this.handleClickEditForm(rowData.id, rowData.name, rowData.grade, rowData.pic);
                            }
                        },
                        {
                            icon: 'delete',
                            tooltip: 'Delete User',
                            onClick: (event, rowData) => { 
                                this.handleClickStudent(rowData.id, rowData.name);
                            }
                        },
                        {
                            icon: 'arrow_upward',
                            tooltip: 'Export AttendanceRecord',
                            onClick: (event, rowData) => {
                                alert("Exported csv file to /attendance_management_system/back/record/");
                                this.handleClickExportCsv(rowData.id);
                            }
                        }
                    ]}
                />
                <CSSTransition
                        in={this.state.isModalOpen}
                        timeout={500}
                        classNames="modal-animation"
                        unmountOnExit
                >
                        {modal}
                </CSSTransition>
                <CSSTransition
                        in={this.state.isFormModalOpen}
                        timeout={500}
                        classNames="modal-animation"
                        unmountOnExit
                >
                    <StudentForm parentMethod={this.handleClickFormClose} />
                </CSSTransition>
                <CSSTransition
                        in={this.state.isEditFormModalOpen}
                        timeout={500}
                        classNames="modal-animation"
                        unmountOnExit
                >
                    <StudentEditForm
                        id={this.state.studentId}
                        name={this.state.studentName}
                        grade={this.state.studentGrade}
                        pic={this.state.studentPic}
                        parentMethod={this.handleClickEditFormClose}
                        
                    />
                </CSSTransition>
            </div>
        )
    }
}

export default StudentList;