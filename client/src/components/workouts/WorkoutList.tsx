'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import WorkoutCard from './WorkoutCard';
import Pagination from '../common/Pagination';
import { WorkoutSession, WorkoutExercise, Exercise } from '@prisma/client';

type WorkoutWithExercises = WorkoutSession & {
  exercises: (WorkoutExercise & {
    exercise: Exercise;
  })[];
};

type WorkoutHistoryResponse = {
  workouts: WorkoutWithExercises[];
  pagination: {
    total: number;
    pages: number;
    currentPage: number;
    limit: number;
  };
};

export default function WorkoutList() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [workouts, setWorkouts] = useState<WorkoutWithExercises[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchWorkouts(currentPage);
  }, [currentPage]);

  const fetchWorkouts = async (page: number) => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/workouts/history?page=${page}`);
      if (!response.ok) {
        throw new Error('Failed to fetch workouts');
      }
      const data: WorkoutHistoryResponse = await response.json();
      setWorkouts(data.workouts);
      setTotalPages(data.pagination.pages);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleWorkoutClick = (workoutId: string) => {
    router.push(`/workouts/${workoutId}`);
  };

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">{error}</p>
        <button
          onClick={() => fetchWorkouts(currentPage)}
          className="mt-4 text-indigo-600 hover:text-indigo-500"
        >
          Try again
        </button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="animate-pulse bg-gray-100 rounded-lg h-40"
          ></div>
        ))}
      </div>
    );
  }

  if (workouts.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">No workouts found</p>
        <button
          onClick={() => router.push('/workouts/log')}
          className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
        >
          Log your first workout
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="space-y-4">
        {workouts.map((workout) => (
          <WorkoutCard
            key={workout.id}
            workout={workout}
            onClick={() => handleWorkoutClick(workout.id)}
          />
        ))}
      </div>

      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  );
}
