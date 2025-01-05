import React from 'react';
import './Dashboard.css';
import logo from '../assets/logo.png';

function Dashboard() {
    return (
        <div className="dashboard-container">
            <header className="dashboard-header">
                <img src={logo} alt="FitLife Logo" className="logo" />
                <p>Your personalized fitness tracking dashboard.</p>
            </header>
        </div>
    );
}

export default Dashboard;
