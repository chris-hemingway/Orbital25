function Footer() {
    return (
      <footer
        style={{
          padding: '16px',
          background: '#E7E4F8',
          textAlign: 'center',
          marginTop: 'auto',
        }}
      >
        © {new Date().getFullYear()} CW Deals. All rights reserved.
      </footer>
    );
  }
  
  export default Footer;