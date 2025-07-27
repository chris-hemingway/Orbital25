import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Product from '../pages/Product';
import { BrowserRouter } from 'react-router-dom';
import { vi } from 'vitest';

const mockProducts = [
  {
    name: 'Test Phone',
    current_price: 500,
    rating: 4.5,
    num_reviews: 200,
    store_name: 'Amazon',
    image_url: 'image1.jpg',
  },
  {
    name: 'Budget Laptop',
    current_price: 300,
    rating: 4.7,
    num_reviews: 300,
    store_name: 'Shopee',
    image_url: 'image2.jpg',
  },
  {
    name: 'Premium Headphones',
    current_price: 700,
    rating: 4.8,
    num_reviews: 500,
    store_name: 'Amazon',
    image_url: 'image3.jpg',
  },
];

vi.mock('axios', () => ({
  default: {
    get: vi.fn(() =>
      Promise.resolve({
        data: mockProducts,
      })
    ),
  },
}));

describe('Product Page', () => {
  beforeEach(async () => {
    render(
      <BrowserRouter>
        <Product />
      </BrowserRouter>
    );

    // Trigger initial render with search term to show products
    const input = screen.getByPlaceholderText(/search for a product/i);
    fireEvent.change(input, { target: { value: 'phone' } });
    fireEvent.click(screen.getByText(/search/i));

    await waitFor(() => {
      expect(screen.queryByText('Test Phone')).toBeInTheDocument();
    });
  });

  it('renders search input and button', () => {
    expect(screen.getByPlaceholderText(/search for a product/i)).toBeInTheDocument();
    expect(screen.getByText(/search/i)).toBeInTheDocument();
  });

  it('can type in search input', () => {
    const input = screen.getByPlaceholderText(/search for a product/i);
    fireEvent.change(input, { target: { value: 'phone' } });
    expect(input.value).toBe('phone');
  });

  it('filters results on search', async () => {
    const input = screen.getByPlaceholderText(/search for a product/i);
    fireEvent.change(input, { target: { value: 'phone' } });
    fireEvent.click(screen.getByText(/search/i));

    await waitFor(() => {
      expect(screen.getByText('Test Phone')).toBeInTheDocument();
      expect(screen.queryByText('Budget Laptop')).not.toBeInTheDocument();
    });
  });

  it('shows fallback if nothing matches', async () => {
    const input = screen.getByPlaceholderText(/search for a product/i);
    fireEvent.change(input, { target: { value: 'nonexistent' } });
    fireEvent.click(screen.getByText(/search/i));

    await waitFor(() => {
      expect(screen.getByText(/no matching products found/i)).toBeInTheDocument();
    });
  });

});
