import { Menu, Button, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useAuth } from "./AuthContext";
const { Title } = Typography;

function Header() {
    const { username, logout } = useAuth();
    const navigate = useNavigate();
    const items = [
      {
        label: 'Menu',       // menu label
        key: 'menu',
        children: [          // dropdown
          {
            label: 'Search',
            key: 'search',
          },
          {
            label: 'Dashboard',
            key: 'dashboard',
          },
        ...(username ? [{
            label: 'Logout',
            key: 'logout',
          }] : [])
        ],
      },
    ];
    const onClick = (e) => {
        if (e.key === 'logout') {
          logout();
        } else {
          navigate(`/${e.key}`);
        }
      };

  return (
    <header
      style={{
        position: 'fixed',     
        top: 0,           
        left: 0,
        right: 0,
        zIndex: 1000,
        height: '48px',
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
        style={{background: 'transparent'}}
        defaultSelectedKeys={['home']}
        mode="horizontal"
        items={items}
      />
      </div>

     {/* show login button or username base on token validity */}
      {username ? (
        <div style={{ marginRight: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <strong>{username}</strong>
        </div>

      ) : (
        <Button
          type="primary"
          style={{ backgroundColor: '#ff2d87', borderColor: '#ff2d87' }}
          onClick={() => navigate('/login')}
        >
          Login
        </Button>
      )}

    </header>
    
  );
}


export default Header;