import { faAsterisk } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { priceComma } from '../../../../common/utils/price-comma.util';
import './index.scss';
import { useEffect } from 'react';

interface MenuOptionGroupProps {
  selectedOptionIds: Set<number>;
  setSelectedOptionIds: (optionIds: number[]) => void;
  name: string;
  isRequired: boolean;
  multiSelectOptions?: {
    min: number;
    max: number;
  };
  options: {
    id: number;
    name: string;
    price: number;
    isSoldOut: boolean;
  }[];
}

/**
 * 필수 && 다중선택
 * - 최소 선택 수가 무한대인 경우 선택하지않음
 * - 최소 선택 수가 무한대가 아닌 경우 위에서부터 최소 선택 수만큼 선택
 * 필수 && 단일선택
 * - 옵션이 하나인 경우 첫 번째 옵션을 선택
 * - 옵션이 하나가 아닌 경우 선택하지 않음
 */
function initSelectedOptionIds(menuOptionGroup: MenuOptionGroupProps) {
  if(!menuOptionGroup.isRequired) {
    return;
  }

  if(menuOptionGroup.multiSelectOptions) {
    const isMinInfinite = menuOptionGroup.multiSelectOptions.min === -1;

    if(!isMinInfinite) {
      const selectedOptionIds = new Set(menuOptionGroup.selectedOptionIds);
      const {min} = menuOptionGroup.multiSelectOptions;

      for(let i = 0; i < min; i++) {
        const option = menuOptionGroup.options[i];
        if(option && !option.isSoldOut) {
          selectedOptionIds.add(option.id);
        }
      }

      menuOptionGroup.setSelectedOptionIds(Array.from(selectedOptionIds));
    }

    return;
  }

  if(menuOptionGroup.options.length === 1) {
    const firstOption = menuOptionGroup.options.find(option => !option.isSoldOut);
    if(firstOption) {
      menuOptionGroup.setSelectedOptionIds([firstOption.id]);
    }
  }
}

function MenuOptionGroup(menuOptionGroup: MenuOptionGroupProps) {
  useEffect(() => {
    initSelectedOptionIds(menuOptionGroup);
  }, []);

  return (
    <div className="menu-option-group">
      <span className="group-title">
        {
          menuOptionGroup.isRequired
            && <span className="required-icon"><FontAwesomeIcon icon={faAsterisk} /></span>
        }
        <span className="group-name">{menuOptionGroup.name}</span>
        <span className="group-description">
          {
            menuOptionGroup.multiSelectOptions
              ? `(${menuOptionGroup.multiSelectOptions.min !== -1 ? menuOptionGroup.multiSelectOptions.min : 0}~${menuOptionGroup.multiSelectOptions.max !== -1 ? menuOptionGroup.multiSelectOptions.max : '∞'}개 선택)`
              : ''
          }
        </span>
      </span>
      <div className="menu-options">
        {
          menuOptionGroup.options.map(option => (
            <div key={option.id} className={`menu-option${option.isSoldOut ? ' sold-out' : ''}`} onClick={() => {
              if(option.isSoldOut) {
                return;
              }

              if(menuOptionGroup.multiSelectOptions) {
                const isSelected = menuOptionGroup.selectedOptionIds.has(option.id);
                const selectedOptionIds = new Set(menuOptionGroup.selectedOptionIds);

                if(isSelected) {
                  selectedOptionIds.delete(option.id);
                } else {
                  if(menuOptionGroup.multiSelectOptions.max !== -1 && selectedOptionIds.size >= menuOptionGroup.multiSelectOptions.max) {
                    selectedOptionIds.delete(selectedOptionIds.values().next().value);
                    selectedOptionIds.add(option.id);
                  }

                  selectedOptionIds.add(option.id);
                }

                menuOptionGroup.setSelectedOptionIds(Array.from(selectedOptionIds));
              } else {
                if(!menuOptionGroup.isRequired && menuOptionGroup.selectedOptionIds.has(option.id)) {
                  menuOptionGroup.setSelectedOptionIds([]);
                  return;
                }
                menuOptionGroup.setSelectedOptionIds([option.id]);
              }
            }}>
              <div className={
                `option-button ${
                  menuOptionGroup.multiSelectOptions
                    ? 'checkbox'
                    : 'radio'
                }${
                  menuOptionGroup.selectedOptionIds.has(option.id)
                    ? ' selected'
                    : ''
                }`}
              />
              <div className="option-name">{option.name}</div>
              <div className="option-price">{priceComma(option.price)}원</div>
            </div>
          ))
        }
      </div>
    </div>
  );
}

export default MenuOptionGroup;