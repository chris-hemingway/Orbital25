import { Form, Input, Button, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';

const { Title, Text, Link } = Typography;

function Login({ onFinish, loading }) {
  const navigate = useNavigate();

  return (
    <Form
      layout="vertical"
      onFinish={onFinish}
      autoComplete="off"
      style={{
        width: 400,
        margin: "0 auto",
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        padding: "24px",
        background: "#fff",
        borderRadius: "8px",
        boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)"
      }}
    >
      <div style={{ textAlign: "center", marginBottom: 10 }}>
        <Title level={2} style={{ marginBottom: 0 }}>Login</Title>
        <Text type="secondary">Please login using account details below</Text>
      </div>

      <Form.Item name="email" rules={[
        { required: true, message: "Please enter your username or email" }
      ]}>
        <Input placeholder="Username or Email" />
      </Form.Item>

      <Form.Item name="password" 
      rules={[
        { required: true, message: "Please enter your password" }]}>
        <Input.Password placeholder="Password" />
      </Form.Item>

      <div style={{ textAlign: "left", marginBottom: 16 }}>
        <Link onClick={() => { /* navigate to forgot password */ }}>
          Forgot your password?
        </Link>
      </div>

      <Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          loading={loading}
          block
          style={{ background: "#ff2d87", borderColor: "#ff2d87" }}
        >
          Sign In
        </Button>
      </Form.Item>

      

      <div style={{ textAlign: "center", marginTop: 16 }}>
        <Text type="secondary">Don’t have an Account? </Text>
        <Link onClick={() => navigate('/register')}>Create account</Link>
        <br />
        <Link onClick={() => navigate('/')}>Continue as Guest</Link>
      </div>
    </Form>
  );
}

export default Login;