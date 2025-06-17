import { Button, notification, Space } from 'antd';
import { useNavigate } from 'react-router-dom';

function Temp() {
  const navigate = useNavigate();
  const [api, contextHolder] = notification.useNotification();

  const mockProduct = {
    name: "2024 New Air Force One Men's Casual Sports Shoes Fashion All-Match Trendy Men's Shoes Student White Shoes Board Shoes 012",
    current_price: 13.13,
    rating: 5.0,
    num_reviews: 1023,
    product_link: "https://www.lazada.sg//www.lazada.sg/products/pdp-i3132008125.html",
    image_url: "https://img.lazcdn.com/g/p/489232331d3fd931e2c6123c7abca434.jpg_webp_200x200q80.avif",
    store_name: "Lazada"
  };

  const openNotification = () => {
    console.log("notification triggered");
    api.open({
        message: "Notification Title",
        description:
            "Test",
        duration: 3,
    });
  };

  return (
    <div style={{ textAlign: 'center', paddingTop: '3rem' }}>
      <h2>🔍 Simulated Search Result</h2>

      <Space direction="vertical">
        <Button
          type="primary"
          style={{ backgroundColor: '#ff2d87', borderColor: '#ff2d87' }}
          onClick={() => navigate('/product-details', { state: { product: mockProduct } })}
        >
          View Product Details
        </Button>

        {contextHolder}
        <Button onClick={openNotification}>
            Trigger Wishlist Notification
        </Button>
      </Space>
    </div>
  );
}

export default Temp;