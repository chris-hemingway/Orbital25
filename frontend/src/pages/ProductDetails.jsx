import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card, Rate, Button, Space, notification } from 'antd';
import { HeartOutlined, HeartFilled, ArrowLeftOutlined } from '@ant-design/icons';
import { jwtDecode } from 'jwt-decode';
import { useAuth } from '../components/AuthContext';
import axios from 'axios';

function ProductDetails() {
  const { state } = useLocation();
  const product = state?.product;
  const { token } = useAuth();
  const [wishlisted, setWishlisted] = useState(false);
  const [api, contextHolder] = notification.useNotification();
  const navigate = useNavigate();

  useEffect(() => {
    const checkIfWishlisted = async () => {
      if (!token || !product?.product_id) return;
  
      try {
        const res = await axios.get('http://localhost:5001/api/wishlist', {
          headers: { Authorization: `Bearer ${token}` }
        });
  
        const wishlistedProductIds = res.data.map((item) => item.product_id);
        if (wishlistedProductIds.includes(product.product_id)) {
          setWishlisted(true);
        }
      } catch (err) {
        console.error('Failed to fetch wishlist', err);
      }
    };
  
    checkIfWishlisted();
  }, [token, product]);

  if (!product) {
    return <p>No product data available.</p>;
  }

  const handleWishlistClick = async () => {
    if (!token) {
      api.info({
        message: 'Login Required',
        description: 'Please log in to manage your wishlist.',
        placement: 'topRight',
      });
      return;
    }

    try {
      const user = jwtDecode(token);
      const userId = user?.id || user?._id;

      if (!userId) throw new Error('Invalid user');

      if (!wishlisted) {
        // Add to wishlist
        await axios.post(
          'http://localhost:5001/api/wishlist',
          { product_id: product.product_id },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        api.success({
          message: 'Added to Wishlist',
          description: 'This item has been added to your wishlist.',
          placement: 'topRight',
        });
        setWishlisted(true);
      } else {
        // Remove from wishlist
        await axios.delete(`http://localhost:5001/api/wishlist/${product.product_id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        api.info({
          message: 'Removed from Wishlist',
          description: 'This item has been removed from your wishlist.',
          placement: 'topRight',
        });
        setWishlisted(false);
      }

    } catch (err) {
      console.error(err);
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
        flexDirection: 'column',
        minHeight: '100vh',
        padding: '2rem',
        backgroundColor: '#fdfdfd',
        alignItems: 'center',
      }}
    >
      {contextHolder}

      <div style={{ alignSelf: 'flex-start', marginBottom: '3rem', marginTop: '4rem' }}>
        <Button icon={<ArrowLeftOutlined />} onClick={() => navigate(-1)}>
          Back
        </Button>
      </div>

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
                href={product.link}
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