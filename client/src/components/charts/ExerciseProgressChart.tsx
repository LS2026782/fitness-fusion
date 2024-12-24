'use client';

import { useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartData,
  ChartOptions,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { format } from 'date-fns';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

type ProgressData = {
  date: string;
  value: number | null;
  sets: number;
};

type Stats = {
  max: number | null;
  min: number | null;
  average: number | null;
  totalSets: number;
};

type ExerciseProgressChartProps = {
  exerciseId: string;
  exerciseName: string;
  metric?: 'weight' | 'reps' | 'duration' | 'distance';
  period?: string;
};

export default function ExerciseProgressChart({
  exerciseId,
  exerciseName,
  metric = 'weight',
  period = '30',
}: ExerciseProgressChartProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [progressData, setProgressData] = useState<ProgressData[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    fetchProgress();
  }, [exerciseId, metric, period]);

  const fetchProgress = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `/api/workouts/stats/exercise-progress?exerciseId=${exerciseId}&metric=${metric}&period=${period}`
      );
      if (!response.ok) {
        throw new Error('Failed to fetch progress data');
      }
      const data = await response.json();
      setProgressData(data.progress);
      setStats(data.stats);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const chartData: ChartData<'line'> = {
    labels: progressData.map((data) => format(new Date(data.date), 'MMM d')),
    datasets: [
      {
        label: getMetricLabel(metric),
        data: progressData.map((data) => data.value),
        borderColor: 'rgb(79, 70, 229)',
        backgroundColor: 'rgba(79, 70, 229, 0.5)',
        tension: 0.3,
      },
    ],
  };

  const options: ChartOptions<'line'> = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: `${exerciseName} Progress - ${getMetricLabel(metric)}`,
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const value = context.parsed.y;
            return `${getMetricLabel(metric)}: ${value}${getMetricUnit(metric)}`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: getMetricLabel(metric),
        },
      },
    },
  };

  if (isLoading) {
    return (
      <div className="animate-pulse bg-gray-100 rounded-lg h-[400px]"></div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">{error}</p>
        <button
          onClick={fetchProgress}
          className="mt-4 text-indigo-600 hover:text-indigo-500"
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="mb-6">
        <Line data={chartData} options={options} height={300} />
      </div>

      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4 border-t pt-4">
          <div>
            <p className="text-sm text-gray-500">Maximum</p>
            <p className="text-lg font-semibold">
              {stats.max}
              {getMetricUnit(metric)}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Minimum</p>
            <p className="text-lg font-semibold">
              {stats.min}
              {getMetricUnit(metric)}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Average</p>
            <p className="text-lg font-semibold">
              {stats.average?.toFixed(1)}
              {getMetricUnit(metric)}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Total Sets</p>
            <p className="text-lg font-semibold">{stats.totalSets}</p>
          </div>
        </div>
      )}
    </div>
  );
}

function getMetricLabel(metric: string): string {
  switch (metric) {
    case 'weight':
      return 'Weight';
    case 'reps':
      return 'Repetitions';
    case 'duration':
      return 'Duration';
    case 'distance':
      return 'Distance';
    default:
      return metric;
  }
}

function getMetricUnit(metric: string): string {
  switch (metric) {
    case 'weight':
      return 'kg';
    case 'reps':
      return '';
    case 'duration':
      return 's';
    case 'distance':
      return 'm';
    default:
      return '';
  }
}
