import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import productData from '../../../Dataset/Data/Products.json';
import { Card, Pagination, Row, Col, Input, Select, Button } from 'antd';
import './Search/search.css';
import { HeartOutlined } from '@ant-design/icons';

const { Search } = Input;

function Product() {
  const { state } = useLocation();
  const navigate = useNavigate();

  // Get searchTerm and selectedStores from route state (if any)
  const { searchTerm: initialTerm = '', selectedStores: initialStores = [] } = state || {};
  const [searchTerm, setSearchTerm] = useState(initialTerm);
  const [selectedStores, setSelectedStores] = useState(initialStores);
  const [activeSearchTerm, setActiveSearchTerm] = useState(initialTerm);
  const [activeSelectedStores, setActiveSelectedStores] = useState(initialStores);

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  useEffect(() => {
    setActiveSearchTerm(initialTerm);
    setActiveSelectedStores(initialStores);
    setSearchTerm(initialTerm);
    setSelectedStores(initialStores);
  }, [initialTerm, initialStores]);

  // Filtering and search logic
  const keywords = activeSearchTerm.toLowerCase().split(/\s+/).filter(Boolean);
  const filteredProducts =
    keywords.length === 0
      ? []
      : productData
          .filter((product) => {
            const nameMatch = keywords.every((k) => product.name.toLowerCase().includes(k));
            const storeMatch =
              activeSelectedStores.length === 0 ||
              activeSelectedStores.includes(product.store_name.toLowerCase());
            return nameMatch && storeMatch;
          })
          .sort((a, b) => a.current_price - b.current_price);

  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // Triggered only when Enter or clicking Search button
  const handleSearch = () => {
    navigate('/products', {
      state: {
        searchTerm,
        selectedStores,
      },
    });
  };

  return (
    <div
      style={{
        padding: '2rem',
        backgroundColor: 'white',
        minHeight: '100vh',
        marginTop: '2.5rem',
      }}
    >
      {/* Search Bar */}
      <div
        style={{
          marginBottom: '2rem',
          display: 'flex',
          gap: '1rem',
          flexWrap: 'wrap',
          justifyContent: 'center',
        }}
      >
        <Input
          placeholder="Search for a product..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onPressEnter={handleSearch}
          style={{ width: '300px' }}
        />
        <Select
          mode="multiple"
          allowClear
          placeholder="Select stores"
          value={selectedStores}
          onChange={(value) => setSelectedStores(value)}
          style={{ minWidth: '200px' }}
          options={[
            { value: 'amazon', label: 'Amazon' },
            { value: 'lazada', label: 'Lazada' },
            { value: 'shopee', label: 'Shopee' },
          ]}
        />
        <Button type="primary" onClick={handleSearch}>
          Search
        </Button>
      </div>

      {/* Product Grid */}
      {paginatedProducts.length > 0 ? (
        <>
          <Row gutter={[16, 16]} justify="center">
            {paginatedProducts.map((item, index) => (
              <Col key={index} xs={24}>
                {/* Center the card */}
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '16px',
                      border: '1px solid #f0f0f0',
                      borderRadius: '8px',
                      transition: 'box-shadow 0.3s ease',
                      backgroundColor: '#fff',
                      cursor: 'pointer',
                      maxWidth: '900px',
                      width: '100%',
                      boxSizing: 'border-box',
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)')
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.boxShadow = 'none')
                    }
                  >
                    {/* Left: Product image */}
                    <img
                      alt={item.name}
                      src={item.image_url}
                      style={{
                        width: 120,
                        height: 120,
                        objectFit: 'cover',
                        borderRadius: 8,
                        marginRight: 16,
                        flexShrink: 0,
                      }}
                    />
                    {/* Change link to Product detail */}
                    <a
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        flex: 1,
                        textDecoration: 'none',
                        color: 'inherit',
                        overflow: 'hidden',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                      }}
                    >
                      <h3
                        style={{
                          margin: 0,
                          marginBottom: 8,
                          fontSize: '16px',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                        title={item.name}
                      >
                        {item.name}
                      </h3>
                      <p style={{ margin: 0, fontSize: 16, fontWeight: 'bold' }}>
                        ${item.current_price}
                      </p>
                      <p style={{ margin: 0, color: '#888' }}>{item.store_name}</p>
                    </a>

                    {/* Wishlist */}
                    <HeartOutlined
                      style={{
                        marginLeft: 16,
                        color: '#f5222d',
                        fontSize: 20,
                        cursor: 'pointer',
                        flexShrink: 0,
                      }}
                      title="Add to wishlist"
                      onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        console.log(`Wishlisted: ${item.name}`);
                        // TODO: Add actual wishlist logic
                      }}
                    />
                  </div>
                </div>
              </Col>
            ))}
          </Row>

          <Pagination
            style={{ marginTop: '2rem', textAlign: 'center' }}
            current={currentPage}
            pageSize={pageSize}
            total={filteredProducts.length}
            onChange={(page) => setCurrentPage(page)}
          />
        </>
      ) : (
        <p style={{ textAlign: 'center' }}>No matching products found.</p>
      )}
    </div>
  );
}

export default Product;
