import { Button, Input, Form, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useState } from 'react';

const { Title } = Typography;

function Register() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    try {
      setLoading(true);
      await axios.post('http://localhost:5001/api/register', values);
      alert("Registered successfully!");
      navigate('/login');
    } catch (err) {
      alert("Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form
      layout="vertical"
      onFinish={onFinish}
      style={{
        width: 400,
        margin: "0 auto",
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        padding: "24px",
        border: "1px solid #eee",
        borderRadius: "8px",
        boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
        background: "#fff"
      }}
    >
      <Title level={3}>Register</Title>

      <Form.Item label="Email" name="email" rules={[{ required: true, type: "email" }]}>
        <Input placeholder="Enter your email" />
      </Form.Item>

      <Form.Item label="Password" name="password" rules={[{ required: true }]}>
        <Input.Password placeholder="Enter your password" />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" loading={loading} block>
          Register
        </Button>
      </Form.Item>

      <Form.Item>
        <Button type="link" onClick={() => navigate('/login')} block>
          Already have an account? Login
        </Button>
      </Form.Item>
    </Form>
  );
}

export default Register;