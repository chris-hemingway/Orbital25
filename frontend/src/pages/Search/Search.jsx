import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './search.css';
import { Select } from 'antd';
import headphone from '/assets/headphone.png';
import chair from '/assets/chair.png';

function Search() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStores, setSelectedStores] = useState([]);
  const navigate = useNavigate();

  const handleSearch = () => {
    navigate('/products', {
      state: {
        searchTerm,
        selectedStores,
      },
    });
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSearch();
  };

  return (
    <>
      <div className="search-container11">
        <div className="search-container12">
                <div className="search-container13"></div>
                <img src={headphone} alt="image" className="search-image1" />
        </div>

              <div className="search-container14">
                <div className="search-container15"></div>
                <div className="search-container16">
                  <h1 className="search-text1">
                    <span className="search-text2">
                      Find The <span dangerouslySetInnerHTML={{ __html: ' ' }} />
                    </span>
                    <span className="search-text3">Best</span>
                    <span className="search-text4">
                      <span dangerouslySetInnerHTML={{ __html: ' ' }} />
                    </span>
                    <span className="search-text5">Deal Across</span>
                  </h1>
                  <h1 className="search-text6">Various Websites!</h1>
                  <span className="search-text7">
                    Search the item you wish to buy and select the e-commerce
                  </span>
                  <span>websites from the drop down menu!</span>
                  <div className="search-container17"></div>
                  <div className="search-container18">
                    <input
                      type="text"
                      placeholder="Search for a product..."
                      className="search-textinput input"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      onKeyDown={handleKeyDown}
                    />
                    <Select
                      mode="multiple"
                      allowClear
                      style={{ width: '100px', alignSelf: 'center' }}
                      placeholder="Stores"
                      onChange={(value) => setSelectedStores(value)}
                      options={[
                        { value: 'amazon', label: 'Amazon' },
                        { value: 'lazada', label: 'Lazada' },
                        { value: 'shopee', label: 'Shopee' },
                      ]}
                    />
                  </div>
                  <div className="search-container19"></div>
                  <button type="button" className="pink-search-btn2" onClick={handleSearch}>
                    Search Now
                  </button>
                </div>
              </div>

              <div className="search-container20"></div>
              <img src={chair} alt="image" className="search-image2" />
      </div>
      </>
      );
}


export default Search;
