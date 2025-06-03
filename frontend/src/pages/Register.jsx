import { Button, Input, Form, Typography } from 'antd';

const { Title, Text, Link } = Typography;

function Register({ onFinish, loading, onNavigateToLogin }) {
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
      <div style={{ textAlign: "center", marginBottom: 8 }}>
        <Title level={2} style={{ marginBottom: 0 }}>Register</Title>
        <Text type="secondary">Create your account to get started</Text>
      </div>

      <Form.Item name="email" rules={[
        { required: true, message: "Please enter your email" },
        { type:"email", message: "Please enter a valid email address"}
        ]}>
        <Input placeholder="Email Address" />
      </Form.Item>

      <Form.Item name="password" 
      rules={[
        { required: true, message: "Please enter your password" }]}>
        <Input.Password placeholder="Password" />
      </Form.Item>

      <Form.Item
        name="confirmPassword"
        dependencies={['password']}
        rules={[
          {
            required: true,
            message: 'Please confirm your password!',
          },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue('password') === value) {
                return Promise.resolve();
              }
              return Promise.reject(new Error('Passwords do not match!'));
            },
          }),
        ]}
      >
        <Input.Password placeholder="Confirm Password" />
      </Form.Item>

      <Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          loading={loading}
          block
          style={{ background: "#ff2d87", borderColor: "#ff2d87" }}
        >
          Register
        </Button>
      </Form.Item>

      <div style={{ textAlign: "center", marginTop: 16 }}>
        <Text type="secondary">Already have an account? </Text>
        <Link onClick={onNavigateToLogin}>Login</Link>
      </div>
    </Form>
  );
}

export default Register;