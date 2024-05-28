import { Kitchen } from './kitchen';

describe('Kitchen', () => {
  describe('status', () => {
    it('현재 시간이 12:00~주방마감시간 사이인 경우 open', () => {
      // 00시 이전
      jest.useFakeTimers().setSystemTime(new Date('2024-06-09 12:00:00'));
      const resultBefore00 = Kitchen.status;
      // 00시 이후 && 일요일
      jest.useFakeTimers().setSystemTime(new Date('2024-06-10 00:59:59'));
      const resultAfter00Sun = Kitchen.status;
      // 00시 이후 && !일요일
      jest.useFakeTimers().setSystemTime(new Date('2024-06-15 01:29:59'));
      const resultAfter00NSun = Kitchen.status;

      expect(resultBefore00).toBe('open');
      expect(resultAfter00Sun).toBe('open');
      expect(resultAfter00NSun).toBe('open');
    });

    it('현재 시간이 주방마감예정시간~주방마감시간 사이인 경우 closing', () => {
      // 일요일
      jest.useFakeTimers().setSystemTime(new Date('2024-06-10 01:00:00'));
      const resultSun = Kitchen.status;
      // !일요일
      jest.useFakeTimers().setSystemTime(new Date('2024-06-15 01:30:00'));
      const resultNSun = Kitchen.status;

      expect(resultSun).toBe('closing');
      expect(resultNSun).toBe('closing');
    });

    it('현재 시간이 12:00~주방마감시간 사이가 아닌 경우 closed', () => {
      // 00시 이전 && 일요일
      jest.useFakeTimers().setSystemTime(new Date('2024-06-09 11:59:59'));
      const resultBefore00 = Kitchen.status;
      // 00시 이후 && 일요일
      jest.useFakeTimers().setSystemTime(new Date('2024-06-10 01:30:00'));
      const resultAfter00Sun = Kitchen.status;
      // 00시 이후 && !일요일
      jest.useFakeTimers().setSystemTime(new Date('2024-06-15 02:00:00'));
      const resultAfter00NSun = Kitchen.status;

      expect(resultBefore00).toBe('closed');
      expect(resultAfter00Sun).toBe('closed');
      expect(resultAfter00NSun).toBe('closed');
    });
  });

  describe('today', () => {
    it('현재 시간이 2024년 6월 9일 12:00:00일 경우 2024년 6월 9일 반환', () => {
      jest.useFakeTimers().setSystemTime(new Date('2024-06-09 12:00:00'));
      const result = Kitchen.today;

      expect(result).toEqual({year: 2024, month: 6, date: 9, day: 0});
    });

    it('현재 시간이 2024년 6월 10일 11:59:59일 경우 2024년 6월 9일 반환', () => {
      jest.useFakeTimers().setSystemTime(new Date('2024-06-10 11:59:59'));
      const result = Kitchen.today;

      expect(result).toEqual({year: 2024, month: 6, date: 9, day: 0});
    });
  });
});