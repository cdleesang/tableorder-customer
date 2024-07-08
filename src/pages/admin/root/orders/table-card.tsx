import { GetAllOrderHistoriesResponseDto } from '@cdleesang/tableorder-api-sdk/lib/structures/GetAllOrderHistoriesResponseDto';
import { Table } from './types/table';
import { priceComma } from '../../../../common/utils/price-comma.util';

export function TableCard({table, orderHistory, recentlyUpdated, hide, unhide}: {table: Table, orderHistory: GetAllOrderHistoriesResponseDto['orderHistories'][number] | undefined, recentlyUpdated: boolean, hide?: () => void, unhide?: () => void}) {
  return (
    <div
      key={table.id}
      className='flex flex-col border border-gray-300 rounded-md aspect-square bg-white text-black'
    >
      <div className={`flex justify-between items-center px-2 rounded-t-md bg-point text-white ${recentlyUpdated ? 'animate-pulse' : ''}`}>
        <h2 className={`text-lg font-semibold xl:text-2xl lg:text-xl`}>
          {table.name}
        </h2>
        {hide && (
          <button
            className="underline text-sm lg:text-base xl:text-lg"
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              hide();
            }}
          >테이블 숨기기</button>
        )}
        {unhide && (
          <button
            className="underline text-sm lg:text-base xl:text-lg"
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              unhide();
            }}
          >테이블 보이기</button>
        )}
      </div>
      <div className='flex-1 overflow-y-scroll py-2 overscroll-y-contain p-2'>
        {orderHistory && orderHistory.menus.map((menu, idx) => (
          <div key={idx} className='flex xl:text-2xl lg:text-xl justify-between'>
            <span
              className='truncate flex-1'
            >{menu.name}</span>
            <span
              className='mr-2'
            >{menu.quantity}개</span>
            <span>{priceComma(menu.price * menu.quantity)}원</span>
          </div>
        ))}
      </div>
      {
        orderHistory && (
          <div className='flex justify-between border-t border-gray-300 p-2 mt-2'>
            <span className='font-semibold xl:text-2xl lg:text-xl'>총합</span>
            <span className='font-semibold xl:text-2xl lg:text-xl'>{priceComma(orderHistory.totalPrice)}원</span>
          </div>
        )
      }
    </div>
  );
}