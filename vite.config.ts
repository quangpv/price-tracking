import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
    plugins: [react(), tailwindcss()],
    server: {
        proxy: {
            '/api/binance': {
                target: 'https://api.binance.com',
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/api\/binance/, ''),
            },
            '/api/yahoo': {
                target: 'https://query1.finance.yahoo.com',
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/api\/yahoo/, ''),
                configure: (proxy) => {
                    proxy.on('proxyReq', (proxyReq) => {
                        proxyReq.setHeader('User-Agent', 'Mozilla/5.0');
                    });
                },
            },
            '/api/evn-calc': {
                target: 'https://calc.evn.com.vn',
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/api\/evn-calc/, ''),
            },
            '/api/evn': {
                target: 'https://www.evnhcmc.vn',
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/api\/evn/, ''),
                configure: (proxy) => {
                    proxy.on('proxyReq', (proxyReq) => {
                        proxyReq.setHeader('Origin', 'https://www.evnhcmc.vn');
                        proxyReq.setHeader('Referer', 'https://www.evnhcmc.vn/');
                        proxyReq.setHeader(
                            'User-Agent',
                            'Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Mobile/15E148 Safari/604.1',
                        );
                    });
                },
            },
        },
    },
})
