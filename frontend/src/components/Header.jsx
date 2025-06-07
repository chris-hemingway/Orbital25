import { Menu, Button, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';
const { Title } = Typography;

function Header() {
    const navigate = useNavigate();
    const items = [
      {
        label: 'Menu',       // menu label
        key: 'menu',
        children: [          // dropdown
          {
            label: 'Home',
            key: 'home',
          },
          {
            label: 'Search',
            key: 'search',
          },
          {
            label: 'Dashboard',
            key: 'dashboard',
          },
        ],
      },
    ];
    const onClick = (e) => {
      navigate(`/${e.key}`);
    };

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

      <div style={{ marginLeft: '900px' }}>
      <Menu
        onClick={onClick}
        style={{ width: 100 }}
        defaultSelectedKeys={['home']}
        mode="horizontal"
        items={items}
      />
      </div>

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