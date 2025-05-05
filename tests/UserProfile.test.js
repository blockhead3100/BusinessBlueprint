import 'whatwg-fetch';
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import UserProfile from '../src/components/UserProfile';

// Correctly mock the fetch function
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () =>
      Promise.resolve({
        name: 'John Doe',
        email: 'john.doe@example.com',
      }),
  })
);

test('should render user details correctly', async () => {
  render(<UserProfile />);

  await waitFor(() => {
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('john.doe@example.com')).toBeInTheDocument();
  });
});