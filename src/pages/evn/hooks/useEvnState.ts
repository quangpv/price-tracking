import { useMemo, useEffect } from 'react';
import { useQueries, useQuery } from '@tanstack/react-query';
import { evnRepository, toApiDate } from '../../../data/repositories/evnRepository';
import { evnMapper } from '../mapper';
import type { EvnCalculateRequestDTO, EvnDailyTotalDTO, EvnDebtDataDTO } from '../../../data/types';
import type { ICalcResult, IDailyData, IDebtItem, IDashboardStats, IInvoice, ITierBreakdown, ITierConfig } from '../types';

export const EVN_TIERS: ITierConfig[] = [
  { tier: 1, range: '0 - 50 kWh', from: 0, to: 50, price: 1806 },
  { tier: 2, range: '51 - 100 kWh', from: 50, to: 100, price: 1866 },
  { tier: 3, range: '101 - 200 kWh', from: 100, to: 200, price: 2167 },
  { tier: 4, range: '201 - 300 kWh', from: 200, to: 300, price: 2729 },
  { tier: 5, range: '301 - 400 kWh', from: 300, to: 400, price: 3050 },
  { tier: 6, range: 'Từ 401 kWh trở lên', from: 400, to: Infinity, price: 3151 },
];





export function computeCalcResult(kwh: number, vatRate: number): ICalcResult {
  let remaining = kwh || 0;
  let totalBeforeTax = 0;
  const breakdown: ITierBreakdown[] = EVN_TIERS.map((t) => {
    let consumedInThisTier = 0;
    const limit = t.to - t.from;

    if (remaining > 0) {
      if (remaining >= limit) {
        consumedInThisTier = limit;
      } else {
        consumedInThisTier = remaining;
      }
      remaining -= consumedInThisTier;
    }

    const cost = consumedInThisTier * t.price;
    totalBeforeTax += cost;

    return {
      ...t,
      consumedInThisTier,
      cost,
      widthPercent: kwh > 0 ? (consumedInThisTier / kwh) * 100 : 0,
    };
  });

  const tax = totalBeforeTax * (vatRate / 100);
  const totalWithTax = totalBeforeTax + tax;

  return { breakdown, totalBeforeTax, tax, totalWithTax, vatRate };
}

interface UseEvnStateParams {
  customerId: string;
  fromDate: string;
  toDate: string;
  onSessionExpired?: () => void;
}

