import { render } from '@testing-library/react';
import { LoadingSkeleton } from './LoadingSkeleton';

describe('LoadingSkeleton', () => {
  it('renders with the default rectangular variant', () => {
    const { container } = render(<LoadingSkeleton />);
    expect(container.firstChild).toHaveClass(
      'skeleton animate-pulse bg-gray-700 rounded'
    );
  });

  it('renders with the text variant', () => {
    const { container } = render(<LoadingSkeleton variant="text" />);
    expect(container.firstChild).toHaveClass('h-4 w-full');
  });

  it('renders with the circular variant', () => {
    const { container } = render(<LoadingSkeleton variant="circular" />);
    expect(container.firstChild).toHaveClass('rounded-full');
  });

  it('renders with the card variant', () => {
    const { container } = render(<LoadingSkeleton variant="card" />);
    expect(container.firstChild).toHaveClass('h-48 w-full rounded-xl');
  });

  it('renders the correct number of lines', () => {
    const { container } = render(<LoadingSkeleton variant="text" lines={3} />);
    const skeletons = container.querySelectorAll('.skeleton');
    expect(skeletons.length).toBe(3);
  });
});
