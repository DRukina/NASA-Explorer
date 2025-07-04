import { forwardRef } from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { FeatureCard } from './FeatureCard';
import type { LucideIcon, LucideProps } from 'lucide-react';

const MockIcon: LucideIcon = forwardRef<SVGSVGElement, LucideProps>(
  (props, ref) => <svg ref={ref} {...props} />
);
MockIcon.displayName = 'MockIcon';

describe('FeatureCard', () => {
  const mockProps = {
    to: '/test',
    icon: MockIcon,
    iconColor: 'text-blue-500',
    iconBgColor: 'bg-blue-500',
    title: 'Test Title',
    subtitle: 'Test Subtitle',
    description: 'Test Description',
    hoverColor: 'text-red-500',
  };

  it('renders the card with the correct content', () => {
    render(
      <MemoryRouter>
        <FeatureCard {...mockProps} />
      </MemoryRouter>
    );

    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByText('Test Subtitle')).toBeInTheDocument();
    expect(screen.getByText('Test Description')).toBeInTheDocument();

    const linkElement = screen.getByRole('link');
    expect(linkElement).toHaveAttribute('href', '/test');
  });
});
