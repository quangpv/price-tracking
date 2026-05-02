import { useState } from 'react';
import { useCurrency } from './shared/hooks/useCurrency';
import { Sidebar } from './components/Sidebar/Sidebar';
import { DashboardLayout } from './components/Layout/DashboardLayout';
import { CoinPage } from './pages/coin/CoinPage';
import { GoldPage } from './pages/gold/GoldPage';

type TabType = 'coin' | 'gold';

function App() {
  const { currency, setCurrency, exchangeRate } = useCurrency();
  const [activeTab, setActiveTab] = useState<TabType>('coin');

  return (
    <div className="flex min-h-screen bg-gray-50/50 dark:bg-slate-900 overflow-x-hidden">
      <Sidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        currency={currency}
        onCurrencyChange={setCurrency}
        exchangeRate={exchangeRate}
      />

      {/* Main content with left margin for sidebar */}
      <main className="flex-1 md:ml-64 min-h-screen w-full md:w-0 overflow-x-hidden">
        {/* Spacer for mobile header */}
        <div className="h-14 md:h-0" />
        <DashboardLayout>
          {activeTab === 'coin' && <CoinPage currency={currency} />}
          {activeTab === 'gold' && <GoldPage currency={currency} />}
        </DashboardLayout>
      </main>
    </div>
  );
}

export default App;
