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
}