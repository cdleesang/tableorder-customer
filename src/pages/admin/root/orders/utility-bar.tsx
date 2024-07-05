import { faSync } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export function UtilityBar<T extends readonly number[]>({
  currentTablesPerLine,
  tablesPerLineOptions,
  clearRecentlyUpdatedTableIds,
  fetchAndSetInterval,
  changeTablesPerLine,

}: {
  currentTablesPerLine: number;
  tablesPerLineOptions: T;
  clearRecentlyUpdatedTableIds: () => void;
  fetchAndSetInterval: () => Promise<void>;
  changeTablesPerLine: (tablesPerLine: T[number]) => void;
}) {
  return <>
    <button
      type='button'
      className='text-sm text-gray-500 cursor-pointer underline my-4 block ml-auto mr-0 hover:text-gray-700'
      onClick={clearRecentlyUpdatedTableIds}
    >
      최근 주문 알림 초기화
    </button>
    <div
      className='flex justify-between items-center'
    >
      <div
        className='flex gap-2 items-center'
        onClick={fetchAndSetInterval}
      >
        <FontAwesomeIcon icon={faSync} className='cursor-pointer' />
        <span>즉시 갱신</span>
      </div>
      <label className='flex gap-2 items-center'>
        <span>라인 당 테이블 수</span>
        <select
          className='border border-gray-300 rounded-md p-1'
          value={currentTablesPerLine}
          onChange={(e) => changeTablesPerLine(parseInt(e.target.value, 10))}
        >
          {tablesPerLineOptions.map((option) => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
      </label>
    </div>
  </>;
}