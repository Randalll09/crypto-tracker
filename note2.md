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

하지만 이렇게하면 9000개이상의 코인을 불러오기 때문에 100개만 잘라주자. react query의 좋은 점은 데이터를 자동으로 캐싱해둔다는 점이다.
