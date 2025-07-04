import { render, screen, fireEvent } from '@testing-library/react';
import { FilterDropdown } from './FilterDropdown';

const options = [
  { value: 'one', label: 'One' },
  { value: 'two', label: 'Two' },
  { value: 'three', label: 'Three' },
];

describe('FilterDropdown', () => {
  it('renders with the correct initial value', () => {
    render(
      <FilterDropdown
        value="one"
        onChange={jest.fn()}
        options={options}
        label="Test Dropdown"
      />
    );
    expect(screen.getByText('One')).toBeInTheDocument();
  });

  it('opens the dropdown when the button is clicked', () => {
    render(
      <FilterDropdown
        value="one"
        onChange={jest.fn()}
        options={options}
        label="Test Dropdown"
      />
    );

    fireEvent.click(screen.getByRole('button'));
    expect(screen.getByText('Two')).toBeInTheDocument();
    expect(screen.getByText('Three')).toBeInTheDocument();
  });

  it('calls onChange with the correct value when an option is clicked', () => {
    const handleChange = jest.fn();
    render(
      <FilterDropdown
        value="one"
        onChange={handleChange}
        options={options}
        label="Test Dropdown"
      />
    );

    fireEvent.click(screen.getByRole('button'));
    fireEvent.click(screen.getByText('Two'));

    expect(handleChange).toHaveBeenCalledWith(
      expect.objectContaining({
        target: { value: 'two' },
      })
    );
  });
});
