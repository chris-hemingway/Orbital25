import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
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
  const [productData, setProductData] = useState([]);
  const API_URL = import.meta.env.VITE_API_URL;
  const [sortOption, setSortOption] = useState('priceLowToHigh'); // default
  const [ratingSort, setRatingSort] = useState(false);
  const [salesSort, setSalesSort] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/products`);
        setProductData(res.data);
      } catch (err) {
        console.error('Error fetching products', err);
      }
    };
    fetchProducts();
    console.log(productData);
  }, []);


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
            const nameMatch = keywords.every((k) =>
              product.name.toLowerCase().includes(k)
            );
            const storeMatch =
              activeSelectedStores.length === 0 ||
              activeSelectedStores.includes(product.store_name.toLowerCase());
            return nameMatch && storeMatch;
          })
          .sort((a, b) => {
            switch (sortOption) {
              case 'priceHighToLow':
                return (b.current_price ?? 0) - (a.current_price ?? 0);
              case 'priceLowToHigh':
                return (a.current_price ?? 0) - (b.current_price ?? 0);
              case 'rating':
                return (b.rating ?? 0) - (a.rating ?? 0);
              case 'sales':
                return (b.num_reviews ?? 0) - (a.num_reviews ?? 0);
              default:
                return 0;
            }
          });

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

  const toggleRatingSort = () => {
    setRatingSort(!ratingSort);
    if (!ratingSort) setSalesSort(false);
    setSortOption('rating');
  };

  const toggleSalesSort = () => {
    setSalesSort(!salesSort);
    if (!salesSort) setRatingSort(false);
    setSortOption('sales');
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
      {/* Search bar section */}
      <div className="search-controls">
        <Input
          className="search-input"
          placeholder="Search for a product..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onPressEnter={handleSearch}
        />
        <Button className="pink-search-btn" onClick={handleSearch}>
          Search
        </Button>
      </div>

      {/* Sort and filter row */}
      <div className="sort-filter-bar">
        <span style={{ fontWeight: 500 }}>Sort by</span>

        <Button
          className={`pink-toggle-btn ${ratingSort ? 'active' : ''}`}
          onClick={toggleRatingSort}
        >
          Top Ratings
        </Button>

        <Button
          className={`pink-toggle-btn ${salesSort ? 'active' : ''}`}
          onClick={toggleSalesSort}
        >
          Top Sales
        </Button>

        <Select
          placeholder="Price: Low to High"
          onChange={(value) => {
            setSortOption(value);
            setSalesSort(false);
            setRatingSort(false);
          }}
          className="pink-bordered-select select-sort"
          options={[
            { value: 'priceLowToHigh', label: 'Price: Low to High' },
            { value: 'priceHighToLow', label: 'Price: High to Low' },
          ]}
        />

        <Select
          mode="multiple"
          allowClear
          placeholder="Select stores"
          value={selectedStores}
          onChange={(value) => setSelectedStores(value)}
          className="pink-bordered-select select-store"
          options={[
            { value: 'amazon', label: 'Amazon' },
            { value: 'lazada', label: 'Lazada' },
            { value: 'shopee', label: 'Shopee' },
          ]}
        />
      </div>

     <div style={{ marginTop: '3rem' }}>
      {paginatedProducts.length > 0 ? (
        <>
          <Row gutter={[16, 16]} justify="center">
            {paginatedProducts.map((item, index) => (
              <Col key={index} xs={24}>
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
                    {/* Product image */}
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
                    {}
                    <a
                      onClick={() => navigate('/product-details', { state: { product: item }})}
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

                    {/* Wishlist heart removed for now
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
                    /> */}
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
            align='center'
            showSizeChanger = {false}
            onChange={(page) => setCurrentPage(page)}
          />
        </>
        ) : (
        <p style={{ textAlign: 'center' }}>No matching products found.</p>
      )}
     </div>
    </div>
  );
}

export default Product;
