import { faReceipt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import api from '@cdleesang/tableorder-api-sdk';
import { GetAllOrderHistoriesResponse } from '@cdleesang/tableorder-api-sdk/lib/structures/GetAllOrderHistoriesResponse';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { RingSpinner } from 'react-spinner-overlay';
import { useSetRecoilState } from 'recoil';
import { useConnection } from '../../../service/connection';
import { getEnteredAt, isOrderHistoryModalOpenState } from '../../../store/state';
import { priceComma } from '../../../utils/price-comma';
import { toast } from '../../../components/toast-container/utils/toast';
import './index.scss';

function OrderHistoryModal() {
  const setIsOrderHistoryModalOpen = useSetRecoilState(isOrderHistoryModalOpenState);
  const [orderHistories, setOrderHistories] = useState<GetAllOrderHistoriesResponse['orderHistories']>([]);
  const [isLoading, setIsLoading] = useState(true);
  const connection = useConnection();

  useEffect(() => {
    api.functional.order.getAllOrderHistories(connection, {
      enteredAt: (getEnteredAt() || new Date()).toISOString(),
    }).then(({orderHistories}) => {
      setOrderHistories(orderHistories.reverse());
      setIsLoading(false);
    }).catch((err) => {
      localStorage.setItem('getAllOrderHistory', moment().format('YYYY-MM-DD HH:mm:ss') + ' ' + JSON.stringify(err));

      toast('error', '주문 내역을 불러오는 중 오류가 발생했습니다');
      setIsLoading(false);
    });
  }, []);

  return (
    <>
      <div className="order-history-backdrop" onClick={() => setIsOrderHistoryModalOpen(false)}></div>
      <div className="order-history">
        <div className="order-history-header">
          <h2 className="order-history-title">
            주문 내역
          </h2>
          {
            (!isLoading && orderHistories.length > 0) &&
              <span className="order-total-price">
                총 주문 금액: {priceComma(orderHistories.reduce((acc, orderHistory) => acc + orderHistory.totalPrice, 0))}원
              </span>
          }
        </div>
        <div className="order-history-list">
          {
            isLoading
              ? <div className="order-history-loading">
                <RingSpinner size={40} />
              </div>
              : orderHistories.length > 0
                ? orderHistories.map(orderHistory => (
                    <div className="order-history-item" key={orderHistory.id}>
                      <div className="order-history-item-top">
                        <div className="order-history-item-id">주문번호: {orderHistory.orderSeq}</div>
                        <div className="order-history-item-time">{moment(orderHistory.createdAt).format('YYYY-MM-DD HH:mm')}</div>
                        <div className="order-history-item-total-price">{priceComma(orderHistory.totalPrice)}원</div>
                      </div>
                      <div className="order-history-item-body">
                        {
                          orderHistory.menus.map(menu => (
                            <div className="order-history-item-menu menu" key={menu.id}>
                              <div className="menu-top">
                                <span className="menu-name">
                                  {menu.name}
                                  {
                                    menu.amount > 1 &&
                                      <span className="menu-times">
                                        *
                                        {menu.amount}
                                      </span>
                                  }
                                </span>
                                <span className="menu-price">{priceComma(menu.totalPrice)}원</span>
                              </div>
                              <div className="menu-body">
                                <div className="menu-options">
                                  <div className="menu-option" key={`${menu.id}_메인`}>
                                    <span className="menu-option-name">{menu.mainOptionName}</span>
                                  </div>
                                  {
                                    menu.subOptionGroups.map(option => (
                                      <div className="menu-option" key={`${option.groupName}_${option.optionName}`}>
                                        <span className="menu-option-name">{option.optionName}</span>
                                        <span className="menu-option-price">{priceComma(option.optionPrice)}원</span>
                                      </div>
                                    ))
                                  }
                                </div>
                              </div>
                            </div>
                          ))
                        }
                      </div>
                    </div>
                  ))
                : <div className="empty">
                  <span><FontAwesomeIcon icon={faReceipt}/></span>
                  <span>아직<br />주문한 적 없어요</span>
                </div>
          }
        </div>
      </div>
    </>
  );
}

export default OrderHistoryModal;