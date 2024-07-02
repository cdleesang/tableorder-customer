import { useState } from 'react';
import { UpdateAccount } from './update-account';
import { ViewPermissions } from './view-permissions';

const MODES = {
  VIEW_PERMISSIONS: '권한 조회',
  UPDATE_ACCOUNT: '계정 수정',
} as const;

export default function MyInfo() {
  const [currentMode, setCurrentMode] = useState<typeof MODES[keyof typeof MODES]>(MODES.VIEW_PERMISSIONS);

  const Content = () => {
    switch(currentMode) {
      case MODES.VIEW_PERMISSIONS:
        return <ViewPermissions />;
      case MODES.UPDATE_ACCOUNT:
        return <UpdateAccount />;
    }
  }

  return (
    <div>
      <h1 className='text-2xl font-semibold'>내 정보 관리</h1>
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
      <Content />
    </div>
  );
}