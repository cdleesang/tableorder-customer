import { useState } from 'react';
import { SelectedSubOptions } from './types/selected-sub-options.type';
import { useConnection } from '../../../../hooks/use-connection';
import api from '@cdleesang/tableorder-api-sdk';
import { MenuDetail } from '@cdleesang/tableorder-api-sdk/lib/structures/MenuDetail';
import { playNotificationSound } from '../../../../common/utils/play-notification-sound.util';
import { toast } from '../../../../components/toast-container/utils/toast';
import { RingSpinner } from 'react-spinner-overlay';

interface OrderButtonProps {
  menu: MenuDetail;
  quantity: number;
  totalPrice: number;
  isValid: boolean;
  selectedMainOptionId: number | undefined;
  selectedSubOptions: SelectedSubOptions;
  closeModal: () => void;
}

export default function OrderButton(props: OrderButtonProps) {
  const [isOrdering, setIsOrdering] = useState(false);
  const connection = useConnection();
  
  return <button
    className="order-button"
    type="button"
    disabled={isOrdering || !props.isValid}
    onClick={async () => {
      if(props.selectedMainOptionId === undefined || props.selectedSubOptions === undefined) {
        return;
      } 
      
      setIsOrdering(true);

      try {
        await api.functional.order.orderImmediately(connection, {
          menuId: props.menu.id,
          totalPrice: props.totalPrice,
          amount: props.quantity,
          menuMainOptionId: props.selectedMainOptionId,
          menuSubOptions: props.selectedSubOptions.map(option => ({
            optionGroupId: option.groupId,
            optionId: option.optionId,
          })),
        });

        playNotificationSound().catch(() => {});
        toast('success', '주문이 완료되었습니다.');
        setIsOrdering(false);
        props.closeModal();
      } catch(err) {
        localStorage.setItem('order', JSON.stringify(err));
    
        toast('error', '주문에 실패했습니다.');
        setIsOrdering(false);
      }
    }}
  >
    {isOrdering ? <div className="loader"><RingSpinner size={25} /></div> : '주문하기'}
  </button>
}