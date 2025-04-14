/**
 * 股票基本資訊
 */
export interface StockInfo {
  /** 資料日期 */
  date: string;
  /** 股票代號 */
  stock_id: string;
  /** 股票名稱 */
  stock_name: string;
  /** 產業類別 */
  industry_category: string;
  /** 上市櫃類型 */
  type: string;
}
