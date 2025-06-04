import { Button, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';
const { Title } = Typography;

function Header() {
    const navigate = useNavigate();
  return (
    <header
      style={{
        position: 'fixed',     
        top: 0,           
        left: 0,
        right: 0,
        zIndex: 1000,          
        padding: '16px',
        background: '#f5f5f5',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}
    >
      <Title 
      level={3} 
      style={{ 
        margin: 0,
        cursor: 'pointer',
         }}
         onClick={() => navigate('/')}
         >
            CW Deals
        </Title>

      <Button
        type="primary"
        style={{ backgroundColor: '#ff2d87', borderColor: '#ff2d87' }}
        onClick={() => navigate('/login')}
      >
        Login
      </Button>
    </header>
    
  );
}

export default Header;