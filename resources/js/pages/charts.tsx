import React, { useState, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CandlestickChart } from '@/components/CandlestickChart';
import { Loader2, TrendingUp, BarChart3 } from 'lucide-react';
import { type BreadcrumbItem } from '@/types';

interface CandleData {
  id: number;
  open_time: number;
  close_time: number;
  open_time_readable: string;
  close_time_readable: string;
  ohlcv: {
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
  };
  quote_volume: number;
  trades_count: number;
  currency_pair: {
    id: number;
    symbol: string | null;
    base_currency: string | null;
    quote_currency: string | null;
  };
  exchange: {
    id: number;
    name: string;
    display_name: string | null;
  };
  timeframe: {
    id: number;
    interval: string | null;
    name: string;
    minutes: number;
  };
}

interface CurrencyPair {
  id: number;
  symbol: string;
  display_name: string;
  base_currency: string;
  quote_currency: string;
  type: string;
}

interface Exchange {
  id: number;
  name: string;
  code: string;
}

interface TimeFrame {
  id: number;
  name: string;
  minutes: number;
}

interface Statistics {
  total_candles: number;
  earliest_time: string | null;
  latest_time: string | null;
  price_range: {
    min: number;
    max: number;
  };
  total_volume: number;
}

interface StatsResponse {
  currency_pair: string;
  exchange: string;
  timeframe: string;
  statistics: Statistics;
}

