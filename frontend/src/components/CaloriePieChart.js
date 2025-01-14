import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
  } from 'chart.js';
  import { Pie } from 'react-chartjs-2';
  import PropTypes from 'prop-types';
  
  ChartJS.register(ArcElement, Tooltip, Legend);
  
  const CaloriePieChart = ({ foodLogs = [], dailyGoal = 0 }) => {
    const defaultColors = [
      '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0',
      '#9966FF', '#FF9F40', '#4D5360', '#00A1F1',
    ];
  
    const data = {
      labels: foodLogs.map((log) => log.food || 'Unknown'),
      datasets: [
        {
          data: foodLogs.map((log) => log.calories || 0),
          backgroundColor: defaultColors.slice(0, foodLogs.length),
          hoverBackgroundColor: defaultColors.slice(0, foodLogs.length),
        },
      ],
    };
  
    return (
      <div>
        <h2>Calorie Distribution</h2>
        {foodLogs.length > 0 ? (
          <Pie data={data} />
        ) : (
          <p>No food logs available. Start adding to visualize your calorie distribution!</p>
        )}
      </div>
    );
  };
  
  CaloriePieChart.propTypes = {
    foodLogs: PropTypes.arrayOf(
      PropTypes.shape({
        food: PropTypes.string,
        calories: PropTypes.number,
      })
    ),
    dailyGoal: PropTypes.number,
  };
  
  export default CaloriePieChart;
  