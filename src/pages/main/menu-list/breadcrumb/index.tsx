import { createSearchParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { ROUTES } from '../../../../route/routes';
import { menuCategoriesState } from '../../../../store/state';
import './index.scss';

function Breadcrumb() {
  const [searchParams] = useSearchParams();
  const navigator = useNavigate();
  const categories = useRecoilValue(menuCategoriesState);
  const currentMainCategory = categories.find(category => category.id === parseInt(searchParams.get('mainCategoryId') || ''));
  const currentSubCategory = currentMainCategory?.subCategories.find(subCategory => subCategory.id === parseInt(searchParams.get('subCategoryId') || ''));

  return searchParams.get('mainCategoryId')
    ? (
      <div className={'breadcrumb'}>
        <div
          className="badge main-category"
          onClick={() => {
            navigator({
              pathname: ROUTES.MAIN,
              search: createSearchParams({
                mainCategoryId: searchParams.get('mainCategoryId') || '',
              }).toString(),
            });
          }}
        >
          {currentMainCategory?.name}
        </div>
        {
          currentMainCategory && currentSubCategory && <>
            <div className="divider" />
            <div className="badge sub-category" onClick={() => {
              navigator({
                pathname: ROUTES.MAIN,
                search: createSearchParams({
                  mainCategoryId: searchParams.get('mainCategoryId') || '',
                  subCategoryId: searchParams.get('subCategoryId') || '',
                }).toString(),
              });
            }}>
              {currentSubCategory.name}
            </div>
          </>
        }
      </div>)
    : <></>;
}

export default Breadcrumb;