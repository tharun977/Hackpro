import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Users, Trophy, Brain } from 'lucide-react';

export default function Home() {
  return (
    <div className="space-y-16">
      <section className="text-center space-y-4">
        <h1 className="text-5xl font-bold text-gray-900">
          Safe and Transparent Gaming Platform
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Experience the future of online gaming with enhanced security, fair play, and
          responsible gaming practices.
        </p>
        <div className="flex justify-center space-x-4">
          <Link
            to="/register"
            className="bg-indigo-600 text-white px-6 py-3 rounded-md hover:bg-indigo-700 transition-colors text-lg font-semibold"
          >
            Get Started
          </Link>
          <Link
            to="/login"
            className="bg-white text-indigo-600 px-6 py-3 rounded-md border-2 border-indigo-600 hover:bg-indigo-50 transition-colors text-lg font-semibold"
          >
            Sign In
          </Link>
        </div>
      </section>

      <section className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
        <FeatureCard
          icon={<Shield className="h-8 w-8 text-indigo-600" />}
          title="Secure Gaming"
          description="Advanced security measures including MFA and fraud detection to keep your gaming experience safe."
        />
        <FeatureCard
          icon={<Users className="h-8 w-8 text-indigo-600" />}
          title="Community Driven"
          description="Connect with other players, share strategies, and participate in moderated discussions."
        />
        <FeatureCard
          icon={<Trophy className="h-8 w-8 text-indigo-600" />}
          title="Fair Play"
          description="Transparent gameplay mechanics and tamper-proof leaderboards ensure fair competition."
        />
        <FeatureCard
          icon={<Brain className="h-8 w-8 text-indigo-600" />}
          title="Skill Based"
          description="Clear distinction between skill-based games and gambling, promoting responsible gaming."
        />
      </section>

      <section className="bg-white rounded-lg shadow-xl p-8">
        <h2 className="text-3xl font-bold text-center mb-8">Why Choose i-Hack Gaming?</h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Security First</h3>
            <ul className="list-disc list-inside space-y-2 text-gray-600">
              <li>Multi-factor authentication</li>
              <li>End-to-end encrypted communication</li>
              <li>AI-powered fraud detection</li>
              <li>Secure payment processing</li>
            </ul>
          </div>
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Responsible Gaming</h3>
            <ul className="list-disc list-inside space-y-2 text-gray-600">
              <li>Self-imposed gaming limits</li>
              <li>Addiction risk detection</li>
              <li>Cooling-off periods</li>
              <li>Educational resources</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ icon, title, description }: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}