import React , { Component } from 'react';
import axios from 'axios';
import './Student.css';

class StudentTrue extends Component{
    constructor(props){
        super(props);
        this.state = {isModalOpen: false};
    }

    isJSON(arg)
    {
        arg = (typeof arg === "function") ? arg() : arg;
        if (typeof arg  !== "string") {
            return false;
        }
        try {
            arg = (!JSON) ? eval("(" + arg + ")") : JSON.parse(arg);
            return true;
        } catch (e) {
            return false;
        }
    };

    handleClickStudent() {
        this.setState({isModalOpen: true});
    }

    handleClickClose() {
        this.setState({isModalOpen: false});
    }

    updataAttendanceStatus(){
        console.log(JSON.stringify(this.props));
        console.log(this.isJSON(JSON.stringify(this.props)));
        axios
            .put('http://localhost:8080/updateAttendance',JSON.stringify(this.props));
    }

    render(){
        let modal;
        if(this.state.isModalOpen){
            // モーダル
            modal = (
                <div className='modal'>
                    <div className='modal-box'>
                        <div className="student-wrap student-wrap-modal">
                            <a><img src={this.props.pic} /></a>
                        </div>
                        <div className='modal-introduction'>
                            <p>{this.props.name}さんは出席しますか？</p>
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
        }
        return(
            <div className="student-wrap">
                <div className="student-icon"　onClick={() => {this.handleClickStudent()}}>
                    <a><img src={this.props.pic} /></a>
                </div>
                <div class="student-name">{this.props.name}</div>
                {modal}
            </div>
        )
    }
}

export default StudentTrue;