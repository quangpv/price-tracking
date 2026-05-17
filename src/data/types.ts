// DTO Types - Raw API responses

export interface BitcoinDTO {
  id: string;
  symbol: string;
  name: string;
  current_price: number;
  market_cap: number;
  price_change_percentage_24h: number;
}

export interface BitcoinChartDTO {
  prices: [number, number][]; // [timestamp, price]
  market_caps: [number, number][];
  total_volumes: [number, number][];
}

export interface GoldPriceItem {
  name: string;
  buy: number;
  sell: number;
  change_buy: number;
  change_sell: number;
  currency: string;
}

export interface GoldDTOResponse {
  success: boolean;
  timestamp: number;
  time: string;
  date: string;
  prices: Record<string, GoldPriceItem>; // key is type_code
}

export interface ExchangeRateDTO {
  rates: {
    VND: number;
    USD: number;
  };
}

// EVN HCMC Electricity API DTOs

export interface EvnLoginDTO {
  state: string;
  alert: string;
  data: unknown[];
}

export interface EvnDailyItemDTO {
  ngay: string;
  ngayFull: string;
  TD: number;
  BT: number;
  CD: number;
  Tong: number;
  sanluong_TD: string;
  sanluong_BT: string;
  sanluong_CD: string;
  sanluong_tong: string;
  hsn: number;
  p_giao_bt: string;
  p_giao_td: string;
  p_giao_cd: string;
  tong_p_giao: string;
  tong_q_giao: string;
  thoidiemdo: string;
  isChotHoaDon: number;
}

export interface EvnDailyTotalDTO {
  TD: number;
  BT: number;
  CD: number;
  Tong: number;
  TD_format: string;
  BT_format: string;
  CD_format: string;
  Tong_format: string;
}

export interface EvnDailyDataDTO {
  soNgay: number;
  tieude: string;
  sanluong_tungngay: EvnDailyItemDTO[];
  sanluong_tong: EvnDailyTotalDTO;
}

export interface EvnDailyResponseDTO {
  state: string;
  alert: string;
  data: EvnDailyDataDTO;
}

export interface EvnInvoiceDTO {
  KY: string;
  THANG: string;
  NAM: string;
  NAME: string;
  NAME_FULL: string;
  SAN_LUONG: string;
  SO_TIEN: string;
  TIEN_THUE: string;
  TONG_TIEN: string;
  NGAY_DKY: string;
  NGAY_CKY: string;
  TRANG_THAI: number;
  CHISO?: unknown[];
}

export interface EvnBillingTotalDTO {
  SAN_LUONG: number;
  SO_TIEN: number;
  TIEN_THUE: number;
  TONG_TIEN: number;
  SAN_LUONG_FORMAT: string;
}

export interface EvnBillingDataDTO {
  tieude: string;
  sanluong_hoadon: EvnInvoiceDTO[];
  tong: EvnBillingTotalDTO;
}

export interface EvnBillingResponseDTO {
  state: string;
  alert: string;
  data: EvnBillingDataDTO;
}

export interface EvnDebtItemDTO {
  KY?: string;
  THANG?: string;
  NAM?: string;
  NGAY_GIAO?: string;
  TIEN?: string;
}

export interface EvnDebtDataDTO {
  isNo: number;
  info_no: EvnDebtItemDTO[];
}

export interface EvnDebtResponseDTO {
  state: string;
  alert: string;
  data: EvnDebtDataDTO;
}

export interface EvnCalculateRequestDTO {
  KIMUA_CSPK: string;
  LOAI_DDO: string;
  SO_HO: number;
  MA_CAPDAP: string;
  NGAY_DKY: string;
  NGAY_CKY: string;
  NGAY_DGIA: string;
  HDG_BBAN_APGIA: Array<{
    LOAI_BCS: string;
    TGIAN_BANDIEN: string;
    MA_NHOMNN: string;
    MA_NGIA: string;
  }>;
  GCS_CHISO: Array<{
    BCS: string;
    SAN_LUONG: string;
    LOAI_CHISO: string;
  }>;
}

export interface EvnCalculateInvoiceDTO {
  TONG_TIEN: number;
}

export interface EvnCalculateDataDTO {
  HDN_HDON: EvnCalculateInvoiceDTO[];
}

export interface EvnCalculateResponseDTO {
  Data: EvnCalculateDataDTO;
}
