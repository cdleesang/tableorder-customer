import api from '@cdleesang/tableorder-api-sdk';
import { useMemo, useState } from 'react';
import { RingSpinner } from 'react-spinner-overlay';
import { useSetRecoilState } from 'recoil';
import { MenuDetail } from '@cdleesang/tableorder-api-sdk/lib/structures/MenuDetail';
import { useTableConnection } from '../../../../hooks/use-table-connection';
import { toast } from '../../../../components/toast-container/utils/toast';
import { cartState } from '../../../../store/state';
import { SelectedSubOptions } from './types/selected-sub-options.type';

interface AddToCartButtonProps {
  menu: MenuDetail;
  quantity: number;
  totalPrice: number;
  isValid: boolean;
  selectedMainOptionId: number | undefined;
  selectedSubOptions: SelectedSubOptions;
  closeModal: () => void;
}

export default function AddToCartButton(props: AddToCartButtonProps) {
  const [isCartAdding, setIsCartAdding] = useState(false);
  const setCartItems = useSetRecoilState(cartState);
  const selectedMainOption = useMemo(() => {
    return props.menu.mainOptions.find(option => option.id === props.selectedMainOptionId)!;
  }, [props.menu, props.selectedMainOptionId]);
  const connection = useTableConnection();

  const addCartItem = async (menuId: number, quantity: number, totalPrice: number, mainOptionId: number, subOptions: SelectedSubOptions) => {
    const cartItemId = await api.functional.cart.addItem(connection, {
      menuId,
      amount: quantity,
      totalPrice,
      menuMainOptionId: mainOptionId,
      menuSubOptions: subOptions.map(option => ({
        optionGroupId: option.groupId,
        optionId: option.optionId,
      })),
    });

    setCartItems(prev => [
      {
        id: cartItemId,
        menuId: props.menu.id,
        menuName: props.menu.name,
        menuTotalPrice: props.totalPrice,
        imageUrl: props.menu.imageUrl,
        menuAmount: props.quantity,
        menuMainOption: selectedMainOption,
        menuSubOptions: props.selectedSubOptions,
      },
      ...prev,
    ]);
  };

  const onAddToCart = async () => {
    if(props.selectedMainOptionId === undefined || props.selectedSubOptions === undefined) {
      return;
    }

    setIsCartAdding(true);

    try {
      await addCartItem(props.menu.id, props.quantity, props.totalPrice, props.selectedMainOptionId, props.selectedSubOptions);

      setIsCartAdding(false);
      props.closeModal();
    } catch(err) {
      setIsCartAdding(false);
      if(err instanceof api.HttpError && err.status === 409) {
        toast('error', '장바구니에 더 이상 추가할 수 없습니다.');
        return;
      }
      localStorage.setItem('addItem', JSON.stringify(err));
  
      toast('error', '장바구니에 추가하는데 실패했습니다.');
    }
  };
  
  return <button
    className="cart-button"
    type="button"
    disabled={isCartAdding || !props.isValid}
    onClick={onAddToCart}
  >
    {isCartAdding ? <div className="loader"><RingSpinner size={25} /></div> : '장바구니에 추가'}
  </button>;
}