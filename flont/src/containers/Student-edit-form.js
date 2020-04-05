
import React, { Component } from 'react';
import axios from 'axios';
import './Student-form.css';

class StudentEditForm extends React.Component { 
    constructor(props) { 
        super(props);
        this.fileInput = React.createRef();
        this.state = {
            id: '',
            name: '',
            hasNameError: true,
            grade: '3',
            pic: '',
            picFile:'',
        }
    }

    componentWillMount() {
        this.setState({
            id: this.props.id,
            name: this.props.name,
            grade: this.props.grade,
            pic: this.props.pic
        });
    }

    handleNameChange(event) { 
        const inputValue = event.target.value;
        const isEmpty = inputValue === '';
        this.setState({
            name: inputValue,
            hasNameError: isEmpty,
        });
    }

    handleGradeChange(event) { 
        this.setState({ grade: event.target.value });
    }

    handlePicChange(event) { 
        let fileData = new FormData();
        fileData.append('file', event.target.files[0]);
        this.setState({ pic: event.target.files[0].name });
        this.setState({ picFile: fileData });
    }

    handleSubmit() {
        const jsonStudentData = {
            "id": this.state.id,
            "name": this.state.name,
            "grade": Number(this.state.grade),
            "pic": this.state.pic,
        }

        axios
            .put('http://localhost:8080/updateStudent', jsonStudentData)
            .then(results => {
                this.props.parentMethod();
            });

        if (this.state.picFile) { 
            axios
            .post('http://localhost:8080/uploadImage', this.state.picFile, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
        }
        
    }

    render() { 
        let nameErrorText;
        if (this.state.hasNameError) { 
            nameErrorText = (
                <p className="error-message">
                    Please enter your name.
                </p>
            );
        }

        return (
            <div className='form-modal'>
                <div className='form-modal-box'>
                    <div className='form-message'>
                        Update student information
                    </div>
                    <form className="form-item" onSubmit={() => { this.handleSubmit() }}>
                        <div className="form-item-name">Name</div>
                        <input
                            className="name-field"
                            value={this.state.name}
                            onChange={(event) => { this.handleNameChange(event) }}
                        />
                        { nameErrorText }
                        <div className="form-item-name">Grade</div>
                        <label>
                            <select className="grade-pulldown" value={this.state.grade} onChange={(event) => { this.handleGradeChange(event) }}>
                                <option value='1'>B1</option>
                                <option value='2'>B2</option>
                                <option value='3'>B3</option>
                                <option value='4'>B4</option>
                                <option value='5'>M1</option>
                                <option value='6'>M2</option>
                                <option value='7'>D1</option>
                                <option value='8'>D2</option>
                                <option value='9'>D3</option>
                            </select>
                        </label>
                        <div className="form-item-name">Picture</div>
                        <input className="file-input" type="file" ref={this.fileInput} onChange={(event) => { this.handlePicChange(event) }}/>
                    </form>
                    <div className='regist-select-btn'>
                        <button
                            className='regist-modal-close-btn'
                            onClick={
                                () => {
                                    this.handleSubmit();
                                    // this.props.parentMethod();
                                }  
                            }
                        >
                            Submit
                        </button>
                        <button
                            className='regist-modal-close-btn'
                            onClick={() => { this.props.parentMethod() }}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        );
    }
}

export default StudentEditForm;