export function useEvnState({ customerId, fromDate, toDate, onSessionExpired }: UseEvnStateParams) {
  const results = useQueries({
    queries: [
      {
        queryKey: ['evn', 'daily', customerId, fromDate, toDate],
        queryFn: () => evnRepository.getDailyConsumption(customerId, fromDate, toDate),
        staleTime: 1000 * 60 * 2,
      },
      {
        queryKey: ['evn', 'billing', customerId],
        queryFn: () => evnRepository.getBillingHistory(customerId),
        staleTime: 1000 * 60 * 5,
      },
      {
        queryKey: ['evn', 'debt', customerId],
        queryFn: () => evnRepository.checkDebt(customerId),
        staleTime: 1000 * 60 * 5,
      },
    ],
  });

  const [dailyQuery, billingQuery, debtQuery] = results;

  const dailyData = useMemo<IDailyData[]>(() => {
    if (!dailyQuery.data?.data) return [];
    return evnMapper.toDailyData(dailyQuery.data.data.sanluong_tungngay);
  }, [dailyQuery.data]);

  const dailyTotal = useMemo<EvnDailyTotalDTO | null>(() => {
    if (!dailyQuery.data?.data) return null;
    return dailyQuery.data.data.sanluong_tong;
  }, [dailyQuery.data]);

  const calcQuery = useQuery({
    queryKey: ['evn', 'calculate', dailyTotal?.Tong, fromDate, toDate],
    queryFn: async () => {
      const payload: EvnCalculateRequestDTO = {
        KIMUA_CSPK: '0',
        LOAI_DDO: '1',
        SO_HO: 1,
        MA_CAPDAP: '1',
        NGAY_DKY: toApiDate(fromDate),
        NGAY_CKY: toApiDate(toDate),
        NGAY_DGIA: toApiDate(toDate),
        HDG_BBAN_APGIA: [
          { LOAI_BCS: 'KT', TGIAN_BANDIEN: 'KT', MA_NHOMNN: 'SHBT', MA_NGIA: 'A' },
        ],
        GCS_CHISO: [
          { BCS: 'KT', SAN_LUONG: String(dailyTotal!.Tong), LOAI_CHISO: 'DDK' },
        ],
      };
      return evnRepository.calculateBill(payload);
    },
    enabled: !!dailyTotal && dailyTotal.Tong > 0,
    staleTime: 1000 * 60 * 5,
  });

  useEffect(() => {
    const isSessionExpired = [dailyQuery, billingQuery, debtQuery].some(
      q => q.data && typeof q.data === 'object' && 'state' in q.data && q.data.state === 'error',
    );
    if (isSessionExpired) onSessionExpired?.();
  }, [dailyQuery.data, billingQuery.data, debtQuery.data, onSessionExpired]);

  const dailyTitle = useMemo<string>(() => {
    if (!dailyQuery.data?.data) return '';
    return dailyQuery.data.data.tieude;
  }, [dailyQuery.data]);

  const soNgay = useMemo<number>(() => {
    if (!dailyQuery.data?.data) return 0;
    return dailyQuery.data.data.soNgay;
  }, [dailyQuery.data]);

  const invoices = useMemo<IInvoice[]>(() => {
    if (!billingQuery.data?.data) return [];
    return evnMapper.toInvoices(billingQuery.data.data.sanluong_hoadon);
  }, [billingQuery.data]);

  const billingTotal = useMemo(() => {
    if (!billingQuery.data?.data) return null;
    return evnMapper.toBillingTotal(billingQuery.data.data.tong);
  }, [billingQuery.data]);

  const lastInvoice = useMemo<IInvoice | null>(() => {
    if (invoices.length === 0) return null;
    return invoices[invoices.length - 1];
  }, [invoices]);

  const debtStatus = useMemo<EvnDebtDataDTO | null>(() => {
    if (!debtQuery.data) return null;
    return debtQuery.data.data;
  }, [debtQuery.data]);

  const debtItems = useMemo<IDebtItem[]>(() => {
    if (!debtStatus) return [];
    return evnMapper.toDebtItems(debtStatus.info_no);
  }, [debtStatus]);

  const hasDebt = useMemo<boolean>(() => {
    return debtStatus?.isNo === 1;
  }, [debtStatus]);

  const estimatedBillValue = useMemo(() => {
    if (!calcQuery.data?.Data?.HDN_HDON?.[0]?.TONG_TIEN) return 0;
    return calcQuery.data.Data.HDN_HDON[0].TONG_TIEN;
  }, [calcQuery.data]);

  const stats = useMemo<IDashboardStats>(() => {
    const dailyTot = dailyTotal;
    const lastBillAmt = lastInvoice ? parseFloat(lastInvoice.tongTien) : 0;
    const debtAmt = debtItems.reduce((sum, item) => sum + parseFloat(item.tien || '0'), 0);
    return {
      monthConsumption: dailyTot?.Tong ?? 0,
      monthConsumptionLabel: dailyTitle,
      lastBillAmount: lastBillAmt,
      lastBillLabel: lastInvoice ? lastInvoice.name : '',
      estimatedBill: estimatedBillValue,
      hasDebt,
      debtAmount: debtAmt,
      customerId,
    };
  }, [dailyTotal, dailyTitle, lastInvoice, hasDebt, debtItems, customerId, estimatedBillValue]);

  const loading = useMemo(
    () => dailyQuery.isLoading || billingQuery.isLoading || debtQuery.isLoading || calcQuery.isLoading,
    [dailyQuery.isLoading, billingQuery.isLoading, debtQuery.isLoading, calcQuery.isLoading],
  );

  const error = useMemo<string | null>(() => {
    const err = dailyQuery.error || billingQuery.error || debtQuery.error;
    return err ? (err instanceof Error ? err.message : 'Unknown error') : null;
  }, [dailyQuery.error, billingQuery.error, debtQuery.error]);

  return useMemo(
    () => ({
      dailyData,
      dailyTotal,
      dailyTitle,
      soNgay,
      invoices,
      billingTotal,
      debtItems,
      hasDebt,
      stats,
      loading,
      error,
      refetch: () => {
        dailyQuery.refetch();
        billingQuery.refetch();
        debtQuery.refetch();
        calcQuery.refetch();
      },
    }),
    [
      dailyData, dailyTotal, dailyTitle, soNgay,
      invoices, billingTotal,
      debtItems, hasDebt, stats,
      loading, error,
      dailyQuery.refetch, billingQuery.refetch, debtQuery.refetch, calcQuery.refetch,
    ],
  );
}
