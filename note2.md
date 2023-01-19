# CRYPTO TRACKER

## 5.9 React Query part One

이번에는 React Query를 배워보자.

react query 덕에 fetch data에 사용한 코드들을 모두 지워도 된다.

[https://react-query-v3.tanstack.com/]로 가서 quick start를 보자. 시키는 대로 index.tsx에 QueryCLient를 생성하자.

```JavaScript
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ThemeProvider } from 'styled-components';
import { theme } from './theme';
import { QueryClient, QueryClientProvider } from 'react-query';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

const queryClient = new QueryClient();

root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <App />
      </ThemeProvider>
    </QueryClientProvider>
  </React.StrictMode>
);

```

Coins.tsx로 가자.

api.ts 파일을 하나 만들자. 그리고 fetcher 함수를 넣어주자. fetcher 함수는 반드시 fetch promise를 return해야한다.

```JavaScript
export async function fetchCoins() {
  return fetch('https://api.coinpaprika.com/v1/coins').then((res) =>
    res.json()
  );
}

```

Coins로 돌아가 블락처리를 해주자.

```JavaScript
  // const [coins, setCoins] = useState<CoinInterface[]>([]);
  // const [loading, setLoading] = useState(true);
  // useEffect(() => {
  //   (async () => {
  //     const response = await fetch('https://api.coinpaprika.com/v1/coins');
  //     const json = await response.json();
  //     setCoins(json.slice(0, 100));
  //     setLoading(false);
  //   })();
  // }, []);
```

이제 useQuery hook을 사용해보자.

useQuery는 두가지 변수가 필요하다. 첫번째는 string으로 이루어진 queryKey, 두번쨰는 fetcher 함수이다.

useQuery가 리턴하는 값은 여러개가 있지만 지금은 isLoading(fetch 중 인지 감별), data(반환된 값)를 사용한다.

```JavaScript
  const {isLoading, data}=useQuery("allCoins", fetchCoins)

```

이제 기존의 coins.map를 data.map로 바꿔주자. 그러면 typescript는 data가 뭔지 모르기 떄문에 에러가난다. 전에 사용한 CoinInterface를 넣어주자.

```JavaScript
function Coins() {
  const { isLoading, data } = useQuery<CoinInterface[]>('allCoins', fetchCoins);
  // const [coins, setCoins] = useState<CoinInterface[]>([]);
  // const [loading, setLoading] = useState(true);
  // useEffect(() => {
  //   (async () => {
  //     const response = await fetch('https://api.coinpaprika.com/v1/coins');
  //     const json = await response.json();
  //     setCoins(json.slice(0, 100));
  //     setLoading(false);
  //   })();
  // }, []);
  return (
    <Container>
      <Header>
        <Title>Coins</Title>
      </Header>
      {isLoading ? (
        <Loading>LOADING</Loading>
      ) : (
        <CoinList>
          {data?.map((coin) => (
            <Coin key={coin.id}>
              <Link to={`/${coin.id}`} state={coin.name}>
                <Img
                  src={`https://coinicons-api.vercel.app/api/icon/${coin.symbol.toLowerCase()}`}
                  alt={coin.name}
                />
                {coin.name} &rarr;
              </Link>
            </Coin>
          ))}
        </CoinList>
      )}
    </Container>
  );
}
export default Coins;

```

하지만 이렇게하면 9000개이상의 코인을 불러오기 때문에 100개만 잘라주자. react query의 좋은 점은 데이터를 자동으로 캐싱해둔다는 점이다. 그래서 매번 메인페이지로 돌아갈때마다 로딩을 보지 않아도 된다.

## 5.10 React Query part Two

이제 Coin screen의 코드를 더 업그레이드 해보자.

React query의 Dev tools에 대해 알아보자. Devtools는 렌더 가능한 컴포넌트이다. Devtools를 사용하면 캐싱된 데이터를 볼수 있다.

index.tsx로 가서 Devtools를 import 해오자.

```JavaScript
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ThemeProvider } from 'styled-components';
import { theme } from './theme';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

