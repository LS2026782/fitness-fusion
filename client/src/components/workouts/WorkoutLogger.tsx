'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Exercise, WorkoutSession } from '@prisma/client';
import { useRouter } from 'next/navigation';

const workoutSchema = z.object({
  name: z.string().min(1, 'Workout name is required'),
  notes: z.string().optional(),
});

type WorkoutFormData = z.infer<typeof workoutSchema>;

type ExerciseSet = {
  reps: number;
  weight?: number;
  duration?: number;
  distance?: number;
};

type SelectedExercise = Exercise & {
  sets: ExerciseSet[];
};

export default function WorkoutLogger() {
  const [selectedExercises, setSelectedExercises] = useState<SelectedExercise[]>([]);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<WorkoutFormData>({
    resolver: zodResolver(workoutSchema),
  });

  // Load exercises when component mounts
  useEffect(() => {
    const loadExercises = async () => {
      try {
        const response = await fetch('/api/exercises');
        const data = await response.json();
        setExercises(data);
      } catch (error) {
        console.error('Failed to load exercises:', error);
      }
    };
    loadExercises();
  }, []);

  const onSubmit = async (data: WorkoutFormData) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/workouts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          exercises: selectedExercises.map((exercise) => ({
            exerciseId: exercise.id,
            sets: exercise.sets,
          })),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create workout');
      }

      const workout: WorkoutSession = await response.json();
      reset();
      setSelectedExercises([]);
      router.push('/workouts/history');
    } catch (error) {
      console.error('Failed to save workout:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const addSet = (exerciseId: string) => {
    setSelectedExercises((prev) =>
      prev.map((exercise) => {
        if (exercise.id === exerciseId) {
          return {
            ...exercise,
            sets: [...exercise.sets, { reps: 0 }],
          };
        }
        return exercise;
      })
    );
  };

  const updateSet = (exerciseId: string, setIndex: number, field: keyof ExerciseSet, value: number) => {
    setSelectedExercises((prev) =>
      prev.map((exercise) => {
        if (exercise.id === exerciseId) {
          const newSets = [...exercise.sets];
          newSets[setIndex] = {
            ...newSets[setIndex],
            [field]: value,
          };
          return {
            ...exercise,
            sets: newSets,
          };
        }
        return exercise;
      })
    );
  };

  const removeSet = (exerciseId: string, setIndex: number) => {
    setSelectedExercises((prev) =>
      prev.map((exercise) => {
        if (exercise.id === exerciseId) {
          const newSets = exercise.sets.filter((_, index) => index !== setIndex);
          return {
            ...exercise,
            sets: newSets,
          };
        }
        return exercise;
      })
    );
  };

  const toggleExercise = (exercise: Exercise) => {
    if (selectedExercises.some((e) => e.id === exercise.id)) {
      setSelectedExercises(selectedExercises.filter((e) => e.id !== exercise.id));
    } else {
      setSelectedExercises([...selectedExercises, { ...exercise, sets: [] }]);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Workout Name
          </label>
          <input
            type="text"
            id="name"
            {...register('name')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            placeholder="e.g., Morning Workout"
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
            Notes
          </label>
          <textarea
            id="notes"
            {...register('notes')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            rows={3}
            placeholder="Any notes about this workout..."
          />
        </div>

        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Select Exercises</h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {exercises.map((exercise) => (
              <div
                key={exercise.id}
                className={`relative rounded-lg border p-4 cursor-pointer ${
                  selectedExercises.some((e) => e.id === exercise.id)
                    ? 'border-indigo-500 bg-indigo-50'
                    : 'border-gray-300 hover:border-indigo-500'
                }`}
                onClick={() => toggleExercise(exercise)}
              >
                <h4 className="text-sm font-medium text-gray-900">{exercise.name}</h4>
                <p className="mt-1 text-xs text-gray-500">{exercise.muscleGroup}</p>
              </div>
            ))}
          </div>
        </div>

        {selectedExercises.length > 0 && (
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900">Log Sets</h3>
            {selectedExercises.map((exercise) => (
              <div key={exercise.id} className="border rounded-lg p-4">
                <h4 className="text-md font-medium text-gray-900 mb-2">{exercise.name}</h4>
                <div className="space-y-2">
                  {exercise.sets.map((set, setIndex) => (
                    <div key={setIndex} className="flex items-center gap-4">
                      <div className="w-8 text-sm text-gray-500">#{setIndex + 1}</div>
                      <div>
                        <label className="sr-only">Reps</label>
                        <input
                          type="number"
                          value={set.reps}
                          onChange={(e) => updateSet(exercise.id, setIndex, 'reps', parseInt(e.target.value))}
                          className="w-20 rounded-md border-gray-300"
                          placeholder="Reps"
                        />
                      </div>
                      <div>
                        <label className="sr-only">Weight (kg)</label>
                        <input
                          type="number"
                          value={set.weight || ''}
                          onChange={(e) => updateSet(exercise.id, setIndex, 'weight', parseInt(e.target.value))}
                          className="w-20 rounded-md border-gray-300"
                          placeholder="Weight"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => removeSet(exercise.id, setIndex)}
                        className="text-red-600 hover:text-red-800"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => addSet(exercise.id)}
                    className="mt-2 text-sm text-indigo-600 hover:text-indigo-800"
                  >
                    + Add Set
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isLoading || selectedExercises.length === 0}
            className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Saving...' : 'Save Workout'}
          </button>
        </div>
      </form>
    </div>
  );
}
