import { useState } from 'react'
import reactLogo from '../assets/react.svg'
import productData from '../../../Dataset/Data/Products.json';

function Search() {
  const [searchTerm, setSearchTerm] = useState('');

{/* Search logic*/}
    const keywords = searchTerm.toLowerCase().split(/\s+/).filter(Boolean);
    const filteredProducts = keywords.length === 0
      ? []
      : productData
          .filter(product => {
            const name = product.name.toLowerCase();
            return keywords.every(keyword => name.includes(keyword));
          })
          .sort((a, b) => a.current_price - b.current_price);

    return (
      <div style={{ padding: '2rem', fontFamily: 'Arial' }}>
        <h1>CW DEALS</h1>
        <input
          type="text"
          placeholder="Search for a product..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          style={{ padding: '0.5rem', width: '300px', marginBottom: '1.5rem' }}
        />

        {filteredProducts.length > 0 ? (
          filteredProducts.map((item, index) => (
            <div key={index} style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              marginBottom: '1.5rem',
              paddingBottom: '1rem',
              borderBottom: '1px solid #ccc'
            }}>
              <img src={item.image_url} alt={item.name} style={{ width: '100px', height: '100px', objectFit: 'cover' }} />
              <div>
                <h2>
                  <a href={item.link} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: '#007BFF' }}>
                    {item.name}
                  </a>
                </h2>
                <p>Price: ${item.current_price}</p>
                <p>Site: {item.store_name}</p>
              </div>
            </div>
          ))
        ) : (
          keywords.length > 0 && <p>No matching products found.</p>
        )}
      </div>
    );
  }

  export default Search;