import axios from 'axios';
import type {
    EvnBillingResponseDTO,
    EvnCalculateRequestDTO,
    EvnCalculateResponseDTO,
    EvnDailyResponseDTO,
    EvnDebtResponseDTO,
    EvnLoginDTO,
} from '../types';

const EVN_BASE = import.meta.env.DEV ? '/api/evn' : 'https://www.evnhcmc.vn';
const EVN_CALC_BASE = import.meta.env.DEV ? '/api/evn-calc' : 'https://calc.evn.com.vn';

const EVN_HEADERS = {
    Accept: 'application/json, text/javascript, */*; q=0.01',
    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
    'X-Requested-With': 'XMLHttpRequest',
};

export function toApiDate(dateStr: string): string {
    const [y, m, d] = dateStr.split('-');
    return `${d}/${m}/${y}`;
}

export const evnRepository = {
    async login(phone: string, password: string): Promise<EvnLoginDTO> {
        const body = `u=${encodeURIComponent(phone)}&p=${encodeURIComponent(password)}&remember=1&token=`;
        const {data} = await axios.post(`${EVN_BASE}/Dangnhap/checkLG`, body, {
            headers: EVN_HEADERS,
            withCredentials: true,
        });
        return data;
    },

    async checkSession(): Promise<EvnLoginDTO> {
        const {data} = await axios.post(
            `${EVN_BASE}/Dangnhap/checkLG`,
            'u=&p=&remember=1&token=',
            {headers: EVN_HEADERS, withCredentials: true},
        );
        return data;
    },

    async getDailyConsumption(
        customerId: string,
        fromDate: string,
        toDate: string,
    ): Promise<EvnDailyResponseDTO> {
        const body = `token=&input_makh=${customerId}&input_tungay=${toApiDate(fromDate)}&input_denngay=${toApiDate(toDate)}`;
        const {data} = await axios.post(
            `${EVN_BASE}/Tracuu/ajax_dienNangTieuThuTheoNgay`,
            body,
            {headers: EVN_HEADERS},
        );
        return data;
    },

    async getBillingHistory(customerId: string): Promise<EvnBillingResponseDTO> {
        const body = `token=&input_makh=${customerId}`;
        const {data} = await axios.post(
            `${EVN_BASE}/Tracuu/ajax_dienNangTieuThuTheoKyHoaDon`,
            body,
            {headers: EVN_HEADERS},
        );
        return data;
    },

    async checkDebt(customerId: string): Promise<EvnDebtResponseDTO> {
        const body = `input_makh=${customerId}`;
        const {data} = await axios.post(
            `${EVN_BASE}/Tracuu/kiemTraNo`,
            body,
            {headers: EVN_HEADERS},
        );
        return data;
    },

    async logout(): Promise<void> {
        await axios.post(`${EVN_BASE}/Dangnhap/logout`, '', {
            headers: EVN_HEADERS,
            withCredentials: true,
        });
    },

    async calculateBill(payload: EvnCalculateRequestDTO): Promise<EvnCalculateResponseDTO> {
        const response = await axios.post(
            `${EVN_CALC_BASE}/TinhHoaDon/api/Calculate`,
            payload,
        );
        return response.data;
    },
};
