import api from '@cdleesang/tableorder-api-sdk';
import { Menu } from '@cdleesang/tableorder-api-sdk/lib/structures/Menu';
import moment from 'moment';
import { useEffect, useRef, useState } from 'react';
import { createSearchParams, useNavigate, useSearchParams } from 'react-router-dom';
import { RingSpinner } from 'react-spinner-overlay';
import { priceComma } from '../../../common/utils/price-comma.util';
import { toast } from '../../../components/toast-container/utils/toast';
import { useConnection } from '../../../hooks/use-connection';
import { ROUTES } from '../../../route/routes';
import Breadcrumb from './breadcrumb';
import './index.scss';

function MenuList() {
  const [searchParams] = useSearchParams();
  const mainCategoryId = searchParams.get('mainCategoryId') || '';
  const subCategoryId = searchParams.get('subCategoryId') || '';
  const [menus, setMenus] = useState<Menu[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const observerRef = useRef<HTMLDivElement>(null);
  const navigator = useNavigate();
  const connection = useConnection();

  const page = useRef<number>(1);
  const hasMore = useRef<boolean>(true);

  async function fetchMenus() {
    if(isLoading || !mainCategoryId || !hasMore.current) return;

    setIsLoading(true);

    try {
      const {menus} = await api.functional.menu.getPaginatedMenusByCategory(connection, {
        page: page.current,
        categoryId: parseInt(searchParams.get('mainCategoryId') || '', 10),
        subCategoryId: searchParams.get('subCategoryId') ? parseInt(searchParams.get('subCategoryId') || '', 10) : undefined,
      });

      setMenus(prevMenus => [...prevMenus, ...menus]);
    } catch(err) {
      if(err instanceof api.HttpError && err.status === 404) {
        hasMore.current = false;
      } else {
        localStorage.setItem('getPaginatedMenus', moment().format('YYYY-MM-DD HH:mm:ss') + ' ' + JSON.stringify(err));
        toast('error', '메뉴를 불러오는 중 오류가 발생했습니다.')
      }
    }

    setIsLoading(false);
    page.current++;
  }

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if(entries[0].isIntersecting) {
        fetchMenus();
      }
    });

    const observerTarget = observerRef.current;
    
    page.current = 1;
    hasMore.current = true;
    setMenus([]);
    fetchMenus().then(() => {
      if(observerTarget) {
        observer.observe(observerTarget);
      }
    });

    return () => {
      if(observerTarget) {
        observer.unobserve(observerTarget);
      }
    }
  }, [mainCategoryId, subCategoryId]);

  return (
    <div className="menu-list" key={`${mainCategoryId}_${subCategoryId}`}>
      <Breadcrumb />
      <div className="card-container">
        {
          menus.map(menu => (
            <div
              className={`card ${menu.isSoldOut ? 'sold-out' : ''}`}
              key={menu.id}
              onClick={() => {
                navigator({
                  pathname: ROUTES.MAIN,
                  search: createSearchParams({
                    mainCategoryId,
                    subCategoryId,
                    menuId: menu.id.toString(),
                  }).toString(),
                });
              }}
            >
              <div
                className={`card-image`}
                style={{backgroundImage: `url(${menu.imageUrl})`}}
              />
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