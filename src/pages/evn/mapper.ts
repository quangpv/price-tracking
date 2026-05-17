import type {
  EvnDailyItemDTO,
  EvnDailyTotalDTO,
  EvnInvoiceDTO,
  EvnBillingTotalDTO,
  EvnDebtItemDTO,
  EvnDebtDataDTO,
} from '../../data/types';
import type { IDailyData, IInvoice, IDebtItem, IDashboardStats } from './types';

export const evnMapper = {
  toDailyData(items: EvnDailyItemDTO[]): IDailyData[] {
    return items.map((item) => ({
      ngay: item.ngay,
      ngayFull: item.ngayFull,
      TD: item.TD,
      BT: item.BT,
      CD: item.CD,
      Tong: item.Tong,
      sanluongTong: item.sanluong_tong,
      isChotHoaDon: item.isChotHoaDon === 1,
    }));
  },

  toDailyTotal(dto: EvnDailyTotalDTO): { TD: number; BT: number; CD: number; Tong: number } {
    return {
      TD: dto.TD,
      BT: dto.BT,
      CD: dto.CD,
      Tong: dto.Tong,
    };
  },

  toInvoices(items: EvnInvoiceDTO[]): IInvoice[] {
    return items.map((item) => ({
      ky: item.KY,
      thang: item.THANG,
      nam: item.NAM,
      name: item.NAME,
      nameFull: item.NAME_FULL,
      sanLuong: item.SAN_LUONG,
      soTien: item.SO_TIEN,
      tienThue: item.TIEN_THUE,
      tongTien: item.TONG_TIEN,
      ngayDky: item.NGAY_DKY,
      ngayCky: item.NGAY_CKY,
      trangThai: item.TRANG_THAI,
    }));
  },

  toBillingTotal(dto: EvnBillingTotalDTO) {
    return {
      sanLuongFormat: dto.SAN_LUONG_FORMAT,
      soTien: dto.SO_TIEN,
      tienThue: dto.TIEN_THUE,
      tongTien: dto.TONG_TIEN,
    };
  },

  toDebtItems(items: EvnDebtItemDTO[]): IDebtItem[] {
    return items.map((item) => ({
      ky: item.KY,
      thang: item.THANG,
      nam: item.NAM,
      ngayGiao: item.NGAY_GIAO,
      tien: item.TIEN,
    }));
  },

  toDebtStatus(dto: EvnDebtDataDTO): { hasDebt: boolean; items: IDebtItem[] } {
    return {
      hasDebt: dto.isNo === 1,
      items: this.toDebtItems(dto.info_no),
    };
  },

  toStats(
    dailyTotal: EvnDailyTotalDTO | null,
    billingTotals: EvnBillingTotalDTO | null,
    debtStatus: EvnDebtDataDTO | null,
    customerId: string,
    dailyTitle: string,
  ): IDashboardStats {
    const lastInvoice = billingTotals;
    return {
      monthConsumption: dailyTotal?.Tong ?? 0,
      monthConsumptionLabel: dailyTitle || '',
      lastBillAmount: lastInvoice?.TONG_TIEN ?? 0,
      lastBillLabel: '',
      estimatedBill: 0,
      hasDebt: debtStatus?.isNo === 1,
      debtAmount: debtStatus?.info_no?.reduce((sum, item) => sum + (parseFloat(item.TIEN || '0')), 0) ?? 0,
      customerId,
    };
  },
};
