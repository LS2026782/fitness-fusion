import { format } from 'date-fns';
import { WorkoutSession, WorkoutExercise, Exercise } from '@prisma/client';

type WorkoutCardProps = {
  workout: WorkoutSession & {
    exercises: (WorkoutExercise & {
      exercise: Exercise;
    })[];
  };
  onClick?: () => void;
};

export default function WorkoutCard({ workout, onClick }: WorkoutCardProps) {
  return (
    <div
      className="bg-white rounded-lg shadow-sm border p-4 hover:shadow-md transition-shadow cursor-pointer"
      onClick={onClick}
    >
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            {workout.name || 'Untitled Workout'}
          </h3>
          <p className="text-sm text-gray-500">
            {format(new Date(workout.date), 'PPP')}
          </p>
        </div>
        {workout.duration && (
          <span className="text-sm text-gray-600">
            {workout.duration} minutes
          </span>
        )}
      </div>

      <div className="space-y-2">
        <div className="flex flex-wrap gap-2">
          {workout.exercises.map(({ exercise }) => (
            <span
              key={exercise.id}
              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
            >
              {exercise.name}
            </span>
          ))}
        </div>

        {workout.notes && (
          <p className="text-sm text-gray-600 mt-2 line-clamp-2">
            {workout.notes}
          </p>
        )}

        <div className="flex justify-between items-center mt-3 text-sm text-gray-500">
          <span>{workout.exercises.length} exercises</span>
          <span>
            {workout.exercises.reduce((total, ex) => total + ex.sets, 0)} total sets
          </span>
        </div>
      </div>
    </div>
  );
}
