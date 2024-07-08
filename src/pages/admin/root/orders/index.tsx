import api from '@cdleesang/tableorder-api-sdk';
import { GetAllOrderHistoriesResponseDto } from '@cdleesang/tableorder-api-sdk/lib/structures/GetAllOrderHistoriesResponseDto';
import { useEffect, useMemo, useRef, useState } from 'react';
import Modal from '../../../../components/modal';
import { useAdminConnection } from '../../../../hooks/use-admin-connection';
import { LocalStorage } from '../../../../store/local-storage';
import { TableCard } from './table-card';
import { Table } from './types/table';
import { UtilityBar } from './utility-bar';
import { priceComma } from '../../../../common/utils/price-comma.util';

const TABLES_PER_LINE_OPTIONS = [1,2,3,4,5,6,7,8,9,10,11,12] as const;
const FETCH_INTERVAL = 10 * 1000;
const MODES = {
  ALL: '모든 테이블',
  ACTIVE: '활성화된 테이블',
  HIDDEN: '숨긴 테이블',
} as const;

export default function Orders() {
  const [tables, setTables] = useState<Table[]>([]);
  const [tablesPerLine, setTablesPerLine] = useState<typeof TABLES_PER_LINE_OPTIONS[number]>((LocalStorage.tablesPerLine || 4) as typeof TABLES_PER_LINE_OPTIONS[number]);
  const [hiddenTableIds, setHiddenTableIds] = useState<string[]>(LocalStorage.hiddenTableIds || []);
  const [orderHistories, setOrderHistories] = useState<GetAllOrderHistoriesResponseDto['orderHistories']>([]);
  const [totalSalesRevenue, setTotalSalesRevenue] = useState<number>(0);
  const [selectedTableId, setSelectedTableId] = useState<string | null>(null);
  const [recentlyUpdatedTableIds, setRecentlyUpdatedTableIds] = useState<string[]>([]);
  const [currentMode, setCurrentMode] = useState<typeof MODES[keyof typeof MODES]>(MODES.ALL);
  const fetchOrdersRef = useRef<() => Promise<void>>(async () => {});
  const fetchIntervalId = useRef<NodeJS.Timeout | null>(null);
  const totalOutstandingRevenue = useMemo(() => {
    return orderHistories.reduce((acc, orderHistory) => {
      return acc + orderHistory.totalPrice;
    }, 0);
  }, [orderHistories]);
  const connection = useAdminConnection();

  const fetchAndSetInterval = async () => {
    if(fetchIntervalId.current) {
      clearInterval(fetchIntervalId.current);
    }
    
    fetchIntervalId.current = setInterval(() => {
      fetchOrdersRef.current();
    }, FETCH_INTERVAL);

    await fetchOrdersRef.current();
  }

  const fetchOrders = async () => {
    try {
      const {orderHistories: newOrderHistories, totalSalesRevenue: newTotalSalesRevenue} = await api.functional.api.order.history.getAllOrderHistories(connection);

      const updatedTableIds = newOrderHistories.reduce<string[]>((acc, newOrderHistory) => {
        const oldOrderHistory = orderHistories.find(orderHistory => orderHistory.tableId === newOrderHistory.tableId);

        // 해당 테이블의 첫 주문일 경우
        if(!oldOrderHistory) return [...acc, newOrderHistory.tableId];

        const isUpdated = newOrderHistory.menus.some(newMenu => {
          const oldMenu = oldOrderHistory.menus.find(menu => menu.name === newMenu.name);
          
          // 주문된적 없는 메뉴가 추가된 경우
          if(!oldMenu) return true;

          // 주문된 메뉴지만 수량이 증가한 경우(주문 실수로 인해 직원 임의로 감소하는 경우가 많아 해당 경우만 고려)
          if(newMenu.quantity > oldMenu.quantity) return true;

          return false;
        });

        if(isUpdated) return [...acc, newOrderHistory.tableId];

        return acc;
      }, []);

      setRecentlyUpdatedTableIds(prev => Array.from(new Set([...prev, ...updatedTableIds])));

      setOrderHistories(newOrderHistories);
      setTotalSalesRevenue(newTotalSalesRevenue);
    } catch(err) {
      if(err instanceof api.HttpError) {
        if(err.status === 403) {
          alert('주문내역 조회 권한이 없습니다');
        }
      }
    }
  };

  useEffect(() => {
    fetchOrdersRef.current = fetchOrders;
  });

  useEffect(() => {
    api.functional.api.table.viewAllTables(connection).then(res => setTables(res.map(table => ({...table, recentlyUpdated: false}))));

    fetchAndSetInterval().then(() => setRecentlyUpdatedTableIds([]));

    return () => {
      if(fetchIntervalId.current) {
        clearInterval(fetchIntervalId.current);
      }
    };
  }, []);

  useEffect(() => {
    LocalStorage.hiddenTableIds = hiddenTableIds;
  }, [hiddenTableIds]);

  return (
    <div>
      <h1 className='text-2xl font-semibold'>주문내역 확인</h1>
      <div className='text-center p-1 my-2'>
        <div className='inline-flex gap-1 border border-gray-300 rounded-full bg-gray-300 text-white p-0.5'>
          {Object.values(MODES).map(mode => (
            <span
              key={mode}
              className={`rounded-full p-1 px-2 text-sm cursor-pointer font-semibold ${currentMode === mode ? 'bg-gray-400' : 'hover:bg-gray-200'}`}
              onClick={() => setCurrentMode(mode)}
            >{mode}</span>
          ))}
        </div>
      </div>
      <UtilityBar
        currentTablesPerLine={tablesPerLine}
        changeTablesPerLine={(tablesPerLine: typeof TABLES_PER_LINE_OPTIONS[number]) => {
          LocalStorage.tablesPerLine = tablesPerLine;
          setTablesPerLine(tablesPerLine);
        }}
        clearRecentlyUpdatedTableIds={() => setRecentlyUpdatedTableIds([])}
        fetchAndSetInterval={fetchAndSetInterval}
        tablesPerLineOptions={TABLES_PER_LINE_OPTIONS}
      />
      <hr className='my-2' />
      <div className='flex justify-between'>
        <span className='font-semibold'>현재 미결제액: {priceComma(totalOutstandingRevenue)}원</span>
        <span className='font-semibold'>금일 매출액: {priceComma(totalSalesRevenue)}원</span>
      </div>
      <div
        className={`grid gap-1 gap-y-2 my-2`}
        style={{gridTemplateColumns: `repeat(${tablesPerLine}, minmax(0, 1fr)`}}
      >
        {tables.filter(table => {
          if(currentMode === MODES.ALL) return !hiddenTableIds.includes(table.id);
          if(currentMode === MODES.ACTIVE) return orderHistories.some(orderHistory => orderHistory.tableId === table.id) && !hiddenTableIds.includes(table.id);
          if(currentMode === MODES.HIDDEN) return hiddenTableIds.includes(table.id);
          return false;
        }).map(table => {
          const orderHistory = orderHistories.find((orderHistory) => orderHistory.tableId === table.id);

          return <div
            key={table.id}
            onClick={() => {
              setSelectedTableId(table.id);
              setRecentlyUpdatedTableIds(prev => prev.filter(id => id !== table.id));
            }}
          >
            <TableCard
              table={table}
              orderHistory={orderHistory}
              recentlyUpdated={recentlyUpdatedTableIds.includes(table.id)}
              {...(currentMode === MODES.HIDDEN
                ? {unhide: () => {setHiddenTableIds(prev => prev.filter(id => id !== table.id));}}
                : {hide: () => {setHiddenTableIds(prev => [...prev, table.id]);}}
              )}
            />
          </div>
        })}

      </div>
      {
        (() => {
          if(selectedTableId === null) return null;

          const table = tables.find((table) => table.id === selectedTableId)!;
          const orderHistory = orderHistories.find((orderHistory) => orderHistory.tableId === table.id);

          return (
            <Modal
              className='text-white !h-auto max-h-[90vh] min-w-80 !p-0 !rounded-sm'
              close={() => setSelectedTableId(null)}
            >
              <TableCard
                table={table}
                orderHistory={orderHistory}
                recentlyUpdated={false}
              />
            </Modal>
          );
        })()
      }
    </div>
  );
}