import { Calendar, Satellite, Telescope, Zap } from 'lucide-react';

export const featureCards = [
  {
    to: '/apod',
    icon: Calendar,
    iconColor: 'text-cosmic-blue',
    iconBgColor: 'bg-cosmic-blue',
    title: 'Astronomy Picture of the Day',
    subtitle: 'Daily cosmic imagery and explanations',
    description:
      'Explore breathtaking images of our universe, from distant galaxies to planetary phenomena, with detailed explanations from NASA astronomers.',
    hoverColor: 'text-cosmic-blue',
  },
  {
    to: '/neo',
    icon: Satellite,
    iconColor: 'text-stellar-gold',
    iconBgColor: 'bg-stellar-gold',
    title: 'Near Earth Objects',
    subtitle: 'Track asteroids and comets near Earth',
    description:
      'Monitor asteroids and comets approaching Earth with real-time data, visualizations, and detailed information about potential hazards.',
    hoverColor: 'text-stellar-gold',
  },
];

export const quickStats = [
  {
    icon: Zap,
    iconColor: 'text-cosmic-blue',
    value: 'Real-time',
    label: 'NASA Data',
  },
  {
    icon: Calendar,
    iconColor: 'text-stellar-gold',
    value: 'Daily',
    label: 'Updates',
  },
  {
    icon: Satellite,
    iconColor: 'text-nebula-pink',
    value: 'Live',
    label: 'Tracking',
  },
  {
    icon: Telescope,
    iconColor: 'text-cosmic-blue',
    value: 'HD',
    label: 'Imagery',
  },
];
