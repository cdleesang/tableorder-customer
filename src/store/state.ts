import { MenuCategory } from '@cdleesang/tableorder-api-sdk/lib/structures/MenuCategory';
import { atom } from 'recoil';

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

export const menuCategoriesState = atom<MenuCategory[]>({
  key: 'menuCategories',
  default: [],
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

export const isCallStaffModalOpenState = atom<boolean>({
  key: 'isCallStaffModalOpen',
  default: false,
});

export const isSystemSettingsModalOpenState = atom<boolean>({
  key: 'isSystemSettingsModalOpen',
  default: false,
});