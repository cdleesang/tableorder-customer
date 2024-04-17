import api from '@oz-k/cdleesang-tableorder-api-sdk';
import { useEffect, useState } from 'react';
import { useConnection } from '../../../service/connection';
import './index.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import { toast } from '../../../components/toast-container/utils/toast';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { currentCategoryState, openedCategoriesState } from '../../../store/state';
import { MenuCategory } from '@oz-k/cdleesang-tableorder-api-sdk/lib/structures/MenuCategory';

function Navigation() {
  const [currentCategory, setCurrentCategory] = useRecoilState(currentCategoryState);
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [openedCategories, setOpenedCategories] = useRecoilState(openedCategoriesState);
  const connection = useConnection();
  
  useEffect(() => {
    api.functional.menu.category.getMenuCategories(connection)
      .then(setCategories)
      .catch(() => {
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
                    setCurrentCategory({
                      mainCategory: {id: mainCategory.id, name: mainCategory.name}
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
                      className={`sub-category ${currentCategory?.mainCategory.id === mainCategory.id && !currentCategory?.subCategory ? 'selected' : ''}`}
                      onClick={() => setCurrentCategory({
                        mainCategory: {id: mainCategory.id, name: mainCategory.name},
                      })}
                    >
                      전체
                    </div>
                    {
                      mainCategory.subCategories.map(subCategory => (
                        <div
                          className={`sub-category ${currentCategory?.subCategory?.id === subCategory.id ? 'selected' : ''}`}
                          key={subCategory.id}
                          onClick={() => setCurrentCategory({
                            mainCategory: {id: mainCategory.id, name: mainCategory.name},
                            subCategory: {id: subCategory.id, name: subCategory.name},
                          })}
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