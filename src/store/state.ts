import { atom } from 'recoil';

export function getEnteredAt() {
  const enteredAtStr = localStorage.getItem('enteredAt');
  if(!enteredAtStr) return null;
  return new Date(parseInt(enteredAtStr, 10));
}

export function setEnteredAt(enteredAt: Date) {
  localStorage.setItem('enteredAt', enteredAt.getTime().toString());
}

export const isIdleState = atom<boolean>({
  key: 'isIdle',
  default: true,
})

export const tableNoKey = 'tableNo';
export const tableNoState = atom<number | undefined>({
  key: tableNoKey,
  default: parseInt(localStorage.getItem(tableNoKey) || '', 10) || undefined,
  effects: [
    ({onSet}) => {
      onSet(newTableNo => {
        localStorage.setItem(tableNoKey, newTableNo ? newTableNo.toString() : '');
      })
    }
  ]
});

export const currentCategoryState = atom<{
  mainCategory: {
    id: number,
    name: string,
  },
  subCategory?: {
    id: number,
    name: string,
  },
} | undefined>({
  key: 'currentCategory',
  default: undefined,
  // {
  //   mainCategory: {
  //     id: -1,
  //     name: '전체',
  //   },
  // },
});

export const openedCategoriesState = atom<{[key: number]: boolean}>({
  key: 'openedCategories',
  default: {},
});

export const cartState = atom<{
  id: number,
  menuId: number,
  menuName: string,
  menuAmount: number,
  // 단품가격 * amount
  menuTotalPrice: number,
  imageUrl: string,
  menuMainOption: {
    id: number,
    name: string,
    price: number,
  },
  menuSubOptions: {
    groupId: number,
    groupName: string,
    optionId: number,
    optionName: string,
    optionPrice: number,
  }[]
}[]>({
  key: 'cart',
  default: [],
});

export const isOrderHistoryModalOpenState = atom<boolean>({
  key: 'isOrderHistoryModalOpen',
  default: false,
});

export const currentViewMenuIdState = atom<number | undefined>({
  key: 'currentViewMenuId',
  default: undefined,
});

export const isCallStaffModalOpenState = atom<boolean>({
  key: 'isCallStaffModalOpen',
  default: false,
});

export const isStaffSettingsModalOpenState = atom<boolean>({
  key: 'isStaffSettingsModalOpen',
  default: false,
});

export const isSystemSettingsModalOpenState = atom<boolean>({
  key: 'isSystemSettingsModalOpen',
  default: false,
});