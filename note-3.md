# CRYPTO TRACKER

## 5.12 Price Chart

Chart.tsx로 가자.

```JavaScript
const Chart = () => {
  return <div>Chart</div>;
};

export default Chart;

```

Chart 컴포넌트에서 정보를 받아오려면 두가지 방법이 있다.

하나는 react-router-dom에서 useParmas를 사용하는 방법이다.

```JavaScript
  const params = useParams();
  console.log(params);
```

하지만 생각해보면 Coin.tsx는 Chart를 렌더링하고 있고, Coin.tsx는 이미 모든 정보를 가지고 있다.

그러므로 또다시 파라미터를 사용해 가져올 필요가 없다.

강의에선 router v.5를 사용하지만 나는 router v.6를 사용해서 작업해 보았다. 버전 6에서는 outlet을 사용하므로 Coin.tsx에서 outlet context로 coinId를 넘겨준다.

```JavaScript
      <Outlet context={{ coinId: coinId }} />

```

그리고 Chart.tsx로 가서는 useOutletContext hook을 사용한다.

```JavaScript
  const data = useOutletContext();
  console.log(data);
```

그럼 coinId 값을 받아온다.

Interface도 달아주자.

```JavaScript
import { useOutletContext, useParams } from 'react-router-dom';

interface ChartProps {
  coinId: string;
}

const Chart = () => {
  const data = useOutletContext<ChartProps>();
  console.log(data);

  return <div>Chart</div>;
};

export default Chart;

```

이제 coinId로 모든 가격을 불러올 수 있다.

강의에서는 coinpaprika API를 사용하지만 이제 유료화가 되어서 아래 API를 사용한다.

https://ohlcv-api.nomadcoders.workers.dev

예시:[https://ohlcv-api.nomadcoders.workers.dev/?coinId=btc-bitcoin]

fetch 함수를 만들어보자. api.ts로 가자.

```JavaScript
export async function fetchCoinHistory(coinId: string) {
  return fetch(
    `https://ohlcv-api.nomadcoders.workers.dev?coinId=${coinId}`
  ).then((res) => res.json());
}

```

다시 Chart.tsx로 넘어와 useQuery를 사용하자.

```JavaScript
  const { isLoading, data } = useQuery(['chart', coinId], () => fetchCoinHistory(coinId));

```

react-query devtools에 들어가 보면 데이터를 확인 할 수 있다.

## 5.13 Price Chart part Two

이제 받아온 데이터를 chart로 시각화 해보자. 우린 APEXCHARTS 라는 라이브러리를 사용할 것이다.

[https://apexcharts.com/](APEXCHARTS)

APEXCHARTS를 npm으로 설치해주자.

[https://apexcharts.com/docs/react-charts/]

npm install --save react-apexcharts apexcharts

차트를 만들기 전에, Chart.tsx에서 data의 인터페이스를 생성해주자.

```JavaScript
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
.
.
.
  const { isLoading, data } = useQuery<IHistory[]>(['chart', coinId], () => fetchCoinHistory(coinId));

```

이제 차트를 생성할 준비가 되었다. APEXCHARTS를 import 하고 로딩을 추가해주자.

```JavaScript
import ReactApexChart from 'react-apexcharts';
.
.
.
  return <div>{isLoading ? 'Loading chart' : <ReactApexChart />}</div>;

```

ReactApexChart 컴포넌트에 속성을 추가해주려하면 자동완성을 사용할 수 있다. 타입과 옵션을 추가해주자. 그리고 series라는 속성에는 우리가 보내고 싶은 데이터를 넣는다. 일단 예시 데이터를 넣자.

```JavaScript
<ReactApexChart
          type="line"
          series={[
            {
              name: 'hello',
              data: [1, 26, 34, 41, 5],
            },
            {
              name: 'bye',
              data: [12, 23, 32, 4, 5],
            },
          ]}
          options={{
            chart: {
              height: 500,
              width: 500,
            },
          }}
        />

```

이제 우리가 받아온 정보를 넣어보자. close 값으로만 이루어진 array를 보내자.

```JavaScript
       <ReactApexChart
          type="line"
          series={[
            {
              name: 'close price',
              data: data?.map((price) => parseFloat(price.close)) ?? [],
              //price.close가 undefined일때를 대비해서 ??연산자 사용
            },
          ]}
          options={{
            chart: {
              height: 500,
              width: 500,
            },
          }}
        />
```

이제 차트를 좀더 꾸며주자.

```JavaScript
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
              height: 300,
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
            },
          }}
        />
```

## 5.14 Price Chart part Three

차트를 좀더 꾸며주고 tootip에 나오는 값이 소숫점 3의 자리까지만 나오게 하자.

```JavaScript
            tooltip: {
              y: {
                formatter: (val) => `$ ${val.toFixed(3)}`,
              },
            },
```

tooltip에 나오는 기본 속성도 변경하자. ReactApexChart의 xaxis의 categories 속성에 array를 할당하면 된다.

```JavaScript
  categories: data?.map((price) => new Date(price.time_close * 1000).toUTCString()),//toISOString()을 사용해도됨
```

최종 차트의 모습은 아래와 같다.

```JavaScript
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
```

## 5.15 Final Touches

데이터를 실시간으로 보는 기분이 들게 해주자.

Coin.tsx에서 Price를 추가하자.

```JavaScript
   <OverviewItem>
     <p>PRICE</p>
     <p>{tickersData?.quotes.USD.price.toFixed(2)}</p>
   </OverviewItem>
```

그리고 react query의 세번째인자로는 option을 넣을 객체를 할당가능하다. refetchInterval속성을 추가하자.

```JavaScript
  const { isLoading: tickersLoading, data: tickersData } = useQuery<PriceData>(
    ['tickers', coinId],
    () => fetchCoinTickers(coinId!),
    { refetchInterval: 5000 }
  );
```

이제 그럼 5초마다 다시 불러온다.

마지막으로 페이지 title을 바꿔주자. react helmet이란 패키지를 사용한다.

[https://www.npmjs.com/package/react-helmet]

npm i react-helmet

npm i --save-dev @types/react-helmet

react helmet의 컴포넌트에 뭔가 추가하면 그게 문서의 head로 간다.

```JavaScript
import {Helmet} from 'react-helmet'
.
.
.
      <Helmet>
        <title>{infoData?.name ?? coinId}</title>
      </Helmet>

```

Helmet은 html의 head 태그 역할을 하기 때문에 css import, favicon등 뭐든지 넣어줄수 있다.