const queryClient = new QueryClient();

root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <App />
      </ThemeProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </React.StrictMode>
);
```

이제 웹사이트로 돌아가면 Devtools 컴포넌트가 렌더링 되어있다.

이번에는 Coin.tsx에 react query를 적용해보자.

api.ts에 fetch 함수를 만들어주자.

```JavaScript
const BASE_URL = `https://api.coinpaprika.com/v1`;
export async function fetchCoins() {
  return fetch(`${BASE_URL}/coins`).then((res) => res.json());
}
export async function fetchCoinInfo(coinId: string) {
  return fetch(`${BASE_URL}/coins/${coinId}`).then((res) => res.json());
}

export async function fetchCoinTickers(coinId: string) {
  return fetch(`${BASE_URL}/tickers/${coinId}`).then((res) => res.json());
}

```

그리고 Coin.tsx로 가서 적용시키자. coinId가 특수한 값이므로 key에 coinId를 넣자.

```JavaScript
  const {} = useQuery(`${coinId} `, () => fetchCoinInfo(coinId));
  const {} = useQuery(`${coinId} `, () => fetchCoinTickers(coinId));
```

그런데 둘이 같은 key를 가지고 있다. 그런데 react query는 각 query를 array로 본다. 그러므로 key값을 array로주자. 또한 fetch 함수안의 coinId를 확장값으로 변경시켜주는 느낌표를 뒤에 붙인다.
(참고:[https://stackoverflow.com/questions/54496398/typescript-type-string-undefined-is-not-assignable-to-type-string/54496418])

```JavaScript

  const {} = useQuery(['info', coinId], () => fetchCoinInfo(coinId!));
  const {} = useQuery(['tickers', coinId], () => fetchCoinTickers(coinId!));
```

그리고 중괄호 안에 isLoading을 적어주는데 그러면 둘다 같은 이름이 된다. 그러므로 객체안 값에 이름을 할당해주자.

```JavaScript
  const { isLoading: infoLoading, data: infoData } = useQuery(
    ['info', coinId],
    () => fetchCoinInfo(coinId!)
  );
  const { isLoading: tickersLoading, data: tickersData } = useQuery(
    ['tickers', coinId],
    () => fetchCoinTickers(coinId!)
  );
```

이제 기존 코드를 바꿔주자.

```JavaScript
  const loading = infoLoading || tickersLoading;
.
.
.

            <Overview className="overview">
              <OverviewItem>
                <p>RANK</p>
                <p>{infoData?.rank}</p>
              </OverviewItem>
              <OverviewItem>
                <p>SYMBOL</p>
                <p>{infoData?.symbol}</p>
              </OverviewItem>
              <OverviewItem>
                <p>OPEN SOURCE</p>
                <p>{infoData?.open_source ? 'Yes' : 'No'}</p>
              </OverviewItem>
            </Overview>
            <Overview className="overview">
              <OverviewItem>
                <p>TOTAL SUPPLY</p>
                <p>{tickersData?.total_supply}</p>
              </OverviewItem>
              <OverviewItem>
                <p>MAX SUPPLY</p>
                <p>{tickersData?.max_supply}</p>
              </OverviewItem>
            </Overview>
```

하지만 이제 타입스트립트는 infoData나 tickersData가 뭔지 모른다. Interface를 할당해주자.

```JavaScript
  const { isLoading: infoLoading, data: infoData } = useQuery<InfoData>(
    ['info', coinId],
    () => fetchCoinInfo(coinId!)
  );
  const { isLoading: tickersLoading, data: tickersData } = useQuery<PriceData>(
    ['tickers', coinId],
    () => fetchCoinTickers(coinId!)
  );
```

이제 정보가 query에 저장 되니 loading이 뜨지 않는다.
