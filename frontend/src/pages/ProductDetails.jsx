import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card, Rate, Button, Space, notification } from 'antd';
import { HeartOutlined, HeartFilled, ArrowLeftOutlined } from '@ant-design/icons';
import { jwtDecode } from 'jwt-decode';
import { useAuth } from '../components/AuthContext';
import axios from 'axios';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts'

function ProductDetails() {
  const { state } = useLocation();
  const product = state?.product;
  const { token } = useAuth();
  const [wishlisted, setWishlisted] = useState(false);
  const [api, contextHolder] = notification.useNotification();
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;

  const [priceHistory, setPriceHistory] = useState([]);

  // Check if product is already in wishlist
  useEffect(() => {
    const checkIfWishlisted = async () => {
      if (!token || !product?.product_id) return;
  
      try {
        const res = await axios.get(`${API_URL}/api/wishlist`, {
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

  // Set price history (only for specific 4 products)
   useEffect(() => {
     if (product?.product_id && [184, 229, 95, 79].includes(product.product_id)) {
       const rawHistory = [...product.price_history].sort(
         (a, b) => new Date(a.date) - new Date(b.date)
       );

       const today = new Date();
       const todayStr = today.toISOString().split('T')[0]; // "YYYY-MM-DD"
       const steppedData = [];

       // Step through each history point and assign the *next* price
       for (let i = 0; i < rawHistory.length - 1; i++) {
         const date = new Date(rawHistory[i].date);
         const price = rawHistory[i + 1].price;

         steppedData.push({ price, date });
       }

       // Handle current price
       const lastHistoryDate = new Date(rawHistory[rawHistory.length - 1].date);
       steppedData.push({
         price: product.current_price,
         date: lastHistoryDate,
       });

       if (lastHistoryDate.toDateString() !== today.toDateString()) {
         steppedData.push({
           price: product.current_price,
           date: today,
         });
       }


       setPriceHistory(steppedData);
     }
   }, [product]);


    // Predict next price using 3-point moving average
   const getPrediction = () => {
      const lastThree = priceHistory.slice(-3).map((p) => p.price);
      if (lastThree.length === 0) return null;
      const avg =
        lastThree.reduce((sum, val) => sum + val, 0) / lastThree.length;
      return avg.toFixed(2);
    };

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
          `${API_URL}/api/wishlist`,
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
        await axios.delete(`${API_URL}/api/wishlist/${product.product_id}`, {
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
                View In Store
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

      {/* 📊 Price History Graph */}
            {priceHistory.length > 0 && (
              <div style={{ width: '100%', maxWidth: 800, marginTop: '2rem' }}>
                <h3>Price History</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={priceHistory}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="date"
                      type="number"
                      scale="time"
                      domain={['auto', 'auto']}
                      tickFormatter={(date) =>
                        new Date(date).toLocaleDateString('en-CA') // shows YYYY-MM-DD
                      }
                    />
                    <YAxis domain={['auto', 'auto']} />
                    <Tooltip />
                    <Line
                      type="stepAfter"
                      dataKey="price"
                      stroke="#8884d8"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
                <p style={{ marginTop: '1rem' }}>
                  <strong>Predicted Next Price:</strong> S${getPrediction()}
                </p>
              </div>
            )}
          </div>
  );
}

export default ProductDetails;