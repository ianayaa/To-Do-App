import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ResetPassword from '../pages/ResetPassword';

describe('ResetPassword Component', () => {
  const mockNavigate = jest.fn();

  beforeEach(() => {
    render(
      <BrowserRouter>
        <ResetPassword />
      </BrowserRouter>
    );
  });

  test('renders reset password form', () => {
    expect(screen.getByText(/Reset Password/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Confirm Password/i)).toBeInTheDocument();
  });

  test('validates password match', async () => {
    const passwordInput = screen.getByLabelText(/Password/i);
    const confirmPasswordInput = screen.getByLabelText(/Confirm Password/i);
    
    fireEvent.change(passwordInput, { target: { value: 'test123' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'test124' } });
    
    const submitButton = screen.getByRole('button', { name: /Reset Password/i });
    fireEvent.click(submitButton);
    
    expect(await screen.findByText(/Passwords do not match/i)).toBeInTheDocument();
  });
});
