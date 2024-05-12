import api from '@cdleesang/tableorder-api-sdk';
import { MenuCategory } from '@cdleesang/tableorder-api-sdk/lib/structures/MenuCategory';
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import moment from 'moment';
import { useEffect } from 'react';
import { useSearchParams, createSearchParams } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { toast } from '../../../components/toast-container/utils/toast';
import { useConnection } from '../../../hooks/use-connection';
import { menuCategoriesState, openedCategoriesState } from '../../../store/state';
import './index.scss';
import useViewTransitionNavigate from '../../../hooks/use-view-transition-navigate';
import { ROUTES } from '../../../route/routes';

function Navigation() {
  const [searchParams] = useSearchParams();
  const navigator = useViewTransitionNavigate();
  const [categories, setCategories] = useRecoilState<MenuCategory[]>(menuCategoriesState);
  const [openedCategories, setOpenedCategories] = useRecoilState(openedCategoriesState);
  const connection = useConnection();
  
  useEffect(() => {
    api.functional.menu.category.getMenuCategories(connection)
      .then(setCategories)
      .catch((err) => {
        localStorage.setItem('getMenuCategory', moment().format('YYYY-MM-DD HH:mm:ss') + ' ' + JSON.stringify(err));

        toast('error', '카테고리를 불러오는 중 오류가 발생했습니다');
      });
  }, []);

  return (
    <>
      <div className="nav">
        {
          categories.map(mainCategory => (
            <div className="nav-item item" key={mainCategory.id}>
              <div className="item-title">
                <span
                  onClick={() => {
                    setOpenedCategories(prev => ({
                      ...prev, [mainCategory.id]: !prev[mainCategory.id]})
                    );
                    navigator({
                      pathname: ROUTES.MAIN,
                      search: createSearchParams({
                        mainCategoryId: mainCategory.id.toString(),
                      }).toString(),
                    });
                  }}
                >
                  {mainCategory.name}
                </span>
                {
                  mainCategory.subCategories.length > 1
                    && <div
                      className="clickable"
                      onClick={() => {
                        setOpenedCategories(prev => ({
                          ...prev, [mainCategory.id]: !prev[mainCategory.id]
                        }));
                      }}
                    >
                      <FontAwesomeIcon
                        className="dropdown-icon"
                        icon={openedCategories[mainCategory.id] ? faChevronUp : faChevronDown}
                      />
                    </div>
                }
              </div>
              {
                mainCategory.subCategories.length > 1
                  && <div className={`item-body${openedCategories[mainCategory.id] ? ' opened' : ''}`}>
                    <div
                      className={`sub-category ${searchParams.get('mainCategoryId') === mainCategory.id.toString() && !searchParams.get('subCategoryId') ? 'selected' : ''}`}
                      onClick={() => {
                        navigator({
                          pathname: ROUTES.MAIN,
                          search: createSearchParams({
                            mainCategoryId: mainCategory.id.toString(),
                          }).toString(),
                        });
                      }}
                    >
                      전체
                    </div>
                    {
                      mainCategory.subCategories.map(subCategory => (
                        <div
                          className={`sub-category ${searchParams.get('subCategoryId') === subCategory.id.toString() ? 'selected' : ''}`}
                          key={subCategory.id}
                          onClick={() => {
                            navigator({
                              pathname: ROUTES.MAIN,
                              search: createSearchParams({
                                mainCategoryId: mainCategory.id.toString(),
                                subCategoryId: subCategory.id.toString(),
                              }).toString(),
                            });
                          }}
                        >
                          {subCategory.name}
                        </div>
                      ))
                    }
                  </div>
              }
            </div>
          ))
        }
      </div>
    </>
  );
}

export default Navigation;