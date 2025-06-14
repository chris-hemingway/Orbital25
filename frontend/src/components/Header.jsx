import { Menu, Button, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useAuth } from "./AuthContext";
const { Title } = Typography;
import '../globals.css'

function Header() {
    const { username, token, isGuest, logout } = useAuth();
    const navigate = useNavigate();
    const items = [
      {
        label: 'Menu',
        key: 'menu',
        children: [
          {
            label: 'Search',
            key: 'search',
          },
          {
            label: 'Dashboard',
            key: 'dashboard',
          },
          // add Wishlist only when logged in
          ...(token && !isGuest ? [{
            label: 'Wishlist',
            key: 'wishlist',
          }] : []),
          // add Logout only when logged in
          ...(token && !isGuest ? [{
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
      {token && !isGuest ? (
        <div style={{ marginRight: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <strong className="profile-username">{username}</strong>
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