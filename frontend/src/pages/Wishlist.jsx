import { useEffect, useState } from 'react';
import { Card, Row, Col, Typography, Spin, Empty } from 'antd';
import { useAuth } from '../components/AuthContext';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const { Title } = Typography;

function Wishlist() {
  const { token } = useAuth();
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchWishlistDetails = async () => {
      if (!token) return;
      try {
        const decoded = jwtDecode(token);
        const res = await axios.get(`${API_URL}/api/wishlist`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const productIds = res.data.map((item) => item.product_id);

        const productDetails = await axios.get(`${API_URL}/api/products`);
        const filtered = productDetails.data.filter((p) => productIds.includes(p.product_id));

        setWishlist(filtered);
      } catch (err) {
        console.error('Failed to fetch wishlist', err);
      } finally {
        setLoading(false);
      }
    };

    fetchWishlistDetails();
  }, [token]);

  return (
    <div style={{ padding: '2rem', minHeight: '100vh', background: '#fff' }}>
      <Title level={2} style={{ textAlign: 'center', marginBottom: '2rem', marginTop: '2rem' }}>Your Wishlist</Title>

      {loading ? (
        <Spin size="large" style={{ display: 'block', margin: 'auto' }} />
      ) : wishlist.length === 0 ? (
        <Empty description="Your wishlist is empty." style={{ marginTop: '4rem' }} />
      ) : (
        <Row gutter={[24, 24]} justify="center">
          {wishlist.map((product) => (
            <Col xs={24} sm={12} md={8} lg={6} key={product.product_id}>
              <Card
                hoverable
                cover={<img alt={product.name} src={product.image_url} style={{ height: '200px', objectFit: 'cover' }} />}
                onClick={() => navigate('/product-details', { state: { product } })}
              >
                <Card.Meta
                  title={product.name}
                  description={`S$${product.current_price} | ${product.store_name}`}
                />
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
}

export default Wishlist;
