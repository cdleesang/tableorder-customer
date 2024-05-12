import api from '@cdleesang/tableorder-api-sdk';
import { faReceipt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { RingSpinner } from 'react-spinner-overlay';
import { useSetRecoilState } from 'recoil';
import { toast } from '../toast-container/utils/toast';
import { useConnection } from '../../hooks/use-connection';
import { isOrderHistoryModalOpenState } from '../../store/state';
import { priceComma } from '../../common/utils/price-comma';
import './index.scss';
import Modal from '../modal';

type orderHistories = {
  orderTime: Date;
  totalPrice: number;
  histories: {
    name: string;
    amount: number;
    quantity: number;
  }[]
}[];

function OrderHistoryModal() {
  const setIsOrderHistoryModalOpen = useSetRecoilState(isOrderHistoryModalOpenState);
  const [orderHistories, setOrderHistories] = useState<orderHistories>([]);
  const [isLoading, setIsLoading] = useState(true);
  const connection = useConnection();

  useEffect(() => {
    api.functional.order.getOrderHistoriesByTableId(connection, parseInt(connection.headers?.tid || '0', 10))
      .then(({orderHistories}) => {
        const parsedHistories = orderHistories.reduce((prev, next) => {
          if(prev.length === 0) {
            return [{
              orderTime: new Date(next.orderTime),
              totalPrice: next.amount * next.quantity,
              histories: [{
                name: next.stockName,
                amount: next.amount,
                quantity: next.quantity,
              }]
            }];
          }

          const last = prev[prev.length - 1];
          if(moment(last.orderTime).isSame(next.orderTime, 'second')) {
            last.totalPrice += next.amount * next.quantity;
            last.histories.push({
              name: next.stockName,
              amount: next.amount,
              quantity: next.quantity,
            });
          } else {
            prev.push({
              orderTime: new Date(next.orderTime),
              totalPrice: next.amount * next.quantity,
              histories: [{
                name: next.stockName,
                amount: next.amount,
                quantity: next.quantity,
              }]
            });
          }
          return prev;
        }, [] as orderHistories);

        setOrderHistories(parsedHistories);
        setIsLoading(false);
      })
      .catch(err => {
        localStorage.setItem('getOrderHistoriesByTableId', moment().format('YYYY-MM-DD HH:mm:ss') + ' ' + JSON.stringify(err));
        toast('error', '주문 내역을 불러오는 중 오류가 발생했습니다');
        setIsLoading(false);
      })
  }, []);

  return (
    <Modal className="order-history" close={() => setIsOrderHistoryModalOpen(false)}>
      <div className="order-history-header">
          <h2 className="order-history-title">
            주문 내역
            <div className="desc" style={{fontSize: '.6em', opacity: .5}}>
              갱신까지 최대 1분 소요될 수 있어요
            </div>
          </h2>
          {
            (!isLoading && orderHistories.length > 0) &&
              <span className="order-total-price">
                총 주문 금액: {
                priceComma(
                  orderHistories.reduce((acc, orderHistory) =>
                    acc + orderHistory.totalPrice,
                    0,
                  ),
                )}원
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
                    <div className="order-history-item" key={orderHistory.orderTime.getTime()}>
                      <div className="order-history-item-top">
                        <div className="order-history-item-time">{moment(orderHistory.orderTime).format('YYYY-MM-DD HH:mm')}</div>
                        <div className="order-history-item-total-price">{priceComma(orderHistory.totalPrice)}원</div>
                      </div>
                      <div className="order-history-item-body">
                        {
                          orderHistory.histories.map((history, index) => (
                            <div className="order-history-item-menu menu" key={index}>
                              <div className="menu-top">
                                <span className="menu-name">
                                  {history.name}
                                  {
                                    history.quantity > 1 &&
                                      <span className="menu-times">
                                        *
                                        {history.quantity}
                                      </span>
                                  }
                                </span>
                                <span className="menu-price">{priceComma(history.amount * history.quantity)}원</span>
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
    </Modal>
  );
}

export default OrderHistoryModal;