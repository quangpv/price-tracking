export type EvnTabType = 'daily' | 'billing' | 'debt' | 'calculator';

export interface IDailyData {
  ngay: string;
  ngayFull: string;
  TD: number;
  BT: number;
  CD: number;
  Tong: number;
  sanluongTong: string;
  isChotHoaDon: boolean;
}

export interface IInvoice {
  ky: string;
  thang: string;
  nam: string;
  name: string;
  nameFull: string;
  sanLuong: string;
  soTien: string;
  tienThue: string;
  tongTien: string;
  ngayDky: string;
  ngayCky: string;
  trangThai: number;
}

export interface IDebtItem {
  ky?: string;
  thang?: string;
  nam?: string;
  ngayGiao?: string;
  tien?: string;
}

export interface IDashboardStats {
  monthConsumption: number;
  monthConsumptionLabel: string;
  lastBillAmount: number;
  lastBillLabel: string;
  estimatedBill: number;
  hasDebt: boolean;
  debtAmount: number;
  customerId: string;
}

export interface ITierConfig {
  tier: number;
  range: string;
  from: number;
  to: number;
  price: number;
}

export interface ITierBreakdown extends ITierConfig {
  consumedInThisTier: number;
  cost: number;
  widthPercent: number;
}

export interface ICalcResult {
  breakdown: ITierBreakdown[];
  totalBeforeTax: number;
  tax: number;
  totalWithTax: number;
  vatRate: number;
}
