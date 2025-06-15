import { useState } from 'react'
import productData from '../../../../Dataset/Data/Products.json';
import headphone from '../../assets/headphone.png';
import chair from '../../assets/chair.png';
import './search.css'
import { Select } from 'antd';

function Search() {
  const [searchTerm, setSearchTerm] = useState('');
  const [submittedTerm, setSubmittedTerm] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [selectedStores, setSelectedStores] = useState([]);

  //search and filter logic
  const keywords = submittedTerm.toLowerCase().split(/\s+/).filter(Boolean);
  const filteredProducts = keywords.length === 0
    ? []
    : productData
        .filter(product => {
          const nameMatch = keywords.every(k => product.name.toLowerCase().includes(k));
          const storeMatch = selectedStores.length === 0 || selectedStores.includes(product.store_name.toLowerCase());
          return nameMatch && storeMatch;
        })
        .sort((a, b) => a.current_price - b.current_price);

  //search only if 'Enter' or click Search Now
  const handleSearch = () => {
    setSubmittedTerm(searchTerm);
    setIsSubmitted(true);
  };
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      setSubmittedTerm(searchTerm);
      setIsSubmitted(true);
    }
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
                  <span>Websites from the drop down menu!</span>
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
                  <button type="button" className="search-button button" onClick={handleSearch}>
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
