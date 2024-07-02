export class LocalStorage {
  static get tableNo(): string | null {
    return localStorage.getItem('tableNo');
  }
  static set tableNo(tableNo: string | null) {
    if(!tableNo) return;
    localStorage.setItem('tableNo', tableNo);
  }

  static get adminRefreshToken(): string | null {
    return localStorage.getItem('adminRefreshToken');
  }
  static set adminRefreshToken(refreshToken: string | null) {
    if(refreshToken === null) {
      localStorage.removeItem('adminRefreshToken');
      return;
    }

    localStorage.setItem('adminRefreshToken', refreshToken);
  }

  static get tablesPerLine(): number | null {
    return parseInt(localStorage.getItem('tablesPerLine') || '', 10);
  }
  static set tablesPerLine(tablesPerLine: number | null) {
    if(tablesPerLine === null) {
      localStorage.removeItem('tablesPerLine');
      return;
    }

    localStorage.setItem('tablesPerLine', tablesPerLine.toString());
  }
  
  static get hiddenTableIds(): string[] {
    return JSON.parse(localStorage.getItem('hiddenTableIds') || '[]');
  }
  static set hiddenTableIds(hiddenTableIds: string[]) {
    localStorage.setItem('hiddenTableIds', JSON.stringify(hiddenTableIds));
  }
}