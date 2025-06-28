import React, { useEffect, useRef, useState } from 'react';
import { createChart, IChartApi, CandlestickData, Time } from 'lightweight-charts';

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

interface CandlestickChartProps {
  data: CandleData[];
  height?: number;
  width?: number;
}

export const CandlestickChart: React.FC<CandlestickChartProps> = ({
  data,
  height = 400,
  width
}) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const seriesRef = useRef<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    // Создаем график
    const chart = createChart(chartContainerRef.current, {
      width: width ?? chartContainerRef.current.clientWidth,
      height,
      layout: {
        background: { color: 'transparent' },
        textColor: '#333',
      },
      grid: {
        vertLines: { color: '#e1e5ea' },
        horzLines: { color: '#e1e5ea' },
      },
      crosshair: {
        mode: 1,
      },
      rightPriceScale: {
        borderColor: '#cccccc',
      },
      timeScale: {
        borderColor: '#cccccc',
        timeVisible: true,
        secondsVisible: false,
      },
    });

    // Создаем серию свечей
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const candlestickSeries = (chart as any).addCandlestickSeries({
      upColor: '#4ade80',
      downColor: '#f87171',
      borderDownColor: '#f87171',
      borderUpColor: '#4ade80',
      wickDownColor: '#f87171',
      wickUpColor: '#4ade80',
    });

    chartRef.current = chart;
    seriesRef.current = candlestickSeries;

    // Обработка изменения размера
    const handleResize = () => {
      if (chartContainerRef.current && chart) {
        chart.applyOptions({
          width: width ?? chartContainerRef.current.clientWidth,
        });
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chart.remove();
    };
  }, [height, width]);

  useEffect(() => {
    if (!seriesRef.current || !data.length) {
      setIsLoading(false);
      return;
    }

    try {
      // Преобразуем данные в формат для lightweight-charts
      const chartData: CandlestickData[] = data
        .map((candle) => ({
          time: (candle.open_time / 1000) as Time,
          open: candle.ohlcv.open,
          high: candle.ohlcv.high,
          low: candle.ohlcv.low,
          close: candle.ohlcv.close,
        }))
        .sort((a, b) => (a.time as number) - (b.time as number));

      seriesRef.current.setData(chartData);
      
      // Автомасштабирование
      if (chartRef.current) {
        chartRef.current.timeScale().fitContent();
      }
      
      setIsLoading(false);
    } catch (error) {
      console.error('Ошибка при обработке данных графика:', error);
      setIsLoading(false);
    }
  }, [data]);

  if (isLoading && data.length > 0) {
    return (
      <div 
        className="flex items-center justify-center border rounded-lg bg-gray-50"
        style={{ height, width: width ?? '100%' }}
      >
        <div className="text-gray-500">Загрузка графика...</div>
      </div>
    );
  }

  if (!data.length) {
    return (
      <div 
        className="flex items-center justify-center border rounded-lg bg-gray-50"
        style={{ height, width: width ?? '100%' }}
      >
        <div className="text-gray-500">Нет данных для отображения</div>
      </div>
    );
  }

  return (
    <div className="border rounded-lg overflow-hidden">
      <div ref={chartContainerRef} style={{ height, width: width ?? '100%' }} />
    </div>
  );
};
