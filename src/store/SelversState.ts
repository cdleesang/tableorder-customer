// import { atom } from 'recoil';
// import { SelversConfigStorage } from './SelversConfigStorage';

// export const selversState = atom<{
//   loginId?: string,
//   loginPw?: string,
//   storeId?: number,
//   storeTableId?: number,
//   memberId?: number,
//   storeMemberId?: number,
// }>({
//   key: 'selversState',
//   default: {
//     loginId: SelversConfigStorage.getInstance().getLoginId(),
//     loginPw: SelversConfigStorage.getInstance().getLoginPw(),
//     storeId: SelversConfigStorage.getInstance().getStoreId(),
//     storeTableId: SelversConfigStorage.getInstance().getStoreTableId(),
//     memberId: SelversConfigStorage.getInstance().getMemberId(),
//     storeMemberId: SelversConfigStorage.getInstance().getStoreMemberId(),
//   },
//   effects: [
//     ({ onSet }) => {
//       onSet(newValue => {
//         SelversConfigStorage.getInstance().setLoginId(newValue.loginId);
//         SelversConfigStorage.getInstance().setLoginPw(newValue.loginPw);
//         SelversConfigStorage.getInstance().setStoreId(newValue.storeId);
//         SelversConfigStorage.getInstance().setStoreTableId(newValue.storeTableId);
//         SelversConfigStorage.getInstance().setMemberId(newValue.memberId);
//         SelversConfigStorage.getInstance().setStoreMemberId(newValue.storeMemberId);
//       });
//     }
//   ]
// })
export {}