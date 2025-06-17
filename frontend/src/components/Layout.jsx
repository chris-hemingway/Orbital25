import Header from './Header';
import Footer from './Footer';

const Layout = ({ children, hideHeader = false, hideFooter = false }) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
      }}
    >
      {!hideHeader && <Header />}

      <main style={{ flexGrow: 1 }}>
        {children}
      </main>

      {!hideFooter && <Footer />}
    </div>
  );
};

export default Layout;