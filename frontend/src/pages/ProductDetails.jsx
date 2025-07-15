import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card, Rate, Button, Space, notification, Collapse, Badge, Typography, Tag, message, Modal, Input } from 'antd';
import { HeartOutlined, HeartFilled, ArrowLeftOutlined, DollarCircleOutlined, LineChartOutlined, UserOutlined } from '@ant-design/icons';
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

const { Panel } = Collapse;

function getRecentAverageByDays(data, days) {
  if (!data || data.length === 0) return null;

  const now = new Date();
  const cutoff =
    days === 'all' ? new Date(0) : new Date(now.getTime() - days * 24 * 60 * 60 * 1000);

  let weightedSum = 0;
  let totalDuration = 0;

  for (let i = 0; i < data.length - 1; i++) {
    const start = new Date(data[i].date);
    const end = new Date(data[i + 1].date);

    // Skip if the period ends before the cutoff
    if (end <= cutoff) continue;

    // Clamp start to cutoff if needed
    const effectiveStart = start < cutoff ? cutoff : start;
    const durationMs = end - effectiveStart;
    const durationDays = durationMs / (1000 * 60 * 60 * 24);

    if (durationDays > 0) {
      weightedSum += data[i].price * durationDays;
      totalDuration += durationDays;
    }
  }

  // Add final period from last price change to now
  const last = data[data.length - 1];
  const lastStart = new Date(last.date);
  const effectiveLastStart = lastStart < cutoff ? cutoff : lastStart;
  const durationMs = now - effectiveLastStart;
  const durationDays = durationMs / (1000 * 60 * 60 * 24);

  if (durationDays > 0) {
    weightedSum += last.price * durationDays;
    totalDuration += durationDays;
  }

  if (totalDuration === 0) return null;

  return weightedSum / totalDuration;
}

//helper function
function getTimeSince(date) {
  const now = new Date();
  const diffTime = now - date;
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  const diffMonths = Math.floor(diffDays / 30);

  if (diffMonths >= 1) {
    return `${diffMonths} month${diffMonths > 1 ? 's' : ''} ago`;
  } else if (diffDays >= 1) {
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  } else {
    return 'Today';
  }
}

function linearRegression(priceHistory, predictionHorizon) {
  if (!priceHistory || priceHistory.length < 2) return { points: [] };

  // Prepare x (timestamps) and y (prices)
  const x = priceHistory.map(entry => new Date(entry.date).getTime());
  const y = priceHistory.map(entry => entry.price);

  const n = x.length;
  const meanX = x.reduce((a, b) => a + b, 0) / n;
  const meanY = y.reduce((a, b) => a + b, 0) / n;

  const numerator = x.reduce((sum, xi, i) => sum + (xi - meanX) * (y[i] - meanY), 0);
  const denominator = x.reduce((sum, xi) => sum + (xi - meanX) ** 2, 0);

  const slope = numerator / denominator;
  const intercept = meanY - slope * meanX;

  // Predict future prices starting from today
  const now = new Date().getTime();
  const points = [];

  for (let i = 0; i <= predictionHorizon; i++) {
    const futureDate = now + i * 24 * 60 * 60 * 1000;
    const predicted = slope * futureDate + intercept;

    // if prediction falls below 30% of current price, abort
    if (predicted < 0.3 * priceHistory[priceHistory.length - 1].price) {
      return { points: null };
    }

    points.push({
      date: futureDate,
      predicted: parseFloat(predicted.toFixed(2)),
    });
  }

  return { points };
}

