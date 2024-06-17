import { MenuDetail } from '@cdleesang/tableorder-api-sdk/lib/structures/MenuDetail';
import { useMemo } from 'react';

export function useValidator(menu?: MenuDetail, selectedMainOptionId?: number, selectedSubOptionIds?: Record<number, number[]>) {
  const isValid = useMemo(() => {
    if(!menu) {
      // 초기화 중인 경우
      return false;
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
  }, [menu, selectedMainOptionId, selectedSubOptionIds]);

  return isValid;
}