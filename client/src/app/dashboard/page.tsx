import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import DashboardLayout from "../../components/layout/DashboardLayout";
import FeatureCard from "../../components/dashboard/FeatureCard";

export default async function DashboardPage() {
  const session = await getServerSession();
  
  if (!session) {
    redirect("/login");
  }

  return (
    <DashboardLayout>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
        <FeatureCard
          title="Workout Tracking"
          description="Log and track your workouts"
          icon="📊"
          href="/workouts/log"
          gradient="bg-gradient-to-br from-purple-600 to-blue-500"
        />
        <FeatureCard
          title="Nutrition Planning"
          description="Plan and monitor your meals"
          icon="🥗"
          href="/nutrition"
          gradient="bg-gradient-to-br from-green-500 to-teal-400"
        />
        <FeatureCard
          title="Progress Stats"
          description="View your fitness progress"
          icon="📈"
          href="/progress"
          gradient="bg-gradient-to-br from-orange-500 to-pink-500"
        />
      </div>
    </DashboardLayout>
  );
}
