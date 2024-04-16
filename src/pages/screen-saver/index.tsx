import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import api from '@oz-k/cdleesang-tableorder-api-sdk';
import { useEffect, useRef, useState } from 'react';
import { DotLoader } from 'react-spinner-overlay';
import { useRecoilState } from 'recoil';
import { useConnection } from '../../service/connection';
import { isIdleState } from '../../store/state';
import './index.scss';
import { toast } from '../../components/toast-container/utils/toast';
import { SLIDE_INTERVAL } from '../../constants/constant';

function connectSSE(host: string, setSlideUrls: (slideUrls: string[]) => void) {
  const sse = new EventSource(`${host}/notification/sse`);

  sse.onerror = () => {
    sse.close();
    setTimeout(() => {
      connectSSE(host, setSlideUrls);
    }, 5000);
  }

  sse.addEventListener('SlideImageChanged', event => {
    setSlideUrls(JSON.parse(event.data));
  });
}

function ScreenSaver() {
  const [slideUrls, setSlideUrls] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const carouselRef = useRef(null);
  const [isIdle, setIsIdle] = useRecoilState(isIdleState);
  const [isLoading, setIsLoading] = useState(true);
  const connection = useConnection();
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const autoSlideSetTimeoutId = useRef<NodeJS.Timeout | null>(null);

  const onTouchStart = (event: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(event.touches[0].clientX);
  }

  const onTouchMove = (event: React.TouchEvent) => {
    setTouchEnd(event.touches[0].clientX);
  }

  const onTouchEnd = () => {
    if(!(touchStart && touchEnd)) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if(isLeftSwipe || isRightSwipe) {
      setCurrentIndex(prev => isLeftSwipe ? (prev + 1) % slideUrls.length : (prev - 1 + slideUrls.length) % slideUrls.length);
    }
  }

  useEffect(() => {
    // 슬라이드 이미지 초기화
    api.functional.store.slide_image.getAllSlideImages(connection)
      .then(({imageUrls}) => {
        setSlideUrls(imageUrls);
        
        setIsLoading(false);
      })
      .catch(() => {
        setIsLoading(false);

        toast('error', '슬라이드 이미지를 불러오는 중 오류가 발생했습니다');
      });

    connectSSE(connection.host, setSlideUrls);
  }, []);

  useEffect(() => {
    if(autoSlideSetTimeoutId.current) {
      clearTimeout(autoSlideSetTimeoutId.current);
    }

    autoSlideSetTimeoutId.current = setTimeout(() => {
      setCurrentIndex(prev => (prev + 1) % slideUrls.length);
    }, SLIDE_INTERVAL);
  }, [currentIndex, slideUrls]);

  return (
    <div
      className={`screen-saver ${isIdle ? 'show' : 'hidden'}`}
      onClick={() => {setIsIdle(false)}}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      <div className="slide-container">
        <div className="carousel" ref={carouselRef}>
          {slideUrls.map((url, index) => (
            <div key={index} className={`slide${index === currentIndex ? ' active' : ''}`}>
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
      <div className={`loader${isLoading ? '' : ' hidden'}`}>
        <DotLoader />
      </div>
    </div>
  );
}

export default ScreenSaver;
