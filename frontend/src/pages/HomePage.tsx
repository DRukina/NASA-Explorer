import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Satellite } from 'lucide-react';
import { Header } from '../components/layout/Header';
import { FeatureCard } from '../components/ui/FeatureCard';
import { StatCard } from '../components/ui/StatCard';
import { featureCards, quickStats } from '../data/homePageData';

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <Header />

      {/* Hero Section */}
      <main className="flex-1 flex items-center justify-center px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-8">
            <h1 className="text-responsive-xl font-bold text-gradient mb-6">
              Explore the Cosmos with NASA
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Discover the wonders of space through NASA's incredible data. From
              stunning astronomy pictures to tracking near-Earth objects, embark
              on a journey through the universe.
            </p>
          </div>

          {/* Feature Cards */}
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            {featureCards.map((card, index) => (
              <FeatureCard key={index} {...card} />
            ))}
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {quickStats.map((stat, index) => (
              <StatCard key={index} {...stat} />
            ))}
          </div>

          {/* CTA */}
          <div className="space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center">
            <Link
              to="/apod"
              className="btn-primary inline-flex items-center space-x-2"
            >
              <Calendar className="h-5 w-5" />
              <span>View Today's APOD</span>
            </Link>
            <Link
              to="/neo"
              className="btn-secondary inline-flex items-center space-x-2"
            >
              <Satellite className="h-5 w-5" />
              <span>Track Asteroids</span>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default HomePage;
