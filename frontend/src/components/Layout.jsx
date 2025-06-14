import Header from './Header';
import Footer from './Footer';

const Layout = ({ children, hideHeader = false, hideFooter = false }) => {
  return (
    <>
      {!hideHeader && <Header />}
      <main>{children}</main>
      {!hideFooter && <Footer />}
    </>
  );
};

export default Layout;