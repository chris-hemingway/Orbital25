import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Button, Input, Form, Typography, message } from 'antd';

const { Title } = Typography;

function Login() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    try {
      setLoading(true);
      const res = await axios.post('http://localhost:5001/api/login', values);
      message.success("Login successful!");
      localStorage.setItem("token", res.data.token);
      // Navigate to dashboard or home
      navigate("/dashboard"); // change this if needed
    } catch (err) {
      message.error("Login failed. Invalid credentials.");
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
      <Title level={3}>Login</Title>

      <Form.Item label="Email" name="email" rules={[{ required: true, type: "email" }]}>
        <Input placeholder="Enter your email" />
      </Form.Item>

      <Form.Item label="Password" name="password" rules={[{ required: true }]}>
        <Input.Password placeholder="Enter your password" />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" loading={loading} block>
          Login
        </Button>
      </Form.Item>

      <Form.Item>
        <Button type="link" onClick={() => navigate('/register')} block>
          New user? Register
        </Button>
      </Form.Item>

      <Form.Item>
        <Button type="default" onClick={() => { /* do nothing for now */ }} block>
          Continue as Guest
        </Button>
      </Form.Item>
    </Form>
  );
}

export default Login;