import api from '@cdleesang/tableorder-api-sdk';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import moment from 'moment';
import { useEffect, useRef, useState } from 'react';
import { DotLoader } from 'react-spinner-overlay';
import { EVENT_SLIDE_INTERVAL } from '../../common/constants/constant';
import { useActive } from '../../components/idle-timer/idle-timer-root';
import { toast } from '../../components/toast-container/utils/toast';
import { useConnection } from '../../hooks/use-connection';
import useSSE from '../../hooks/use-sse';
import useSwipe from '../../hooks/use-swipe';
import './index.scss';
import { ROUTES } from '../../route/routes';
import { useNavigate } from 'react-router-dom';

function EventSlide() {
  const [slideUrls, setSlideUrls] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const carouselRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const connection = useConnection();
  const autoSlideSetTimeoutId = useRef<NodeJS.Timeout | null>(null);
  const { onTouchStart, onTouchMove, onTouchEnd } = useSwipe();
  
  useSSE({
    type: 'SlideImageChanged',
    onMessage: (data) => {
      setSlideUrls(data);
    },
    onReconnect: () => {
      applySlideImages(false);
    },
  });

  function applySlideImages(errorToasting = true) {
    api.functional.store.slide_image.getAllSlideImages(connection)
      .then(({imageUrls}) => {
        setSlideUrls(imageUrls);
        
        setIsLoading(false);
      })
      .catch((err) => {
        localStorage.setItem('getAllSlideImage', moment().format('YYYY-MM-DD HH:mm:ss') + ' ' + JSON.stringify(err));
  
        setIsLoading(false);
  
        if(errorToasting) {
          toast('error', '슬라이드 이미지를 불러오는 중 오류가 발생했습니다');
        }
      });
  }

  useEffect(() => {
    applySlideImages();
  }, []);

  useEffect(() => {
    if(autoSlideSetTimeoutId.current) {
      clearTimeout(autoSlideSetTimeoutId.current);
    }

    autoSlideSetTimeoutId.current = setTimeout(() => {
      if(!slideUrls.length) return;
      setCurrentIndex(prev => (prev + 1) % slideUrls.length);
    }, EVENT_SLIDE_INTERVAL);
  }, [currentIndex, slideUrls]);

  return (
    <div
      className='event-slide'
      onClick={() => window.location.href = ROUTES.MAIN}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={() => onTouchEnd((isLeftSwipe) => {
        setCurrentIndex(prev => isLeftSwipe ? (prev + 1) % slideUrls.length : (prev - 1 + slideUrls.length) % slideUrls.length);
      }, 50)}
    >
      <div className="slide-container">
        <div className="carousel" ref={carouselRef}>
          {slideUrls.map((url, index) => (
            <div key={index} className={`slide ${index === currentIndex ? 'active' : ''}`}>
              <img src={url} alt="" />
            </div>
          ))}
        </div>
        <div
          className="controller"
          onClick={(event) => {
            event.stopPropagation();
          }}
        >
          <FontAwesomeIcon
            className="icon prev"
            icon={faChevronLeft}
            onClick={() => {
              setCurrentIndex(prev => (prev - 1 + slideUrls.length) % slideUrls.length);
            }}
          />
          <span>{currentIndex+1}/{slideUrls.length}</span>
          <FontAwesomeIcon
            className="icon next"
            icon={faChevronRight}
            onClick={() => {
              setCurrentIndex(prev => (prev + 1) % slideUrls.length);
            }}
          />
        </div>
      </div>
      <div className={`loader ${isLoading ? '' : 'hidden'}`}>
        <DotLoader />
      </div>
    </div>
  );
}

export default EventSlide;