export default function Charts() {
  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: 'Графики',
      href: '/charts',
    },
  ];

  const [currencyPairs, setCurrencyPairs] = useState<CurrencyPair[]>([]);
  const [exchanges, setExchanges] = useState<Exchange[]>([]);
  const [timeframes, setTimeframes] = useState<TimeFrame[]>([]);
  
  const [selectedPair, setSelectedPair] = useState<string>('');
  const [selectedExchange, setSelectedExchange] = useState<string>('');
  const [selectedTimeframe, setSelectedTimeframe] = useState<string>('');
  const [fromDate, setFromDate] = useState<string>('');
  const [toDate, setToDate] = useState<string>('');
  const [limit, setLimit] = useState<string>('100');
  
  const [candleData, setCandleData] = useState<CandleData[]>([]);
  const [statistics, setStatistics] = useState<StatsResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingStats, setLoadingStats] = useState(false);
  const [error, setError] = useState<string>('');

  // Загрузка метаданных при монтировании компонента
  useEffect(() => {
    fetchMetadata();
  }, []);

  const fetchMetadata = async () => {
    try {
      const response = await fetch('/api/candles/meta');
      if (!response.ok) throw new Error('Ошибка загрузки метаданных');
      
      const data = await response.json();
      setCurrencyPairs(data.currency_pairs ?? []);
      setExchanges(data.exchanges ?? []);
      setTimeframes(data.timeframes ?? []);
    } catch (err) {
      setError('Не удалось загрузить метаданные');
      console.error('Ошибка загрузки метаданных:', err);
    }
  };

  const fetchCandles = async () => {
    if (!selectedPair || !selectedExchange || !selectedTimeframe) {
      setError('Выберите валютную пару, биржу и таймфрейм');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const params = new URLSearchParams({
        currency_pair: selectedPair,
        exchange: selectedExchange,
        timeframe: selectedTimeframe,
        limit: limit,
      });

      if (fromDate) params.append('from', fromDate);
      if (toDate) params.append('to', toDate);

      const response = await fetch(`/api/candles?${params}`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error ?? 'Ошибка загрузки данных');
      }

      const data = await response.json();
      setCandleData(data.data ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка загрузки свечей');
      console.error('Ошибка загрузки свечей:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchStatistics = async () => {
    if (!selectedPair || !selectedExchange || !selectedTimeframe) {
      setError('Выберите валютную пару, биржу и таймфрейм для получения статистики');
      return;
    }

    setLoadingStats(true);

    try {
      const params = new URLSearchParams({
        currency_pair: selectedPair,
        exchange: selectedExchange,
        timeframe: selectedTimeframe,
      });

      if (fromDate) params.append('from', fromDate);
      if (toDate) params.append('to', toDate);

      const response = await fetch(`/api/candles/stats?${params}`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error ?? 'Ошибка загрузки статистики');
      }

      const data = await response.json();
      setStatistics(data);
    } catch (err) {
      console.error('Ошибка загрузки статистики:', err);
    } finally {
      setLoadingStats(false);
    }
  };

  const formatNumber = (num: number, decimals = 2) => {
    return new Intl.NumberFormat('ru-RU', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(num);
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Н/Д';
    return new Date(dateString).toLocaleString('ru-RU');
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Графики свечей" />
      
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <TrendingUp className="h-8 w-8" />
              Графики свечей
            </h1>
            <p className="mt-2 text-gray-600">
              Анализ торговых данных с интерактивными графиками
            </p>
          </div>

          {/* Панель управления */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Параметры графика
              </CardTitle>
              <CardDescription>
                Выберите торговую пару, биржу и настройки для отображения графика
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                <div>
                  <Label htmlFor="currency-pair">Валютная пара</Label>
                  <Select value={selectedPair} onValueChange={setSelectedPair}>
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите пару" />
                    </SelectTrigger>
                    <SelectContent>
                      {currencyPairs.map((pair) => (
                        <SelectItem key={pair.id} value={pair.symbol}>
                          {pair.display_name} ({pair.symbol})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="exchange">Биржа</Label>
                  <Select value={selectedExchange} onValueChange={setSelectedExchange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите биржу" />
                    </SelectTrigger>
                    <SelectContent>
                      {exchanges.map((exchange) => (
                        <SelectItem key={exchange.id} value={exchange.code}>
                          {exchange.name} ({exchange.code})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="timeframe">Таймфрейм</Label>
                  <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите таймфрейм" />
                    </SelectTrigger>
                    <SelectContent>
                      {timeframes.map((tf) => (
                        <SelectItem key={tf.id} value={tf.name}>
                          {tf.name} ({tf.minutes}м)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="limit">Лимит свечей</Label>
                  <Input
                    id="limit"
                    type="number"
                    value={limit}
                    onChange={(e) => setLimit(e.target.value)}
                    placeholder="100"
                    min="1"
                    max="1000"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <Label htmlFor="from-date">Дата начала</Label>
                  <Input
                    id="from-date"
                    type="datetime-local"
                    value={fromDate}
                    onChange={(e) => setFromDate(e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="to-date">Дата окончания</Label>
                  <Input
                    id="to-date"
                    type="datetime-local"
                    value={toDate}
                    onChange={(e) => setToDate(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <Button onClick={fetchCandles} disabled={loading}>
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Загрузить график
                </Button>
                
                <Button variant="outline" onClick={fetchStatistics} disabled={loadingStats}>
                  {loadingStats && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Статистика
                </Button>
              </div>

              {error && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-red-800 text-sm">{error}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Статистика */}
          {statistics && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Статистика</CardTitle>
                <CardDescription>
                  {statistics.currency_pair} на {statistics.exchange} ({statistics.timeframe})
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {statistics.statistics.total_candles.toLocaleString('ru-RU')}
                    </div>
                    <div className="text-sm text-gray-600">Всего свечей</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      ${formatNumber(statistics.statistics.price_range.max)}
                    </div>
                    <div className="text-sm text-gray-600">Максимальная цена</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-600">
                      ${formatNumber(statistics.statistics.price_range.min)}
                    </div>
                    <div className="text-sm text-gray-600">Минимальная цена</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">
                      {formatNumber(statistics.statistics.total_volume, 0)}
                    </div>
                    <div className="text-sm text-gray-600">Общий объем</div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 pt-4 border-t">
                  <div>
                    <div className="text-sm text-gray-600">Первая свеча</div>
                    <div className="font-medium">{formatDate(statistics.statistics.earliest_time)}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Последняя свеча</div>
                    <div className="font-medium">{formatDate(statistics.statistics.latest_time)}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* График */}
          <Card>
            <CardHeader>
              <CardTitle>График свечей</CardTitle>
              <CardDescription>
                {candleData.length > 0 
                  ? `Отображено ${candleData.length} свечей`
                  : 'Выберите параметры и нажмите "Загрузить график"'
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CandlestickChart data={candleData} height={500} />
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
