import { useEffect, useState } from 'react';
import './Intro.css';
// import { useRecoilValue } from 'recoil';
// import { selversState } from '../../store/SelversState';
// import { StoreApi } from '../../api/Store';
import axios from 'axios';

function Intro() {
  // const storeId = useRecoilValue(selversState).storeId;
  const [slideUrls, setSlideUrls] = useState<string[]>([]);
  const [url, setUrl] = useState<string>('http://localhost:3000');

  // useEffect(() => {
  //   StoreApi.getInstance().getSortedSlideUrls(storeId!).then(setSlideUrls);

  //   const interval = setInterval(() => {
  //     StoreApi.getInstance().getSortedSlideUrls(storeId!).then(setSlideUrls);
  //   }, 1000 * 60);

  //   return () => {
  //     clearInterval(interval);
  //   };
  // }, []);

  return (
    <>
      <div className="intro">
        <h1>청담이상 테이블오더 테스트 페이지</h1>
        <label htmlFor="port">URL: </label>
        <input id="port" type="text" value={url} onChange={e => setUrl(e.target.value)} />

        <button onClick={() => axios.get(url).then(res => alert(res.data)).catch(err => alert(err))}>테스트</button>

        <div className="slide">
          {slideUrls.map((url, index) => (
            <div key={index} className="slide-item">
              <img src={url} alt="" />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default Intro;
