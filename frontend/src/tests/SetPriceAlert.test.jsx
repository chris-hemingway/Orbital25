import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ProductDetails from '../pages/ProductDetails';
import { vi } from 'vitest';
import axios from 'axios';

vi.mock('../components/AuthContext', () => ({
  useAuth: () => ({ 
    token: 'mock-token',
    username: 'testuser',
    isGuest: false,
    login: vi.fn(),
    logout: vi.fn(),
    loginAsGuest: vi.fn()
  }),
}));

vi.mock('axios');

test('sets price alert correctly when user submits', async () => {
  axios.post.mockResolvedValue({ data: { success: true } });

  const mockProduct = {
    _id: '123',
    name: 'UGREEN Magnetic Case',
    current_price: 11.98,
    rating: 4,
    num_reviews: 1525,
    store_name: 'Amazon',
    link: 'https://amazon.com',
    image_url: 'https://example.com/image.jpg',
    price_history: [
      { date: new Date(Date.now() - 86400000), price: 12.50 },
      { date: new Date(), price: 11.98 }
    ]
  };

  render(
    <MemoryRouter initialEntries={[{ state: { product: mockProduct } }]}>
      <ProductDetails />
    </MemoryRouter>
  );

  // Expand the "Price Details" panel
  const priceDetailsHeader = screen.getByText(/price details/i);
  fireEvent.click(priceDetailsHeader);

  // Open the price alert modal
  const setAlertButton = await screen.findByTestId('set-price-alert-btn');
  fireEvent.click(setAlertButton);

  // Verify modal is visible
  const modal = await screen.findByTestId('price-alert-modal');
  expect(modal).toBeInTheDocument();

  // Fill out and submit the form
  const priceInput = await screen.findByTestId('price-input');
  fireEvent.change(priceInput, { target: { value: '10.00' } });

  const confirmButton = await screen.findByTestId('confirm-set-alert');
  fireEvent.click(confirmButton);

  // Verify the modal is closed by checking:
  await waitFor(() => {
    const modalWrap = document.querySelector('.ant-modal-wrap');
    expect(modalWrap).toHaveStyle('display: none');
  }, { timeout: 3000 });

  // Verify API call
  expect(axios.post).toHaveBeenCalledWith(
    expect.stringContaining('/api/alerts'),
    expect.objectContaining({
      product: '123',
      target_price: 10.00
    }),
    expect.any(Object)
  );
});