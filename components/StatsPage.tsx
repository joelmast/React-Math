import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { RoundStats } from '../types';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface StatsPageProps {
  pastRounds: RoundStats[];
}

const StatsPage: React.FC<StatsPageProps> = ({ pastRounds }) => {
  if (pastRounds.length === 0) {
    return (
        <div className="text-center py-10">
            <h2 className="text-2xl font-bold text-slate-300">No Stats Yet!</h2>
            <p className="text-slate-400 mt-2">Play a round to see your progress here.</p>
        </div>
    );
  }

  const chartLabels = pastRounds.map((_, index) => `Round ${index + 1}`);
  const chartData = {
    labels: chartLabels,
    datasets: [
      {
        label: 'Problems Answered',
        data: pastRounds.map(r => r.score),
        borderColor: 'rgb(34, 211, 238)', // cyan-400
        backgroundColor: 'rgba(34, 211, 238, 0.5)',
        yAxisID: 'y',
        tension: 0.1,
      },
      {
        label: 'Accuracy (%)',
        data: pastRounds.map(r => r.accuracy),
        borderColor: 'rgb(74, 222, 128)', // green-400
        backgroundColor: 'rgba(74, 222, 128, 0.5)',
        yAxisID: 'y1',
        tension: 0.1,
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
    plugins: {
        legend: {
            position: 'top' as const,
            labels: {
                color: '#cbd5e1' // slate-300
            }
        },
        title: {
            display: true,
            text: 'Performance Over Time',
            color: '#f8fafc', // slate-50
            font: {
                size: 18
            }
        },
    },
    scales: {
      x: {
        grid: {
            color: 'rgba(255, 255, 255, 0.1)'
        },
        ticks: {
            color: '#94a3b8' // slate-400
        }
      },
      y: {
        type: 'linear' as const,
        display: true,
        position: 'left' as const,
        grid: {
          drawOnChartArea: false, // only draw grid for this axis if needed
          color: 'rgba(34, 211, 238, 0.5)'
        },
        ticks: {
            color: '#67e8f9' // cyan-300
        },
        title: {
            display: true,
            text: 'Problems Answered',
            color: '#67e8f9'
        }
      },
      y1: {
        type: 'linear' as const,
        display: true,
        position: 'right' as const,
        min: 0,
        max: 100,
        grid: {
          drawOnChartArea: false,
          color: 'rgba(74, 222, 128, 0.5)'
        },
        ticks: {
            color: '#86efac' // green-300
        },
         title: {
            display: true,
            text: 'Accuracy (%)',
            color: '#86efac'
        }
      },
    }
  };

  return (
    <div className="w-full h-80 md:h-96 p-4 bg-slate-900/50 rounded-lg">
      <Line options={chartOptions} data={chartData} />
    </div>
  );
};

export default StatsPage;
