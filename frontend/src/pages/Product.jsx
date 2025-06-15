{/* List of products */}
/*
      {isSubmitted && (
        <div style={{ padding: '2rem' }}>
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
                <img
                  src={item.image_url}
                  alt={item.name}
                  style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                />
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
            <p>No matching products found.</p>
          )}
        </div>
      )}
    </>
  );