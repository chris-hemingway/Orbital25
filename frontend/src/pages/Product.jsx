import { useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import productData from '../../../Dataset/Data/Products.json';
import { Card, Pagination, Row, Col } from 'antd';
import './Search/search.css';

function Product() {
  const { state } = useLocation();
  const { searchTerm = '', selectedStores = [] } = state || {};
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  const keywords = searchTerm.toLowerCase().split(/\s+/).filter(Boolean);

  const filteredProducts = keywords.length === 0
    ? []
    : productData
        .filter(product => {
          const nameMatch = keywords.every(k => product.name.toLowerCase().includes(k));
          const storeMatch = selectedStores.length === 0 || selectedStores.includes(product.store_name.toLowerCase());
          return nameMatch && storeMatch;
        })
        .sort((a, b) => a.current_price - b.current_price);

  const paginatedProducts = filteredProducts.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div style={{ padding: '2rem' }}>
      {paginatedProducts.length > 0 ? (
        <>
          <Row gutter={[16, 16]}>
            {paginatedProducts.map((item, index) => (
              <Col key={index} xs={24} sm={12} md={8} lg={6}>
                <Card
                  hoverable
                  cover={<img alt={item.name} src={item.image_url} style={{ height: 200, objectFit: 'cover' }} />}
                >
                  <Card.Meta
                    title={<a href={item.link} target="_blank" rel="noopener noreferrer">{item.name}</a>}
                    description={`$${item.current_price} • ${item.store_name}`}
                  />
                </Card>
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
        <p>No matching products found.</p>
      )}
    </div>
  );
}

export default Product;
