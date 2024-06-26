import { faMinus, faPlus, faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { priceComma } from '../../../../common/utils/price-comma.util';
import { animated, useSpring } from '@react-spring/web';
import './index.scss';
import { useEffect } from 'react';

interface CartItemProps {
  id: number;
  imageUrl: string;
  menuName: string;
  menuTotalPrice: number;
  menuMainOption: {
    id: number;
    name: string;
    price: number;
  };
  menuSubOptions: {
    groupId: number;
    groupName: string;
    optionId: number;
    optionName: string;
    optionPrice: number;
  }[];
  menuAmount: number;
  delete: () => void;
  increase: () => void;
  decrease: () => void;
}

function CartItem(props: CartItemProps) {
  const spring = useSpring({
    from: {translateY: '-60%'},
    to: {translateY: '0%'},
    config: {
      friction: 13,
    },
  });

  return (
    <animated.div className="cart-item" style={spring}>
      <div className="item-top">
        <img className="menu-img" src={props.imageUrl} alt="메뉴 사진" />
        <div className="menu-info">
          <div className="menu-name-box">
            <div className="menu-name">{props.menuName}</div>
            <button className="delete-btn" type='button' onClick={props.delete}>
              <FontAwesomeIcon icon={faXmark} />
            </button>
          </div>
          <div className="menu-price">{priceComma(props.menuTotalPrice)}원</div>
        </div>
      </div>
      <div className="item-bottom">
        <div className="item-options">
          {
            [
              {
                groupId: 'main',
                optionId: props.menuMainOption.id,
                optionName: props.menuMainOption.name,
                optionPrice: props.menuMainOption.price,
              },
              ...props.menuSubOptions,
            ].map(option => (
              <div className="option" key={`${option.groupId}_${option.optionId}`}>
                <span className="option-name">{option.optionName}</span>
                <span className="option-price">{priceComma(option.optionPrice)}원</span>
              </div>
            ))
          }
        </div>
        <div className="item-count">
          <div className="minus" onClick={props.decrease}>
            <FontAwesomeIcon icon={faMinus} />
          </div>
          <span className="counter">{props.menuAmount}</span>
          <div className="plus" onClick={props.increase}>
            <FontAwesomeIcon icon={faPlus} />
          </div>
        </div>
      </div>
    </animated.div>
  );
}

export default CartItem;