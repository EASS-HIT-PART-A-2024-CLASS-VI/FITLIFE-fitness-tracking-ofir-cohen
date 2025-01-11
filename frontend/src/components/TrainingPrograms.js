import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TrainingPrograms = () => {
    const [availablePrograms, setAvailablePrograms] = useState([]);
    const [selectedProgram, setSelectedProgram] = useState("");

    useEffect(() => {
        // Fetch available training programs from the backend
        axios.get("http://127.0.0.1:8000/training-programs")
            .then((response) => {
                setAvailablePrograms(response.data.available_programs);
            })
            .catch((error) => {
                console.error("Error fetching training programs:", error);
            });
    }, []);

    const handleDownload = () => {
        if (!selectedProgram) {
            alert("Please select a training program.");
            return;
        }

        // Trigger the download of the selected program
        window.open(`http://127.0.0.1:8000/training-programs/${selectedProgram}`, "_blank");
    };

    return (
        <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
            <h2 style={{ textAlign: 'center' }}>Download Training Programs</h2>
            <div style={{ margin: '20px 0' }}>
                <label htmlFor="program-select" style={{ fontSize: '16px', marginRight: '10px' }}>
                    Select your goal:
                </label>
                <select
                    id="program-select"
                    value={selectedProgram}
                    onChange={(e) => setSelectedProgram(e.target.value)}
                    style={{
                        padding: '10px',
                        fontSize: '16px',
                        borderRadius: '5px',
                        border: '1px solid #ccc',
                    }}
                >
                    <option value="">-- Select a program --</option>
                    {availablePrograms.map((program) => (
                        <option key={program} value={program}>
                            {program.replace("_", " ").toUpperCase()}
                        </option>
                    ))}
                </select>
            </div>
            <button
                onClick={handleDownload}
                style={{
                    backgroundColor: '#007BFF',
                    color: 'white',
                    padding: '10px 20px',
                    border: 'none',
                    borderRadius: '5px',
                    fontSize: '16px',
                    cursor: 'pointer',
                }}
            >
                Download Program
            </button>
        </div>
    );
};

export default TrainingPrograms;
