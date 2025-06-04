import { Button } from 'antd';
import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        height: '100vh',
        paddingTop: '80px', 
        boxSizing: 'border-box',
      }}
    >
      <h1 style={{ fontSize: '3rem', fontWeight: '600', marginBottom: '0.5rem' }}>
        Welcome to CW Deals
      </h1>
      <p style={{ fontSize: '1.1rem', maxWidth: '600px', marginBottom: '1.5rem' }}>
        Find the best deals across all platforms effortlessly.
      </p>
      <Button
        type="primary"
        style={{
          backgroundColor: '#ff2d87',
          borderColor: '#ff2d87',
        }}
        onClick={() => navigate('/login')}
      >
        Login
      </Button>
    </div>
  );
}

export default Home;