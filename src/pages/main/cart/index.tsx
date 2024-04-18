import { faCartShopping, faMinus, faPlus, faTrashCan, faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import api from '@cdleesang/tableorder-api-sdk';
import { useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import { priceComma } from '../../../utils/price-comma';
import { toast } from '../../../components/toast-container/utils/toast';
import { useConnection } from '../../../service/connection';
import { cartState } from '../../../store/state';
import './index.scss';
import { RingSpinner } from 'react-spinner-overlay';

function Cart() {
  const [cartItems, setCartItems] = useRecoilState(cartState);
  const cartTotalPrice = cartItems.reduce((acc, item) => acc + item.menuTotalPrice, 0);
  const [isOrdering, setIsOrdering] = useState(false);
  const connection = useConnection();

  useEffect(() => {
    api.functional.cart.getAllCartItems(connection)
      .then(({cartItems}) => setCartItems(cartItems.reverse()))
      .catch(() => toast('error', '장바구니를 불러오는 중 오류가 발생했습니다'));
  }, []);
  
  return (
    <div className="cart">
      <div className="cart-header">
        <h3 className="title">장바구니</h3>
        <button
          type="button"
          className="clear-button"
          onClick={() => {
            api.functional.cart.clearCart(connection)
              .then(() => setCartItems([]))
              .catch(() => toast('error', '장바구니를 비우는 중 오류가 발생했습니다'));
          }}
        >
          <FontAwesomeIcon className="clear-icon" icon={faTrashCan} />
        </button>
      </div>
      <div className="cart-body">
        {
          cartItems.length > 0
            ? <>
              {
                cartItems.map(item => (
                  <div className="cart-item" key={item.id}>
                    <div className="item-top">
                      <img className="menu-img" src={item.imageUrl} alt="메뉴 사진" />
                      <div className="menu-info">
                        <div className="menu-name-box">
                          <div className="menu-name">{item.menuName}</div>
                          <button className="delete-btn" type='button' onClick={() => {
                            api.functional.cart.deleteItemById(connection, item.id)
                              .then(() => {
                                setCartItems(prev => prev.filter(cartItem => cartItem.id !== item.id))
                              })
                              .catch(() => {
                                toast('error', '메뉴를 삭제하는 중 오류가 발생했습니다');
                              })
                          }}>
                            <FontAwesomeIcon icon={faXmark} />
                          </button>
                        </div>
                        <div className="menu-price">{priceComma(item.menuTotalPrice)}원</div>
                      </div>
                    </div>
                    <div className="item-bottom">
                      <div className="item-options">
                        {
                          [
                            {
                              groupId: 'main',
                              optionId: item.menuMainOption.id,
                              optionName: item.menuMainOption.name,
                              optionPrice: item.menuMainOption.price,
                            }, 
                            ...item.menuSubOptions
                          ].map(option => (
                            <div className="option" key={`${option.groupId}_${option.optionId}`}>
                              <span className="option-name">{option.optionName}</span>
                              <span className="option-price">{priceComma(option.optionPrice)}원</span>
                            </div>
                          ))
                        }
                      </div>
                      <div className="item-count">
                        <div
                          className="minus"
                          onClick={() => {
                            setCartItems(prev => prev.map(cartItem => {
                              if(cartItem.id === item.id) {
                                const newAmount = Math.max(1, item.menuAmount - 1);

                                return {
                                  ...cartItem,
                                  menuAmount: newAmount,
                                  menuTotalPrice: cartItem.menuTotalPrice / cartItem.menuAmount * newAmount,
                                };
                              }
                              return cartItem;
                            }))
                          }}
                        >
                          <FontAwesomeIcon icon={faMinus} />
                        </div>
                        <span className="counter">{item.menuAmount}</span>
                        <div
                          className="plus"
                          onClick={() => {
                            setCartItems(prev => prev.map(cartItem => {
                              if(cartItem.id === item.id) {
                                const newAmount = item.menuAmount + 1;

                                return {
                                  ...cartItem,
                                  menuAmount: newAmount,
                                  menuTotalPrice: cartItem.menuTotalPrice / cartItem.menuAmount * newAmount,
                                };
                              }
                              return cartItem;
                            }))
                          }}
                        >
                          <FontAwesomeIcon icon={faPlus} />
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              }
            </>
            : <div className="empty">
              <span><FontAwesomeIcon icon={faCartShopping}/></span>
              <span>장바구니가<br/>텅 비었어요</span>
            </div>
        }
      </div>
      <div className="cart-footer">
        <div className="total-price">{cartTotalPrice.toLocaleString()}원</div>
        <button
          type="button"
          className="order-cart-button"
          disabled={isOrdering || cartItems.length === 0}
          onClick={() => {
            setIsOrdering(true);
            api.functional.order.cart.orderCart(connection, {
              cartItems: cartItems.map(item => ({
                id: item.id,
                amount: item.menuAmount,
                price: item.menuTotalPrice,
              })),
            })
              .then(() => {
                toast('success', '주문이 완료되었습니다');
                setCartItems([]);
                setIsOrdering(false);
              })
              .catch(() => {
                toast('error', '주문을 하는 중 오류가 발생했습니다');
                setIsOrdering(false);
              });
          }}
        >
          {isOrdering ? <div className="loader"><RingSpinner size={25} /></div> : '주문하기'}
        </button>
      </div>
    </div>
  );
}

export default Cart;