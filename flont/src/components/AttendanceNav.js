import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import './Nav.css';

// import FavoriteIcon from '@material-ui/icons/Favorite';

class AttendanceNav extends Component{
    render() {
        return(
            <div className="nav-wrap">
                <div className="icon-wrap">
                    <Link to='/student'>
                        <img className="nav-icon" src="pageicon.png" alt="ページ切り替え" />
                    </Link>
                    <div className="nav-title">attendance-management</div>
                    <a href="https://github.com/Okaki030/attendance-management-system"　target="_blank">
                        <img className="nav-icon" src="github-icon.png" alt="githubリンク" />
                    </a>
                </div>
            </div>
        )
    }
}

export default AttendanceNav;