'use client';

import { useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';

ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

type MuscleGroupStat = {
  muscleGroup: string;
  totalSets: number;
  totalVolume: number;
  uniqueExercises: number;
};

type WorkoutFrequency = {
  daily: Record<string, number>;
  average: number;
};

type Summary = {
  totalWorkouts: number;
  totalExercises: number;
  totalSets: number;
  totalVolume: number;
  averageVolumePerWorkout: number;
};

type WorkoutVolumeStatsProps = {
  period?: string;
};

const COLORS = [
  'rgb(79, 70, 229)', // indigo
  'rgb(59, 130, 246)', // blue
  'rgb(16, 185, 129)', // green
  'rgb(245, 158, 11)', // amber
  'rgb(239, 68, 68)', // red
  'rgb(236, 72, 153)', // pink
  'rgb(139, 92, 246)', // purple
];

export default function WorkoutVolumeStats({ period = '30' }: WorkoutVolumeStatsProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [muscleGroups, setMuscleGroups] = useState<MuscleGroupStat[]>([]);
  const [workoutFrequency, setWorkoutFrequency] = useState<WorkoutFrequency | null>(null);
  const [summary, setSummary] = useState<Summary | null>(null);

  useEffect(() => {
    fetchStats();
  }, [period]);

  const fetchStats = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/workouts/stats/volume?period=${period}`);
      if (!response.ok) {
        throw new Error('Failed to fetch workout stats');
      }
      const data = await response.json();
      setMuscleGroups(data.muscleGroups);
      setWorkoutFrequency(data.workoutFrequency);
      setSummary(data.summary);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const pieChartData = {
    labels: muscleGroups.map((group) => group.muscleGroup),
    datasets: [
      {
        data: muscleGroups.map((group) => group.totalVolume),
        backgroundColor: COLORS,
        borderColor: COLORS.map((color) => color.replace('rgb', 'rgba').replace(')', ', 0.2)')),
        borderWidth: 1,
      },
    ],
  };

  const barChartData = {
    labels: Object.keys(workoutFrequency?.daily || {}),
    datasets: [
      {
        label: 'Workouts',
        data: Object.values(workoutFrequency?.daily || {}),
        backgroundColor: 'rgb(79, 70, 229)',
      },
    ],
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse bg-gray-100 rounded-lg h-[300px]"></div>
        <div className="animate-pulse bg-gray-100 rounded-lg h-[300px]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">{error}</p>
        <button
          onClick={fetchStats}
          className="mt-4 text-indigo-600 hover:text-indigo-500"
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold mb-4">Volume by Muscle Group</h3>
          <div className="aspect-square">
            <Pie data={pieChartData} />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold mb-4">Workout Frequency</h3>
          <Bar
            data={barChartData}
            options={{
              responsive: true,
              scales: {
                y: {
                  beginAtZero: true,
                  ticks: {
                    stepSize: 1,
                  },
                },
              },
            }}
          />
        </div>
      </div>

      {summary && (
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold mb-4">Summary</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div>
              <p className="text-sm text-gray-500">Total Workouts</p>
              <p className="text-2xl font-semibold">{summary.totalWorkouts}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Exercises</p>
              <p className="text-2xl font-semibold">{summary.totalExercises}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Sets</p>
              <p className="text-2xl font-semibold">{summary.totalSets}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Volume</p>
              <p className="text-2xl font-semibold">{summary.totalVolume.toLocaleString()} kg</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Avg. Volume/Workout</p>
              <p className="text-2xl font-semibold">
                {Math.round(summary.averageVolumePerWorkout).toLocaleString()} kg
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
