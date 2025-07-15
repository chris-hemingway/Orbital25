import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, List, Typography, Button, Pagination, message, Popconfirm } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { useAuth } from '../components/AuthContext';
import { useNavigate } from 'react-router-dom';

const { Title } = Typography;

function Dashboard() {
  const { token } = useAuth();
  const API_URL = import.meta.env.VITE_API_URL;

  const [alerts, setAlerts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;
  const [wishlist, setWishlist] = useState([]);
  const [wishlistPage, setWishlistPage] = useState(1);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchAlerts = async () => {
      if (!token) return;

      try {
        const res = await axios.get(`${API_URL}/api/alerts`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAlerts(res.data);
      } catch (err) {
        console.error('Failed to fetch alerts', err);
      }
    };

    fetchAlerts();
  }, [token]);

  useEffect(() => {
    const fetchWishlistDetails = async () => {
      if (!token) return;
      try {
        const res = await axios.get(`${API_URL}/api/wishlist`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const productIds = res.data.map((item) => item.product_id);

        const productDetails = await axios.get(`${API_URL}/api/products`);
        const filtered = productDetails.data.filter((p) => productIds.includes(p.product_id));

        setWishlist(filtered);
      } catch (err) {
        console.error('Failed to fetch wishlist', err);
      } 
    };

    fetchWishlistDetails();
  }, [token]);

  const handleDelete = async (alertId) => {
    try {
      await axios.delete(`${API_URL}/api/alerts/${alertId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      message.success('Alert removed');
      setAlerts((prev) => prev.filter((alert) => alert._id !== alertId));
    } catch (err) {
      console.error('Failed to delete alert', err);
      message.error('Could not delete alert');
    }
  };

  const handleRemoveWishlist = async (productId) => {
    try {
      await axios.delete(`${API_URL}/api/wishlist/${productId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      message.success('Removed from wishlist');
      setWishlist((prev) => prev.filter((item) => item.product_id !== productId));
    } catch (err) {
      console.error('Failed to remove from wishlist', err);
      message.error('Could not remove from wishlist');
    }
  };

  const pagedAlerts = alerts.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const pagedWishlist = wishlist.slice((wishlistPage - 1) * pageSize, wishlistPage * pageSize);

  return (
    <div style={{ display: 'flex', padding: '4rem', minHeight: '100vh', background: '#fafafa' }}>
      {/* Left Column: Price Alerts */}
      <div style={{ flex: 1, marginRight: '1rem' }}>
        <Card title="Your Price Alerts" variant={false}>
          {pagedAlerts.length > 0 ? (
            <>
              <List
                itemLayout="horizontal"
                dataSource={pagedAlerts}
                renderItem={(alert) => (
                  <List.Item
                  actions={[
                    <Button onClick={() => navigate('/product-details', { state: { product: alert.product } })}>
                      View Product
                    </Button>,
                    <Button
                    onClick={() => window.open(alert.product.link, '_blank', 'noopener,noreferrer')}
                  >
                    Store
                    </Button>,
                    <Popconfirm
                      title="Are you sure you want to delete this alert?"
                      onConfirm={() => handleDelete(alert._id)}
                      okText="Yes"
                      cancelText="No"
                      >
                    <Button
                      icon={<DeleteOutlined />}
                      danger
                    >
                      Delete
                    </Button>
                  </Popconfirm>,
                  ]}
                  >
                    {alert.product ? (
                      <List.Item.Meta
                        avatar={
                          <img
                            src={alert.product.image_url}
                            alt={alert.product.name}
                            style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 4 }}
                          />
                        }
                        title={<strong>{alert.product.name}</strong>}
                        description={`Target Price: S$${alert.target_price} | Current Price:S$${alert.product.current_price} | Store: ${alert.product.store_name} `}
                      />
                    ) : (
                      <List.Item.Meta
                        title={<strong>Unknown Product</strong>}
                        description={`Target Price: S$${alert.target_price}`}
                      />
                    )}
                  </List.Item>
                )}
              />
              <Pagination
                style={{ marginTop: '1rem', textAlign: 'center' }}
                current={currentPage}
                pageSize={pageSize}
                total={alerts.length}
                onChange={(page) => setCurrentPage(page)}
              />
            </>
          ) : (
            <p>No price alerts set.</p>
          )}
        </Card>
      </div>

     {/* Right Column: Wishlist */}
      <div style={{ flex: 1, marginLeft: '1rem' }}>
        <Card title="Your Wishlist" variant={false}>
          {wishlist.length > 0 ? (
            <>
              <List
                itemLayout="horizontal"
                dataSource={pagedWishlist}
                renderItem={(product) => (
                  <List.Item
                  actions={[
                    <Button onClick={() => navigate('/product-details', { state: { product } })}>
                      View Product
                    </Button>,
                    <Button
                      onClick={() => window.open(product.link, '_blank', 'noopener,noreferrer')}
                    >
                      Store
                    </Button>,
                    <Popconfirm
                      title="Are you sure you want to delete this wishlist?"
                      onConfirm={() => handleRemoveWishlist(product.product_id)}
                      okText="Yes"
                      cancelText="No"
                      >
                    <Button
                      icon={<DeleteOutlined />}
                      danger
                    >
                      Delete
                    </Button>
                  </Popconfirm>,
                  ]}
                  >
                    <List.Item.Meta
                      avatar={
                        <img
                          src={product.image_url}
                          alt={product.name}
                          style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 4 }}
                        />
                      }
                      title={<strong>{product.name}</strong>}
                      description={`Price: S$${product.current_price} | Store: ${product.store_name}`}
                    />
                  </List.Item>
                )}
              />
              <Pagination
                style={{ marginTop: '1rem', textAlign: 'center' }}
                current={wishlistPage}
                pageSize={pageSize}
                total={wishlist.length}
                onChange={(page) => setWishlistPage(page)}
              />
            </>
          ) : (
            <p>No items in your wishlist.</p>
          )}
        </Card>
      </div>
    </div>
    
  );
}

export default Dashboard;