import api from '@oz-k/cdleesang-tableorder-api-sdk';
import { useEffect, useState } from 'react';
import { useConnection } from '../../../service/connection';
import './index.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import { toast } from '../../../components/toast-container/utils/toast';
import { useSetRecoilState } from 'recoil';
import { currentCategoryState } from '../../../store/state';
import { MenuCategory } from '@oz-k/cdleesang-tableorder-api-sdk/lib/structures/MenuCategory';

function Navigation() {
  const setCurrentCategory = useSetRecoilState(currentCategoryState);
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [isOpenedCategories, setIsOpenedCategories] = useState<Record<string, boolean>>({});
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
                    setIsOpenedCategories(prev => ({
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
                        setIsOpenedCategories(prev => ({
                          ...prev, [mainCategory.id]: !prev[mainCategory.id]
                        }));
                      }}
                    >
                      <FontAwesomeIcon
                        className="dropdown-icon"
                        icon={isOpenedCategories[mainCategory.id] ? faChevronUp : faChevronDown}
                      />
                    </div>
                }
              </div>
              {
                mainCategory.subCategories.length > 1
                  && <div className={`item-body${isOpenedCategories[mainCategory.id] ? ' opened' : ''}`}>
                    <div
                      className="sub-category"
                      onClick={() => setCurrentCategory({
                        mainCategory: {id: mainCategory.id, name: mainCategory.name},
                      })}
                    >
                      전체
                    </div>
                    {
                      mainCategory.subCategories.map(subCategory => (
                        <div
                          className="sub-category"
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