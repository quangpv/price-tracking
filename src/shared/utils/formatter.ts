export const formatter = {
    price(
        price: number,
        currency: 'usd' | 'vnd',
        isGoldTael: boolean = false,
    ): string {
        if (isGoldTael) {
            const actualVND = price * 1000;
            return new Intl.NumberFormat('vi-VN', {
                style: 'currency',
                currency: 'VND',
                maximumFractionDigits: 0,
            }).format(actualVND);
        }

        if (currency === 'vnd') {
            return new Intl.NumberFormat('vi-VN', {
                style: 'currency',
                currency: 'VND',
                maximumFractionDigits: 0,
            }).format(price);
        }

        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(price);
    },

    percent(value: number): string {
        const sign = value >= 0 ? '+' : '';
        return `${sign}${value.toFixed(2)}%`;
    },

    timestamp(timestamp: number): string {
        return new Date(timestamp * 1000).toLocaleString('vi-VN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
        });
    },
    localDate(timestamp: number) {
        return new Date(timestamp).toISOString().split('T')[0]
    },
    localDateFromString(label: number) {
        const d = new Date(label);
        return d.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        });
    },
    chartAmount(value: number, isGoldTael: boolean) {
        return isGoldTael
            ? `${(value * 1000 / 1000000).toFixed(0)}M`
            : value >= 1000
                ? `${(value / 1000).toFixed(1)}k`
                : value.toFixed(0)
    },
};
