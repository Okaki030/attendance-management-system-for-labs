import React , { Component } from 'react';
import axios from 'axios';
import './Student.css';
import { CSSTransition } from 'react-transition-group';

class Student extends Component{
    constructor(props){
        super(props);
        this.state = {
            isModalOpen: false,
            studentStatus:this.props.status
        };
    }

    handleClickStudent() {
        this.setState({isModalOpen: true});
    }

    handleClickClose() {
        this.setState({isModalOpen: false});
    }

    isJSON(arg)
    {
        arg = (typeof arg === "function") ? arg() : arg;
        if (typeof arg  !== "string") {
            return false;
        }
        try {
            arg = (!JSON) ? ("(" + arg + ")") : JSON.parse(arg);
            return true;
        } catch (e) {
            return false;
        }
    };

    updataAttendanceStatus() {
        const jsonStudentData={
            "Id": this.props.id,
            "Status":this.state.studentStatus,
        }

        console.log(this.state.studentStatus);

        if (this.state.studentStatus === 1) {
            this.setState({ studentStatus: 0 })
        }else{
            this.setState({ studentStatus: 1 })
        }

        // 出席フラグの変更
        axios
            .put('http://localhost:8080/updateAttendance',jsonStudentData);
        
        if (this.state.studentStatus === 1) {
            axios
               .put('http://localhost:8080/recordLeaveTime',jsonStudentData);
        } else {
            axios
               .post('http://localhost:8080/recordAttendanceTime',jsonStudentData);
        }
    }

    render(){
        let message;
        let modal;

        if(this.state.isModalOpen){
            if(this.state.studentStatus === 1){
                message = (<p>{this.props.name}さんは退席しますか？</p>)
            }else{
                message = (<p>{this.props.name}さんは出席しますか？</p>)
            }
        }

        modal = (
            <div className='modal'>
                <div className='modal-box'>
                    <div className="student-wrap student-wrap-modal">
                        <img src={this.props.pic} alt="生徒" />
                    </div>
                    <div className='modal-introduction'>
                        {message}
                    </div>
                    <div className="attend-select-btn">
                        <button
                            className='modal-close-btn'
                            onClick={() => {
                                this.handleClickClose();
                                this.updataAttendanceStatus();
                            }} // ボタンがクリックされたときhandleClickClose()を発火する
                        >
                            はい
                        </button>
                        <button
                            className='modal-close-btn'
                            onClick={() => {this.handleClickClose()}} // ボタンがクリックされたときhandleClickClose()を発火する
                        >
                            いいえ
                        </button>
                    </div>
                </div>
            </div>
        );

        if(this.state.studentStatus === 1){
            return(
                <div className="student-wrap">
                    <div className="insta-gravatar student-icon"　onClick={() => {this.handleClickStudent()}}>
                        <img src={this.props.pic} alt="学生" />
                    </div>
                    <div class="student-name">{this.props.name}</div>
                    <CSSTransition
                        in={this.state.isModalOpen}
                        timeout={500}
                        classNames="modal-animation"
                        unmountOnExit
                    >
                        {modal}
                    </CSSTransition>
                </div>    
            )
        }else{
            return(
                <div className="student-wrap">
                    <div className="student-icon"　onClick={() => {this.handleClickStudent()}}>
                        <img src={this.props.pic} alt="学生" />
                    </div>
                    <div class="student-name">{this.props.name}</div>
                    <CSSTransition
                        in={this.state.isModalOpen}
                        timeout={500}
                        classNames="modal-animation"
                        unmountOnExit
                    >
                        {modal}
                    </CSSTransition>
                </div>
            )
        }
        
    }
}

export default Student;