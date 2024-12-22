'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Session } from 'next-auth';

const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  height: z.number().min(0).optional(),
  weight: z.number().min(0).optional(),
  fitnessGoal: z.enum(['weight_loss', 'muscle_gain', 'maintenance', 'general_fitness']).optional(),
  activityLevel: z.enum(['sedentary', 'light', 'moderate', 'very_active']).optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

interface ProfileFormProps {
  user: Session['user'];
}

export default function ProfileForm({ user }: ProfileFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || '',
    },
  });

  const onSubmit = async (data: ProfileFormData) => {
    try {
      setIsLoading(true);
      setError(null);
      setSuccess(false);

      const response = await fetch('/api/profile/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update profile');
      }

      setSuccess(true);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 p-6">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-200">
          Name
        </label>
        <input
          {...register('name')}
          type="text"
          className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="height" className="block text-sm font-medium text-gray-200">
          Height (cm)
        </label>
        <input
          {...register('height', { valueAsNumber: true })}
          type="number"
          step="0.1"
          className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
        {errors.height && (
          <p className="mt-1 text-sm text-red-500">{errors.height.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="weight" className="block text-sm font-medium text-gray-200">
          Weight (kg)
        </label>
        <input
          {...register('weight', { valueAsNumber: true })}
          type="number"
          step="0.1"
          className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
        {errors.weight && (
          <p className="mt-1 text-sm text-red-500">{errors.weight.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="fitnessGoal" className="block text-sm font-medium text-gray-200">
          Fitness Goal
        </label>
        <select
          {...register('fitnessGoal')}
          className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">Select a goal</option>
          <option value="weight_loss">Weight Loss</option>
          <option value="muscle_gain">Muscle Gain</option>
          <option value="maintenance">Maintenance</option>
          <option value="general_fitness">General Fitness</option>
        </select>
        {errors.fitnessGoal && (
          <p className="mt-1 text-sm text-red-500">{errors.fitnessGoal.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="activityLevel" className="block text-sm font-medium text-gray-200">
          Activity Level
        </label>
        <select
          {...register('activityLevel')}
          className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">Select activity level</option>
          <option value="sedentary">Sedentary</option>
          <option value="light">Light</option>
          <option value="moderate">Moderate</option>
          <option value="very_active">Very Active</option>
        </select>
        {errors.activityLevel && (
          <p className="mt-1 text-sm text-red-500">{errors.activityLevel.message}</p>
        )}
      </div>

      {error && (
        <div className="rounded-md bg-red-50 p-4">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">{error}</h3>
            </div>
          </div>
        </div>
      )}

      {success && (
        <div className="rounded-md bg-green-50 p-4">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-green-800">
                Profile updated successfully
              </h3>
            </div>
          </div>
        </div>
      )}

      <div>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </form>
  );
}
