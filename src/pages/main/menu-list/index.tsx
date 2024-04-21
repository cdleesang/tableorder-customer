import api from '@cdleesang/tableorder-api-sdk';
import { Menu } from '@cdleesang/tableorder-api-sdk/lib/structures/Menu';
import { useEffect, useRef, useState } from 'react';
import { RingSpinner } from 'react-spinner-overlay';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { toast } from '../../../components/toast-container/utils/toast';
import { useConnection } from '../../../service/connection';
import { currentCategoryState, currentViewMenuIdState } from '../../../store/state';
import './index.scss';
import { priceComma } from '../../../utils/price-comma';
import moment from 'moment';

function Breadcrumb() {
  const [currentCategory, setCurrentCategory] = useRecoilState(currentCategoryState);

  return currentCategory
    ? (
      <div className={`breadcrumb`}>
        <div
          className="badge main-category"
          onClick={() => {
            setCurrentCategory({
              mainCategory: currentCategory.mainCategory
            });
          }}
        >
          {currentCategory.mainCategory.name}
        </div>
        {
          currentCategory.subCategory && <>
            <div className="divider" />
            <div className="badge sub-category" onClick={() => {
              setCurrentCategory(currentCategory);
            }}>
              {currentCategory.subCategory.name}
            </div>
          </>
        }
      </div>)
    : <></>;
}

function MenuList() {
  const setCurrentViewMenuId = useSetRecoilState(currentViewMenuIdState);
  const currentCategory = useRecoilValue(currentCategoryState);
  const [menus, setMenus] = useState<Menu[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const observerRef = useRef<HTMLDivElement>(null);
  const connection = useConnection();

  const page = useRef<number>(1);
  const hasMore = useRef<boolean>(true);
  const currentCategoryRef = useRef(currentCategory);

  function fetchMenus() {
    if(isLoading) return;
    if(!currentCategoryRef.current) return;
    if(!hasMore.current) return;

    setIsLoading(true);

    api.functional.menu.getPaginatedMenusByCategory(connection, {
      page: page.current,
      categoryId: currentCategoryRef.current.mainCategory.id,
      subCategoryId: currentCategoryRef.current?.subCategory?.id,
    }).then(({ menus }) => {
      setMenus(prevMenus => [...prevMenus, ...menus]);
      setIsLoading(false);
    }).catch((err) => {
      setIsLoading(false);

      if(err instanceof api.HttpError && err.status === 404) {
        hasMore.current = false;
        return;
      }

      localStorage.setItem('getPaginatedMenus', moment().format('YYYY-MM-DD HH:mm:ss') + ' ' + JSON.stringify(err));
      toast('error', '메뉴를 불러오는 중 오류가 발생했습니다.');
    });

    page.current++;
  }

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if(entries[0].isIntersecting) {
        fetchMenus();
      }
    });

    const observerTarget = observerRef.current;

    if(observerTarget) {
      observer.observe(observerTarget);
    }
  }, []);

  useEffect(() => {
    currentCategoryRef.current = currentCategory;

    if(currentCategory) {
      page.current = 1;
      hasMore.current = true;
      setMenus([]);
      fetchMenus();
    }
  }, [currentCategory, currentCategory?.mainCategory?.id, currentCategory?.subCategory?.id]);

  return (
    <div className="menu-list">
      <Breadcrumb />
      <div className="card-container">
        {
          menus.map(menu => (
            <div
              className="card"
              key={menu.id}
              onClick={() => setCurrentViewMenuId(menu.id)}
            >
              <div className={`card-image${menu.isSoldOut ? ' sold-out' : ''}`} style={{backgroundImage: `url(${menu.imageUrl})`}} />
              <div className="card-body">
                <div className="card-title" dangerouslySetInnerHTML={{__html: menu.name}} />
                <div className="card-price">{priceComma(menu.price||0)}원</div>
              </div>
            </div>
          ))
        }
        {isLoading && <div className="loader"><RingSpinner /></div>}
        <div className="observer" ref={observerRef} />
      </div>
    </div>
  );
}

export default MenuList;