function ProductDetails() {
  const { state } = useLocation();
  const product = state?.product;
  const { token } = useAuth();
  const [wishlisted, setWishlisted] = useState(false);
  const [api, contextHolder] = notification.useNotification();
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;
  const [priceHistory, setPriceHistory] = useState([]);
  const [expandHistory, setExpandHistory] = useState(false); // toggle for collapse
  const [avgWindow, setAvgWindow] = useState(30); // default: 30 days
  const [reviews, setReviews] = useState([]);
  const [newRating, setNewRating] = useState(0);
  const [newComment, setNewComment] = useState('');
  const [showPrediction, setShowPrediction] = useState(false);
  const [predictionHorizon, setPredictionHorizon] = useState(30);
  const [predictedData, setPredictedData] = useState([]);
  const regressionResult = linearRegression(priceHistory, predictionHorizon);
  const predictionPoints = regressionResult.points;
  const [alertModalVisible, setAlertModalVisible] = useState(false);
  const [alertPrice, setAlertPrice] = useState('');

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
    if (product?.price_history && product.price_history.length > 0) {
      const rawHistory = [...product.price_history].sort(
        (a, b) => new Date(a.date) - new Date(b.date)
      );

      const today = new Date();
      const steppedData = [];

      for (let i = 0; i < rawHistory.length - 1; i++) {
        const date = new Date(rawHistory[i].date);
        const price = rawHistory[i + 1].price;
        steppedData.push({ price, date });
      }

      const lastHistoryDate = new Date(rawHistory[rawHistory.length - 1].date);
      steppedData.push({ price: product.current_price, date: lastHistoryDate });

      if (lastHistoryDate.toDateString() !== today.toDateString()) {
        steppedData.push({ price: product.current_price, date: today });
      }

      setPriceHistory(steppedData);
    }
  }, [product]);

  useEffect(() => {
    const fetchReviews = async () => {
      if (!product?.product_id) return;

      try {
        const res = await axios.get(`${API_URL}/api/reviews/${product.product_id}`);
        setReviews(res.data);
      } catch (err) {
        console.error("Failed to fetch reviews", err);
      }
    };

    fetchReviews();
  }, [product]);

  const getLowestPriceInfo = () => {
    if (priceHistory.length === 0) return null;

    let minEntry = priceHistory[0];
    for (const entry of priceHistory) {
      if (entry.price < minEntry.price) {
        minEntry = entry;
      }
    }

    const isNow =
      parseFloat(minEntry.price.toFixed(2)) ===
      parseFloat(product.current_price.toFixed(2));

    return {
      price: minEntry.price.toFixed(2),
      dateStr: isNow ? 'Now' : minEntry.date.toLocaleDateString('en-CA'),
      since: isNow ? 'Current Price' : getTimeSince(minEntry.date),
      isNow,
    };
  };

  const getPriceDropInfo = () => {
    if (priceHistory.length === 0) return null;

    const prices = priceHistory.map((entry) => entry.price);
    const avgPrice = prices.reduce((a, b) => a + b, 0) / prices.length;
    const discountPercent = ((avgPrice - product.current_price) / avgPrice) * 100;

    return {
      average: avgPrice.toFixed(2),
      drop: discountPercent > 0 ? discountPercent.toFixed(1) : null,
      isPromo: discountPercent >= 10 // You can change the threshold
    };
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

  const submitReview = async () => {
    if (!token) {
      api.info({
        message: 'Login Required',
        description: 'Please log in to post a review.',
        placement: 'topRight',
      });
      return;
    }

    if (!newRating || !newComment.trim()) {
      api.warning({
        message: 'Incomplete Review',
        description: 'Please give a rating and write a comment.',
        placement: 'topRight',
      });
      return;
    }

    try {
      const res = await axios.post(
        `${API_URL}/api/reviews/${product.product_id}`,
        { rating: newRating, comment: newComment },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Clear form and refresh reviews
      setNewRating(0);
      setNewComment('');
      setReviews(prev => [res.data, ...prev]);

      api.success({
        message: 'Review Posted',
        description: 'Thank you for your feedback!',
        placement: 'topRight',
      });
    } catch (err) {
      console.error('Failed to post review', err);
      api.error({
        message: 'Error',
        description: 'Could not post review. You may have already posted one.',
        placement: 'topRight',
      });
    }
  };

  const handleSetAlert = () => {
    if (!token) {
      api.info({
        message: 'Login Required',
        description: 'Please log in to set a price alert.',
        placement: 'topRight',
      });
      return;
    }
  
    setAlertModalVisible(true);
  };
  
  const handleModalOk = async () => {
    if (!alertPrice || isNaN(alertPrice)) {
      message.error('Please enter a valid price.');
      return;
    }
  
    try {
        await axios.post(
          `${API_URL}/api/alerts`,
          {
            product: product._id,
            target_price: parseFloat(parseFloat(alertPrice).toFixed(2))
          },
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
    
        message.success(`Price alert set at S$${alertPrice}`);
        setAlertModalVisible(false);
        setAlertPrice('');
      } catch (err) {
        if (err.response?.status === 400 && err.response?.data?.error) {
          message.warning(err.response.data.error); // Duplicate alert message
        } else {
          console.error(err);
          message.error('Failed to set price alert');
        }
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

      {/* Price Drop Details Panel */}
      {priceHistory.length > 0 && (
        <div style={{ width: '100%', maxWidth: 800, marginTop: '2rem' }}>
          <Collapse
            bordered={false}
            defaultActiveKey={[]}
            expandIconPosition="end"
            style={{
              backgroundColor: '#fff',
              borderRadius: '8px',
              boxShadow: '0 1px 4px rgba(0,0,0,0.1)',
            }}
          >
            <Panel
              header={
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <DollarCircleOutlined />
                  <span style={{ fontWeight: 'bold' }}>Price Details</span>
                </div>
              }
              key="2"
              style={{ padding: '0 1rem' }}
            >
              {/* Toggle average time window */}
              <div style={{ marginBottom: '1rem' }}>
                <span style={{ marginRight: '0.5rem' }}>Average from last:</span>
                {[7, 30, 90, 'all'].map((days) => (
                  <Button
                    key={days}
                    size="small"
                    type={avgWindow === days ? 'primary' : 'default'}
                    onClick={() => setAvgWindow(days)}
                    style={{ marginRight: '0.5rem' }}
                  >
                    {days === 'all' ? 'All Time' : `${days}d`}
                  </Button>
                ))}
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
            <Button type="primary" onClick={handleSetAlert}>
                Set Price Alert
            </Button>
            </div>

            <Modal
                title="Set Price Alert"
                open={alertModalVisible}
                onOk={handleModalOk}
                onCancel={() => setAlertModalVisible(false)}
                okText="Set Alert"
            >
                <Input
                    prefix="S$"
                    placeholder="Enter target price"
                    value={alertPrice}
                    onChange={(e) => setAlertPrice(e.target.value)}
                />
            </Modal>

              {/* Price drop from selected average */}
              {(() => {
                const now = new Date();
                const cutoff =
                  avgWindow === 'all' ? new Date(0) : new Date(now.getTime() - avgWindow * 24 * 60 * 60 * 1000);
                if (
                  (avgWindow === 'all' && priceHistory.length === 0) ||
                  (avgWindow !== 'all' && new Date(priceHistory[0].date) > cutoff)
                ) {
                  return <Tag color="default">No data available for selected period</Tag>;
                }

                const avg = getRecentAverageByDays(priceHistory, avgWindow);
                const diff = product.current_price - avg;
                const diffPercent = ((Math.abs(diff) / avg) * 100).toFixed(1);

                return (
                  <div>
                    <p>
                      <strong>Average Price ({avgWindow === 'all' ? 'All Time' : `${avgWindow}d`}):</strong>{' '}
                      S${avg.toFixed(2)}
                    </p>
                    <p><strong>Current Price:</strong> S${product.current_price.toFixed(2)}</p>

                    {diff < -0.05 * avg ? (
                      <Tag
                        color="green"
                        style={{ fontSize: '16px', padding: '6px 12px', fontWeight: 'bold' }}
                      >
                        ↓ {diffPercent}% below {avgWindow === 'all' ? 'All Time' : `${avgWindow}-day`} average
                      </Tag>
                    ) : diff > 0.05 * avg ? (
                      <Tag
                        color="red"
                        style={{ fontSize: '16px', padding: '6px 12px', fontWeight: 'bold' }}
                      >
                        ↑ {diffPercent}% above {avgWindow === 'all' ? 'All Time' : `${avgWindow}-day`} average
                      </Tag>
                    ) : (
                      <Tag color="yellow">Normal price</Tag>
                    )}
                  </div>
                );
              })()}
            </Panel>
          </Collapse>
        </div>
      )}

      {/* Price History Collapse Panel */}
      {priceHistory.length > 0 && (
        <div style={{ width: '100%', maxWidth: 800, marginTop: '2rem' }}>
          <Collapse
            bordered={false}
            defaultActiveKey={[]}
            expandIconPosition="end"
            style={{ backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 1px 4px rgba(0,0,0,0.1)' }}
          >
            <Panel
              header={
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <LineChartOutlined />
                  <span style={{ fontWeight: 'bold' }}>Price History</span>
                </div>
              }
              key="1"
              style={{ padding: '0 1rem' }}
            >
              <ResponsiveContainer width="100%" height={300}>
                <LineChart
                  data={
                    showPrediction && predictionPoints
                      ? predictionPoints
                      : priceHistory
                  }
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="date"
                    type="number"
                    scale="time"
                    domain={
                      showPrediction
                        ? [
                            new Date().getTime(),
                            new Date().getTime() + predictionHorizon * 24 * 60 * 60 * 1000
                          ]
                        : ['auto', 'auto']
                    }
                    tickFormatter={(date) =>
                      new Date(date).toLocaleDateString('en-CA')
                    }
                  />
                  <YAxis domain={['auto', 'auto']} />
                  <Tooltip
                    formatter={(value, name) => {
                      if (name === `Predicted Price (${predictionHorizon}d)`) {
                        return [`S$${value.toFixed(2)}`, `Predicted Price (${predictionHorizon}d)`];
                      } else {
                        return [`S$${value.toFixed(2)}`, 'Price'];
                      }
                    }}
                    labelFormatter={(value) => {
                      const date = new Date(value);
                      return date.toLocaleDateString('en-CA');
                    }}
                  />
                  {!showPrediction && (
                    <Line
                      type="stepAfter"
                      dataKey="price"
                      stroke="#8884d8"
                      strokeWidth={2}
                    />
                  )}

                  {showPrediction && (
                    <Line
                      type="monotone"
                      dataKey="predicted"
                      stroke="#888"
                      strokeDasharray="5 5"
                      dot={false}
                      isAnimationActive={false}
                      name={`Predicted Price (${predictionHorizon}d)`}
                    />
                  )}
                </LineChart>
              </ResponsiveContainer>

              {/* Lowest Historical Price */}
              {getLowestPriceInfo() && (
                <div style={{
                  marginTop: '1rem',
                  background: '#f9fafb',
                  padding: '1.2rem',
                  borderRadius: '8px',
                  border: '1px solid #eee'
                }}>
                  <div style={{ marginBottom: '0.75rem' }}>
                    <span style={{ fontWeight: 'bold', fontSize: '16px' }}>💰 Lowest Price:</span>{' '}
                    <span style={{ fontSize: '18px', fontWeight: '600' }}>
                      <Tag color="red" style={{ fontSize: '16px', padding: '4px 10px' }}>
                        S${getLowestPriceInfo().price}
                      </Tag>
                    </span>
                  </div>
                  <div>
                    <span style={{ fontWeight: 'bold', fontSize: '16px' }}>📅 Last Seen:</span>{' '}
                    {getLowestPriceInfo().isNow ? (
                      <Tag
                        color="green"
                        style={{ fontSize: '16px', padding: '4px 10px' }}
                      >
                        Now
                      </Tag>
                    ) : (
                      <>
                        <Tag style={{ fontSize: '16px', padding: '4px 10px' }}>
                          {getLowestPriceInfo().dateStr}
                        </Tag>
                        <Tag color="blue" style={{ fontSize: '16px', padding: '4px 10px' }}>
                          {getLowestPriceInfo().since}
                        </Tag>
                      </>
                    )}
                  </div>
                  <div style={{ marginTop: '1rem' }}>
                    <span style={{ fontWeight: 'bold' }}>Price Prediction:</span>{' '}
                    <Button
                      type={showPrediction ? "primary" : "default"}
                      onClick={() => setShowPrediction(prev => !prev)}
                      size="small"
                      style={{ marginRight: '0.5rem' }}
                      disabled={!predictionPoints} // disable when invalid
                    >
                      {showPrediction ? "Hide Prediction" : "Show Prediction"}
                    </Button>
                    {showPrediction && (
                      <>
                        <Button
                          size="small"
                          type={predictionHorizon === 30 ? "primary" : "default"}
                          onClick={() => setPredictionHorizon(30)}
                          style={{ marginRight: '0.5rem' }}
                        >
                          +30d
                        </Button>
                        <Button
                          size="small"
                          type={predictionHorizon === 90 ? "primary" : "default"}
                          onClick={() => setPredictionHorizon(90)}
                        >
                          +90d
                        </Button>
                      </>
                    )}
                  </div>

                </div>
              )}
            </Panel>
          </Collapse>
        </div>
      )}

    {/* Product Reviews Panel */}
    <div style={{ width: '100%', maxWidth: 800, marginTop: '2rem' }}>
      <Collapse
        bordered={false}
        defaultActiveKey={[]}
        expandIconPosition="end"
        style={{
          backgroundColor: '#fff',
          borderRadius: '8px',
          boxShadow: '0 1px 4px rgba(0,0,0,0.1)',
        }}
      >
        <Panel
          header={
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <UserOutlined />
              <span style={{ fontWeight: 'bold' }}>Product Reviews</span>
            </div>
          }
          key="3"
          style={{ padding: '0 1rem' }}
        >
          {token && (
            <div style={{ marginBottom: '1rem' }}>
              <p style={{ fontWeight: 'bold' }}>Leave a review:</p>
              <div style={{ marginBottom: '0.5rem' }}>
                <Rate value={newRating} onChange={setNewRating} />
              </div>
              <textarea
                rows={3}
                placeholder="Write your comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  borderRadius: '6px',
                  border: '1px solid #ddd'
                }}
              />
              <Button
                type="primary"
                onClick={submitReview}
                style={{ marginTop: '0.5rem', backgroundColor: '#1677ff' }}
              >
                Submit Review
              </Button>
            </div>
          )}

          {/* Show reviews */}
          {reviews.length === 0 ? (
            <p style={{ padding: '1rem', color: '#888' }}>No reviews available yet.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {reviews.map((rev, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    gap: '1rem',
                    alignItems: 'flex-start'
                  }}
                >
                  <div
                    style={{
                      backgroundColor: '#1890ff',
                      color: 'white',
                      borderRadius: '50%',
                      width: '36px',
                      height: '36px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 'bold',
                      fontSize: '16px'
                    }}
                  >
                    {rev.username[0].toUpperCase()}
                  </div>
                  <div>
                    <div style={{ fontWeight: 'bold' }}>{rev.username}</div>
                    <div style={{ fontSize: '12px', color: '#999' }}>
                      {getTimeSince(new Date(rev.createdAt))}
                    </div>
                    <Rate disabled value={rev.rating} style={{ fontSize: '14px' }} />
                    <div style={{ marginTop: '0.3rem' }}>{rev.comment}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Panel>
      </Collapse>
    </div>

    </div>
  );
}

export default ProductDetails;