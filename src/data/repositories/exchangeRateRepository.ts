import axios from 'axios';

export const exchangeRateRepository = {
  async getExchangeRate(): Promise<number> {
    try {
      const { data } = await axios.get('https://api.exchangerate-api.com/v4/latest/USD');
      return data.rates.VND || 24850;
    } catch {
      // Fallback rate if API fails
      return 24850;
    }
  },
};
