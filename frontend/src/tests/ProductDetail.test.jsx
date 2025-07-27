import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { render, screen } from '@testing-library/react';
import ProductDetails from '../pages/ProductDetails';
import { MemoryRouter } from 'react-router-dom';

vi.mock('../components/AuthContext', () => ({
  useAuth: () => ({ token: 'mock-token' }),
}));

describe('ProductDetails Component', () => {
  it('renders product details correctly', () => {
    const mockProduct = {
      name: 'UGREEN Magnetic Case',
      current_price: 11.98,
      rating: 4,
      num_reviews: 1525,
      store_name: 'Amazon',
      link: 'https://amazon.com',
      image_url: 'https://example.com/image.jpg'
    };

    render(
      <MemoryRouter initialEntries={[{ state: { product: mockProduct } }]}>
        <ProductDetails />
      </MemoryRouter>
    );

    expect(screen.getByText(/UGREEN Magnetic Case/i)).toBeInTheDocument();
    expect(screen.getByText(/S\$11\.98/)).toBeInTheDocument();
    expect(screen.getByText('Amazon')).toBeInTheDocument();
  });
});