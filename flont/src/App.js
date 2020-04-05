import React from 'react';
import './App.css';
import AttendanceNav from './components/AttendanceNav';
import StudentNav from './components/StudentNav';
import { BrowserRouter, Route } from 'react-router-dom';
import AttendanceManagement from './containers/Attendance-management';
import StudentManagement from './containers/Student-management';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Route exact path='/' component={AttendanceNav} />
        <Route path='/student' component={StudentNav}/>
        <Route exact path='/' component={AttendanceManagement} />
        <Route path='/student' component={StudentManagement} />
      </BrowserRouter>
    </div>
  );
}

export default App;
