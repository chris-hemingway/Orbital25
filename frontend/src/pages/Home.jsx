import { useNavigate } from 'react-router-dom';
import { Button, Card } from 'antd';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-fade';

import '../globals.css';

function Home() {
  const navigate = useNavigate();

  const slides = [
    {
      image: '/assets/image1.jpg',
      title: 'Shop With Us',
      subtitle: 'Discover unbeatable deals on your favorite products.',
    },
    {
      image: '/assets/image2.png',
      title: 'Compare and Save',
      subtitle: 'Your one-stop platform for price comparison.',
    },
    {
      image: '/assets/image3.png',
      title: 'Smart Shopping Starts Here',
      subtitle: 'Join us and make every purchase count.',
    },
  ];

  return (
    <div>
      {/* SLIDER SECTION */}
      <Swiper
        modules={[Autoplay, EffectFade]}
        effect="fade"
        autoplay={{ delay: 4000, disableOnInteraction: false }}
        loop
        className="home-swiper"
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={index}>
            <div
              className="home-slide"
              style={{ backgroundImage: `url(${slide.image})` }}
            >
              <div className="overlay">
                <h1>{slide.title}</h1>
                <p>{slide.subtitle}</p>
                <Button
                  type="primary"
                  size="large"
                  style={{
                    backgroundColor: 'transparent',
                    color: '#fff',
                    border: '2px solid #fff',
                    fontWeight: 800,
                    borderRadius: '0px',
                    padding: '12px 24px',
                    fontSize: '16px',
                  }}
                  onClick={() => navigate('/search')}
                >
                  Get Started
                </Button>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* WHAT WE OFFER SECTION */}
      <div className="offer-section">
        <h2>What We Offer!</h2>
      <div className="card-container">
        <Card
          hoverable
          style={{ width: 300, border: 'none' }}
          cover={
            <img
              alt="Best Price Comparison"
              src="/assets/sign1.jpg"
              style={{ borderRadius: '12px' }}
            />
          }
        />
        <Card
          hoverable
          style={{ width: 300, border: 'none' }}
          cover={
            <img
              alt="Top Store Integration"
              src="/assets/sign2.jpg"
              style={{ borderRadius: '12px' }}
            />
          }
        />
        <Card
          hoverable
          style={{ width: 300, border: 'none' }}
          cover={
            <img
              alt="24/7 Support"
              src="/assets/sign3.jpg"
              style={{ borderRadius: '12px' }}
            />
          }
        />
      </div>
    </div>
    </div>
  );
}

export default Home;
