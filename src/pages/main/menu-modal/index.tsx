import api from '@cdleesang/tableorder-api-sdk';
import { MenuDetail } from '@cdleesang/tableorder-api-sdk/lib/structures/MenuDetail';
import moment from 'moment';
import { useEffect, useMemo, useState } from 'react';
import { createSearchParams, useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from '../../../components/toast-container/utils/toast';
import { useConnection } from '../../../hooks/use-connection';
import { ROUTES } from '../../../route/routes';
import './index.scss';
import MenuFooter from './menu-footer';
import MenuHeader from './menu-header';
import MenuOptionGroup from './menu-option-group';

function MenuModal() {
  const [isClosing, setIsClosing] = useState(false);
  const [menu, setMenu] = useState<MenuDetail | undefined>(undefined);
  const [searchParams] = useSearchParams();
  const navigator = useNavigate();
  const menuId = parseInt(searchParams.get('menuId') || '');
  const [quantity, setQuantity] = useState(1);
  const [selectedMainOptionId, setSelectedMainOptionId] = useState<number | undefined>(undefined);
  const [selectedSubOptionIds, setSelectedSubOptionIds] = useState<{
    [groupId: number]: number[];
  } | undefined>();
  const totalPrice = useMemo(() => {
    if(!menu || !selectedMainOptionId || !selectedSubOptionIds) {
      return 0;
    }

    const mainOptionPrice = menu.mainOptions.find(option => option.id === selectedMainOptionId)?.price || 0;
    const subOptionPrice = menu.subOptionGroups.reduce<number>((acc, group) => {
      return acc + group.subOptions.reduce<number>((acc, option) => {
        return acc + (selectedSubOptionIds?.[group.id]?.includes(option.id) ? option.price : 0);
      }, 0);
    }, 0);
    
    return (mainOptionPrice + subOptionPrice) * quantity;
  }, [menu, selectedMainOptionId, selectedSubOptionIds, quantity]);
  const connection = useConnection();

  const modalHandler = () => {
    setIsClosing(true);
    setTimeout(() => {
      closeModal();
    }, 200)
  }

  function closeModal() {
    navigator({
      pathname: ROUTES.MAIN,
      search: createSearchParams({
        ...Object.fromEntries(searchParams),
        menuId: '',
      }).toString(),
    });
  }

  useEffect(() => {
    api.functional.menu.getMenuDetailById(connection, menuId)
      .then(menuDetail => {
        setMenu(menuDetail);
        setSelectedMainOptionId(menuDetail.mainOptions[0].id);
        setSelectedSubOptionIds(menuDetail.subOptionGroups.reduce<{
          [groupId: number]: number[];
        }>((acc, group) => {
          acc[group.id] = [];
          return acc;
        }, {})
        );
      })
      .catch((err) => {
        localStorage.setItem('getMenuDetail', moment().format('YYYY-MM-DD HH:mm:ss') + ' ' + JSON.stringify(err));

        toast('error', '메뉴를 불러오는데 실패했습니다.');
      });
  }, []);

  return (
    <>
      <div className={`menu-modal-backdrop ${isClosing ? 'closing' : ''}`} onClick={modalHandler} />
      <div className={`menu-modal ${isClosing ? 'closing' : ''}`}>
        {
          menu && (
            menu.isDisplay
              ? <>
                <div className="menu-container">
                  <MenuHeader {...menu} />
                  <div className="menu-body">
                    <MenuOptionGroup
                      selectedOptionIds={new Set(selectedMainOptionId ? [selectedMainOptionId] : [])}
                      setSelectedOptionIds={(optionIds: number[]) => {
                        setSelectedMainOptionId(optionIds[0]);
                      }}
                      name={'품목'}
                      isRequired={true}
                      options={menu.mainOptions.map(option => ({
                        id: option.id,
                        name: option.name,
                        price: option.price,
                        isSoldOut: false,
                      }))}
                    />
                    {
                      menu.subOptionGroups.map(group => (
                        <MenuOptionGroup
                          key={group.id}
                          selectedOptionIds={new Set(selectedSubOptionIds?.[group.id] || [])}
                          setSelectedOptionIds={(optionIds: number[]) => {
                            setSelectedSubOptionIds(prev => ({
                              ...prev,
                              [group.id]: optionIds,
                            }));
                          }}
                          name={group.name}
                          isRequired={group.isRequired}
                          multiSelectOptions={group.multiSelectOptions ? group.multiSelectOptions : undefined}
                          options={group.subOptions.map(option => ({
                            id: option.id,
                            name: option.name,
                            price: option.price,
                            isSoldOut: option.isSoldOut,
                          }))}
                        />
                      ))
                    }
                  </div>
                </div>
                <MenuFooter
                  menu={menu}
                  quantity={quantity}
                  increaseQuantity={() => setQuantity(prev => prev + 1)}
                  decreaseQuantity={() => setQuantity(prev => prev > 1 ? prev - 1 : 1)}
                  totalPrice={totalPrice}
                  selectedMainOptionId={selectedMainOptionId}
                  selectedSubOptionIds={selectedSubOptionIds || {}}
                  closeModal={modalHandler}
                />
              </>
              : <div className="not-display">
                <span>관리자에 의해 미노출된 메뉴입니다.</span>
              </div>
          )
        }
      </div>
    </>
  );
}

export default MenuModal;