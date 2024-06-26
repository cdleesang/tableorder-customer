import { MenuDetail } from '@cdleesang/tableorder-api-sdk/lib/structures/MenuDetail';
import { faMinus, faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useMemo } from 'react';
import { priceComma } from '../../../../common/utils/price-comma.util';
import { useValidator } from '../hooks/use-validator';
import AddToCartButton from './add-to-cart-button';
import OrderButton from './order-button';
import { SelectedSubOptions } from './types/selected-sub-options.type';

interface QuantityCounterProps {
  quantity: number;
  increaseQuantity: () => void;
  decreaseQuantity: () => void;
}

interface MenuFooterProps extends QuantityCounterProps {
  menu: MenuDetail;
  quantity: number;
  totalPrice: number;
  selectedMainOptionId: number | undefined;
  selectedSubOptionIds: Record<number, number[]>;
  closeModal: () => void;
}

function QuantityCounter(props: QuantityCounterProps) {
  return <div className="menu-quantity">
    <FontAwesomeIcon
      icon={faMinus}
      onClick={props.decreaseQuantity}
    />
    <span className="counter">{props.quantity}</span>
    <FontAwesomeIcon
      icon={faPlus}
      onClick={props.increaseQuantity}
    />
  </div>;
}

function MenuFooter(props: MenuFooterProps) {
  const isValid = useValidator(props.menu, props.selectedMainOptionId, props.selectedSubOptionIds);
  const selectedSubOptions = useMemo<SelectedSubOptions>(() => {
    return Object.keys(props.selectedSubOptionIds).reduce((acc, key) => {
      const groupId = parseInt(key, 10);

      return [
        ...acc,
        ...(
          props.selectedSubOptionIds[groupId].map(optionId => {
            const subOptionGroup = props.menu.subOptionGroups.find(group => group.id === groupId)!;
            const subOption = subOptionGroup.subOptions.find(option => option.id === optionId)!;

            return {
              groupId,
              groupName: subOptionGroup.name,
              optionId,
              optionName: subOption.name,
              optionPrice: subOption.price,
            };
          })
        ),
      ];
    }, [] as SelectedSubOptions);
  }, [props.menu, props.selectedSubOptionIds]);

  return <div className="menu-footer">
    <div className="menu-price">{priceComma(props.totalPrice)}원</div>
    <QuantityCounter {...props} />
    <div className="menu-buttons">
      <AddToCartButton {...props} isValid={isValid} selectedSubOptions={selectedSubOptions} />
      <OrderButton {...props} isValid={isValid} selectedSubOptions={selectedSubOptions} />
    </div>
  </div>;
}

export default MenuFooter;