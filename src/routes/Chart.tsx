import { useQuery } from 'react-query';
import { useOutletContext } from 'react-router-dom';
import styled from 'styled-components';
import { fetchCoinHistory } from '../api';
import ReactApexChart from 'react-apexcharts';
const Div = styled.div``;

interface ChartProps {
  coinId: string;
}

interface IHistory {
  time_open: number;
  time_close: number;
  open: string;
  high: string;
  low: string;
  close: string;
  volume: string;
  market_cap: number;
}

const Chart = () => {
  const { coinId } = useOutletContext<ChartProps>();
  const { isLoading, data } = useQuery<IHistory[]>(['chart', coinId], () =>
    fetchCoinHistory(coinId)
  );

  return (
    <div>
      {isLoading ? (
        'Loading chart'
      ) : (
        <ReactApexChart
          type="line"
          series={[
            {
              name: 'close price',
              data: data?.map((price) => parseFloat(price.close)) ?? [],
            },
          ]}
          options={{
            chart: {
              height: '300px',
              width: 500,
              background: 'transparent',
              toolbar: {
                show: false,
              },
            },
            grid: {
              show: false,
            },
            theme: {
              mode: 'dark',
            },
            stroke: {
              curve: 'smooth',
              width: 3,
            },
            yaxis: {
              show: false,
            },
            xaxis: {
              labels: {
                show: false,
              },
              type: 'datetime',
              categories: data?.map((price) =>
                new Date(price.time_close * 1000).toISOString()
              ),
            },
            fill: {
              type: 'gradient',
              gradient: { gradientToColors: ['blue'], stops: [0, 100] },
            },
            colors: ['red'],
            tooltip: {
              y: {
                formatter: (val) => `$ ${val.toFixed(3)}`,
              },
            },
          }}
        />
      )}
    </div>
  );
};

export default Chart;
