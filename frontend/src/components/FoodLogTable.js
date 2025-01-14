import React from 'react';

const FoodLogTable = ({ foodLogs, onDelete }) => {
  return (
    <div>
      <h2>Food Log</h2>
      <table>
        <thead>
          <tr>
            <th>Food</th>
            <th>Calories</th>
            <th>Meal Type</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {foodLogs.map((log, index) => (
            <tr key={index}>
              <td>{log.food}</td>
              <td>{log.calories}</td>
              <td>{log.mealType}</td>
              <td>
                <button onClick={() => onDelete(index)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FoodLogTable;
