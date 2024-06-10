import api from '@cdleesang/tableorder-api-sdk';
import { MenuDetail } from '@cdleesang/tableorder-api-sdk/lib/structures/MenuDetail';
import { OrderImmediatelyBody } from '@cdleesang/tableorder-api-sdk/lib/structures/OrderImmediatelyBody';
import { faMinus, faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { createSearchParams, useNavigate, useSearchParams } from 'react-router-dom';
import { RingSpinner } from 'react-spinner-overlay';
import { useSetRecoilState } from 'recoil';
import { priceComma } from '../../../common/utils/price-comma.util';
import { toast } from '../../../components/toast-container/utils/toast';
import { useConnection } from '../../../hooks/use-connection';
import { ROUTES } from '../../../route/routes';
import { cartState } from '../../../store/state';
import './index.scss';
import MenuOptionGroup from './menu-option-group';
import { playNotificationSound } from '../../../common/utils/play-notification-sound.util';

function MenuModal() {
  const [isClosing, setIsClosing] = useState(false);
  const [isOrdering, setIsOrdering] = useState(false);
  const [isCartAdding, setIsCartAdding] = useState(false);
  const [menu, setMenu] = useState<MenuDetail | undefined>(undefined);
  const [searchParams] = useSearchParams();
  const navigator = useNavigate();
  const menuId = parseInt(searchParams.get('menuId') || '');
  const [quantity, setQuantity] = useState(1);
  const [selectedMainOptionId, setSelectedMainOptionId] = useState<number | undefined>(undefined);
  const [selectedSubOptionIds, setSelectedSubOptionIds] = useState<{
    [groupId: number]: number[];
  } | undefined>();
  const totalPrice = (
    // 선택된 메인 옵션의 가격
    (
      menu
        ? (menu.mainOptions.find(mainOption => mainOption.id === selectedMainOptionId)?.price || 0)
        : 0
    )
    // 선택된 서브 옵션들의 가격
    + (
      menu
        ? menu.subOptionGroups.reduce<number>((acc, group) => {
          return acc + group.subOptions.reduce<number>((acc, option) => {
            return acc + (selectedSubOptionIds?.[group.id]?.includes(option.id) ? option.price : 0);
          }, 0);
        }, 0)
        : 0
    )
  ) * quantity;
  const setCartItems = useSetRecoilState(cartState);
  const connection = useConnection();

  const modalHandler = () => {
    setIsClosing(true);
    setTimeout(() => {
      closeMenuModal();
    }, 200)
  }

  function validate() {
    if(!menu) {
      // 초기화 중인 경우
      return;
    }

    if(menu.isSoldOut || !menu.isDisplay) {
      // 품절 또는 미노출인 경우
      return false;
    }

    if(!selectedMainOptionId) {
      // 메인 옵션 선택을 안한 경우
      return false;
    }

    for(const group of menu.subOptionGroups) {
      if(!selectedSubOptionIds) {
        // 초기화 중인 경우
        return false;
      }

      if(group.isRequired && !(selectedSubOptionIds[group.id].length)) {
        // 필수 옵션 선택을 안한 경우
        return false;
      }
      
      if(group.multiSelectOptions) {
        if(group.multiSelectOptions.min !== -1 && selectedSubOptionIds[group.id].length < group.multiSelectOptions.min) {
          // 최소 선택개수 미만으로 선택한 경우
          return false;
        } else if(group.multiSelectOptions.max !== -1 && selectedSubOptionIds[group.id].length > group.multiSelectOptions.max) {
          // 최대 선택개수 초과로 선택한 경우
          return false;
        }
      }
    }

    return true;
  }

  function closeMenuModal() {
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
                  <div className="menu-header">
                    <div
                      className={`menu-img ${menu.isSoldOut ? 'sold-out' : ''}`}
                      style={{backgroundImage: `url(${menu.imageUrl})`,}}
                    />
                    <div className="menu-info">
                      <div className="menu-name" dangerouslySetInnerHTML={{__html: menu.name}} />
                      <div className="menu-description" dangerouslySetInnerHTML={{__html: menu.description}} />
                    </div>
                  </div>
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
                <div className="menu-footer">
                  <div className="menu-price">
                    {
                      priceComma(totalPrice)
                    }원
                  </div>
                  <div className="menu-quantity">
                    <FontAwesomeIcon
                      icon={faMinus}
                      onClick={() => {
                        if(quantity > 1) {
                          setQuantity(quantity - 1);
                        }
                      }}
                    />
                    <span className="counter">{quantity}</span>
                    <FontAwesomeIcon
                      icon={faPlus}
                      onClick={() => setQuantity(quantity + 1)}
                    />
                  </div>
                  <div className="menu-buttons">
                    <button
                      className="cart-button"
                      type="button"
                      disabled={isCartAdding || !validate()}
                      onClick={() => {
                        if(selectedMainOptionId === undefined || selectedSubOptionIds === undefined) {
                          return;
                        }

                        setIsCartAdding(true);

                        const selectedMainOption = menu.mainOptions.find(option => option.id === selectedMainOptionId)!;
                        const selectedSubOptions = Object.keys(selectedSubOptionIds).reduce((acc, key) => {
                          const groupId = parseInt(key, 10);

                          return [
                            ...acc,
                            ...(
                              selectedSubOptionIds[groupId].map(selectedOptionId => {
                                const subOptionGroup = menu.subOptionGroups.find(group => group.id === groupId)!;
                                const selectedSubOption = subOptionGroup.subOptions.find(option => option.id === selectedOptionId)!;

                                return {
                                  groupId,
                                  groupName: menu.subOptionGroups.find(group => group.id === groupId)!.name,
                                  optionId: selectedOptionId,
                                  optionName: selectedSubOption.name,
                                  optionPrice: selectedSubOption.price,
                                };
                              })
                            ),
                          ];
                        }, [] as Array<{
                            groupId: number,
                            groupName: string,
                            optionId: number,
                            optionName: string,
                            optionPrice: number,
                        }>);

                        api.functional.cart.addItem(connection, {
                          menuId: menu.id,
                          amount: quantity,
                          totalPrice,
                          menuMainOptionId: selectedMainOptionId,
                          menuSubOptions: Object.keys(selectedSubOptionIds).reduce((acc, key) => {
                            const groupId = parseInt(key, 10);

                            return [
                              ...acc,
                              ...(
                                selectedSubOptionIds[groupId].map(optionId => ({
                                  optionGroupId: groupId,
                                  optionId,
                                }))
                              ),
                            ];
                          }, [] as OrderImmediatelyBody['menuSubOptions']),
                        }).then(cartItemId => {
                          setCartItems(prev => [
                            {
                              id: cartItemId,
                              menuId: menu.id,
                              menuName: menu.name,
                              menuTotalPrice: totalPrice,
                              imageUrl: menu.imageUrl,
                              menuAmount: quantity,
                              menuMainOption: {
                                id: selectedMainOptionId,
                                name: selectedMainOption.name,
                                price: selectedMainOption.price,
                              },
                              menuSubOptions: selectedSubOptions,
                            },
                            ...prev,
                          ]);
                          setIsCartAdding(false);
                          closeMenuModal();
                        }).catch(err => {
                          setIsCartAdding(false);
                          if(err instanceof api.HttpError && err.status === 409) {
                            toast('error', '장바구니에 더 이상 추가할 수 없습니다.');
                            return;
                          }
                          localStorage.setItem('addItem', JSON.stringify(err));

                          toast('error', '장바구니에 추가하는데 실패했습니다.');
                        });
                      }}
                    >
                      {isCartAdding ? <div className="loader"><RingSpinner size={25} /></div> : '장바구니에 추가'}
                    </button>
                    <button
                      className="order-button"
                      type="button"
                      disabled={isOrdering || !validate()}
                      onClick={() => {
                        if(selectedMainOptionId === undefined || selectedSubOptionIds === undefined) {
                          return;
                        } 
                        
                        setIsOrdering(true);

                        api.functional.order.orderImmediately(connection, {
                          menuId: menu.id,
                          totalPrice,
                          amount: quantity,
                          menuMainOptionId: selectedMainOptionId,
                          menuSubOptions: Object.keys(selectedSubOptionIds).reduce((acc, key) => {
                            const groupId = parseInt(key, 10);

                            return [
                              ...acc,
                              ...(
                                selectedSubOptionIds[groupId].map(optionId => ({
                                  optionGroupId: groupId,
                                  optionId,
                                }))
                              ),
                            ];
                          },
                          [] as OrderImmediatelyBody['menuSubOptions']),
                        }).then(() => {
                          playNotificationSound().catch(() => {});
                          toast('success', '주문이 완료되었습니다.');
                          setIsOrdering(false);
                          closeMenuModal();
                        }).catch((err) => {
                          localStorage.setItem('order', JSON.stringify(err));

                          toast('error', '주문에 실패했습니다.');
                          setIsOrdering(false);
                        })
                      }}
                    >
                      {isOrdering ? <div className="loader"><RingSpinner size={25} /></div> : '주문하기'}
                    </button>
                  </div>
                </div>
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