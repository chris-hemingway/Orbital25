import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Card, Rate, Button, Space, notification } from 'antd';
import { HeartOutlined, HeartFilled } from '@ant-design/icons';
import { jwtDecode } from 'jwt-decode';
import { useAuth } from '../components/AuthContext';

function ProductDetails() {
  const { state } = useLocation();
  const product = state?.product;
  const { token } = useAuth();
  const [wishlisted, setWishlisted] = useState(false);
  const [api, contextHolder] = notification.useNotification();

  if (!product) {
    return <p>No product data available.</p>;
  }

  const handleWishlistClick = () => {
    if (!token) {
      api.info({
        message: 'Login Required',
        description: 'Please log in to add items to your wishlist.',
        placement: 'topRight',
      });
      return;
    }

    try {
      const user = jwtDecode(token);
      if (!user?.id) throw new Error('Invalid user');

      setWishlisted(true);

      api.success({
        message: 'Added to Wishlist',
        description: 'This item has been added to your wishlist.',
        placement: 'topRight',
      });

      // TODO: Send to backend
      // await axios.post('/api/wishlist', { userId: user.id, productId: product.id });

    } catch (err) {
      api.error({
        message: 'Error',
        description: 'Invalid or expired login. Please re-authenticate.',
        placement: 'topRight',
      });
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        padding: '2rem',
        backgroundColor: '#fdfdfd',
      }}
    >
      {contextHolder}

      <Card style={{ width: '800px', padding: '1rem' }}>
        <div style={{ display: 'flex', flexDirection: 'row', gap: '2rem' }}>
          <img
            alt={product.name}
            src={product.image_url}
            style={{
              width: '300px',
              height: '300px',
              objectFit: 'cover',
              borderRadius: '8px',
            }}
          />

          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
            <h2>{product.name}</h2>
            <p><strong>Price:</strong> S${product.current_price}</p>
            <p>
              <strong>Rating:</strong>{' '}
              <Rate disabled defaultValue={product.rating} /> ({product.num_reviews} reviews)
            </p>
            <p><strong>Store:</strong> {product.store_name}</p>

            <Space size="middle" align="center">
              <Button
                type="primary"
                href={product.product_link}
                target="_blank"
                style={{ backgroundColor: '#ff2d87', borderColor: '#ff2d87' }}
              >
                View on Store
              </Button>

              <div onClick={handleWishlistClick} style={{ cursor: 'pointer', fontSize: '20px' }}>
                {wishlisted ? (
                  <HeartFilled style={{ color: '#eb2f96' }} />
                ) : (
                  <HeartOutlined style={{ color: '#eb2f96' }} />
                )}
              </div>
            </Space>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default ProductDetails;