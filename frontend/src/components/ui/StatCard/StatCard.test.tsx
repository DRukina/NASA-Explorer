import { render, screen } from '@testing-library/react';
import { StatCard } from './StatCard';
import type { LucideIcon, LucideProps } from 'lucide-react';
import { forwardRef } from 'react';

const MockIcon: LucideIcon = forwardRef<SVGSVGElement, LucideProps>(
  (props, ref) => <svg ref={ref} {...props} />
);
MockIcon.displayName = 'MockIcon';

describe('StatCard', () => {
  it('renders with the correct value and label', () => {
    render(
      <StatCard
        icon={MockIcon}
        iconColor="text-blue-500"
        value="123"
        label="Test Stat"
      />
    );
    expect(screen.getByText('123')).toBeInTheDocument();
    expect(screen.getByText('Test Stat')).toBeInTheDocument();
  });
});
