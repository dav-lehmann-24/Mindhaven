import { render, screen } from '@testing-library/react';
import App from './App';

test('renders login welcome title', () => {
  render(<App />);
  const heading = screen.getByText(/Welcome to Mindhaven!/i);
  expect(heading).toBeInTheDocument();
});

test('can preview dashboard via button', () => {
  render(<App />);
  const previewBtn = screen.getByText(/Preview the Dashboard/i);
  expect(previewBtn).toBeInTheDocument();
});
