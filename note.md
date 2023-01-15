# CRYPTO TRACKER

## 5.0 Setup

지금까지 배운 모든 걸 복습하고, React-Query도 배워보자.
[https://api.coinpaprika.com/](https://api.coinpaprika.com/)의 API를 사용한다.
사이트의 구조는 홈페이지에서는 모든 코인들의 정보를 보여주고, /:id 에선 코인의 상세 정보를 보여주는 식이다.
또한 중첩 라우터의 사용도 알아볼 것이다.

우선 routes 폴더 안에 Coin.tsx, Coins.tsx를 생성해주자.

```JavaScript
function Coin() {
  return <h1>Coin</h1>;
}
export default Coin;


function Coins() {
  return <h1>Coins</h1>;
}
export default Coins;

```

이제 새로운 라우터도 만들어주자. Router.tsx 파일을 생성하자. 강의에서는 router5.4를 사용하지만 나는 최신버전과 createBrowserRouter API를 사용할 것이다.

```JavaScript
import { createBrowserRouter } from 'react-router-dom';
import Coins from './Coins';
import Coin from './Coin';

const router = createBrowserRouter([
  { path: '/', element: <Coins /> },
  {
    path: '/:coinId',
    element: <Coin />,
  },
]);

export default router;


import { RouterProvider } from 'react-router-dom';
import router from './routes/Router';

function App() {
  return (
    <div className="App">
      <RouterProvider router={router} />
    </div>
  );
}

export default App;

```

Coin 컴포넌트에서 coinId를 캐치하고 싶다면 useParams 훅을 사용하면 된다.

```JavaScript
import { useParams } from 'react-router-dom';

function Coin() {
  const { coinId } = useParams<{ coinId: string }>();

  return <h1>Coin: {coinId}</h1>;
}
export default Coin;

```

## 5.1 Styles

styled-reset이라는 패키지를 사용해서 스타일을 리셋할 수 있다. 하지만 styled-component를 통해서도 리셋할 수 있다. createGlobalStyle이라는 API를 사용할수 있다.

```JavaScript
import { RouterProvider } from 'react-router-dom';
import router from './routes/Router';
import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
*{margin: 0; padding: 0;}
li{list-style: none;}
a{color:inherit; text-decoration: none;}
`;

function App() {
  return (
    <div className="App">
      <GlobalStyle />
      <RouterProvider router={router} />
    </div>
  );
}

export default App;

```

이제 구글 폰트에서 폰트를 import하자. GlobalStyle 맨 위에 import 하면 적용된다.

```JavaScript
import { RouterProvider } from 'react-router-dom';
import router from './routes/Router';
import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Source+Sans+Pro:wght@300;400&display=swap');
  *{margin: 0; padding: 0;}
  li{list-style: none;}
  a{color:inherit; text-decoration: none;}
    body{
    font-family: 'Source Sans Pro', sans-serif;
  }
`;

function App() {
  return (
    <div className="App">
      <GlobalStyle />
      <RouterProvider router={router} />
    </div>
  );
}

export default App;

```

이제 theme을 설정해주자.

typescript 파트에서 한것과 같이 styled.d.ts 파일을 만들자.

```JavaScript
import 'styled-components';

declare module 'styled-components' {
  export interface DefaultTheme {
    textColor: string;
    bgColor: string;
    accentColor: string;
  }
}

```

그리고 flat ui colors 라는 사이트에서 색상을 뽑아 선택하자.

```JavaScript
import { DefaultTheme } from 'styled-components';

export const theme: DefaultTheme = {
  bgColor: '#2c3e50',
  textColor: '#ecf0f1',
  accentColor: '#f1c40f',
};

```

이제 ThemeProvider를 index.tsx에 적용하자.

```JavaScript
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ThemeProvider } from 'styled-components';
import { theme } from './theme';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <App />
    </ThemeProvider>
  </React.StrictMode>
);

```

이제 App은 theme에 접근 가능하다. 그러므로 GlobalStyle에도 theme을 적용 가능하다.

```JavaScript
import { RouterProvider } from 'react-router-dom';
import router from './routes/Router';
import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Source+Sans+Pro:wght@300;400&display=swap');
  *{margin: 0; padding: 0;}
  li{list-style: none;}
  a{color:inherit; text-decoration: none;}
  body{
    font-family: 'Source Sans Pro', sans-serif;
    background-color:${(props) => props.theme.bgColor};
    color:${({ theme }) => theme.textColor};
  }
`;

function App() {
  return (
    <>
      <GlobalStyle />
      <RouterProvider router={router} />
    </>
  );
}

export default App;

```

이제 Coins 에 가서 style을 적용해주자.

```JavaScript
import styled from 'styled-components';

const Title = styled.h1`
  color: ${({ theme }) => theme.accentColor};
`;

function Coins() {
  return <Title>Coins</Title>;
}
export default Coins;

```

## 5.2 Home part One

일단 Coins에 styled components를 만들어주자.

```JavaScript
import styled from 'styled-components';

const Container = styled.div``;

const Header = styled.header``;

const CoinList = styled.ul``;

const Coin = styled.li``;

const Title = styled.h1`
  color: ${({ theme }) => theme.accentColor};
`;

function Coins() {
  return (
    <Container>
      <Header>
        <Title>Coins</Title>;
      </Header>
      <CoinList>
        <Coin></Coin>
      </CoinList>
    </Container>
  );
}
export default Coins;

```

그리고 coinPaprika의 API를 기반으로 우리가 코인을 가졌다고 가정해보자.

```JavaScript
const coins = [
  {
    id: 'btc-bitcoin',
    name: 'Bitcoin',
    symbol: 'BTC',
    rank: 1,
    is_new: false,
    is_active: true,
    type: 'coin',
  },
  {
    id: 'eth-ethereum',
    name: 'Ethereum',
    symbol: 'ETH',
    rank: 2,
    is_new: false,
    is_active: true,
    type: 'coin',
  },
  {
    id: 'usdt-tether',
    name: 'Tether',
    symbol: 'USDT',
    rank: 3,
    is_new: false,
    is_active: true,
    type: 'token',
  },
];

function Coins() {
  return (
    <Container>
      <Header>
        <Title>Coins</Title>
      </Header>
      <CoinList>
        {coins.map((coin) => (
          <Coin key={coin.id}>{coin.name}</Coin>
        ))}
      </CoinList>
    </Container>
  );
}
export default Coins;

```

이제 스타일을 조금 적용해보자.

```JavaScript
const Container = styled.div`
  padding: 0px 20px;
`;

const Header = styled.header`
  height: 10vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const CoinList = styled.ul``;

const Coin = styled.li`
  background-color: white;
  color: ${({ theme }) => theme.bgColor};
  margin-bottom: 10px;
  padding: 20px;
  border-radius: 15px;
`;

const Title = styled.h1`
  color: ${({ theme }) => theme.accentColor};
  font-size: 48px;
`;
```

코인 개별을 클릭하면 이동하게 하기 위해 Link도 추가해주자.

```JavaScript
     {coins.map((coin) => (
          <Coin key={coin.id}>
            <Link to={`/${coin.id}`}>{coin.name} &rarr;</Link>
          </Coin>
        ))}
```

스타일도 적용하는데 Link 태그는 a태그로 타게팅 가능하다.

```JavaScript
const Coin = styled.li`
  background-color: white;
  color: ${({ theme }) => theme.bgColor};
  margin-bottom: 10px;
  padding: 20px;
  border-radius: 15px;
  &:hover {
    a {
      color: ${({ theme }) => theme.accentColor};
    }
  }
`;
```

a 태그에 transition을 주고 Link 태그가 li 태그를 꽉채우게 display:block 속성을 준다.

```JavaScript
const Coin = styled.li`
  background-color: white;
  color: ${({ theme }) => theme.bgColor};
  margin-bottom: 10px;
  padding: 20px;
  border-radius: 15px;
  a {
    transition: color 0.2s ease-in;
    display: block;
  }
  &:hover {
    a {
      color: ${({ theme }) => theme.accentColor};
    }
  }
`;
```

## 5.3 Home part Two

이제 API에서 데이터를 가져오자.

타입스크립트에게 데이터의 모양을 설명해야 하니 interface를 만들자.

```JavaScript

interface CoinInterface {
  id: string;
  name: string;
  symbol: string;
  rank: number;
  is_new: boolean;
  is_active: boolean;
  type: string;
}

```

에러가 날 수 있으니 임시 데이터인 coins는 지워주자.

coins state를 만들어주고 interface를 배정하자.

```JavaScript
function Coins() {
  const [coins, setCoins] = useState<CoinInterface[]>([]);
  return (
    <Container>
      <Header>
        <Title>Coins</Title>
      </Header>
      <CoinList>
        {coins.map((coin) => (
          <Coin key={coin.id}>
            <Link to={`/${coin.id}`}>{coin.name} &rarr;</Link>
          </Coin>
        ))}
      </CoinList>
    </Container>
  );
}
export default Coins;

```

더이상 에러가 나지 않는다. 이젠 API를 붙여보자. useEffect를 사용해 component가 시작할때 불러오게 만들자. 참고로 (()=>{})()로 함수를 만들면 불러오지 않아도 바로 함수가 실행된다.

데이터는 코인을 구천개 이상 불러오기 떄문에 100개 정도로 잘라주고 state에 넣어주자.

```JavaScript
  useEffect(() => {
    (async () => {
      const response = await fetch('https://api.coinpaprika.com/v1/coins');
      const json = await response.json();
      setCoins(json.slice(0, 100));
    })();
  }, []);
```

마지막으로 loading state를 만들어보자.

```JavaScript
function Coins() {
  const [coins, setCoins] = useState<CoinInterface[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    (async () => {
      const response = await fetch('https://api.coinpaprika.com/v1/coins');
      const json = await response.json();
      setCoins(json.slice(0, 100));
      setLoading(false);
    })();
  }, []);
  return (
    <Container>
      <Header>
        <Title>Coins</Title>
      </Header>
      {loading ? (
        'loading'
      ) : (
        <CoinList>
          {coins.map((coin) => (
            <Coin key={coin.id}>
              <Link to={`/${coin.id}`}>{coin.name} &rarr;</Link>
            </Coin>
          ))}
        </CoinList>
      )}
    </Container>
  );
}
export default Coins;

```

만약 페이지를 이동했다가 다시 홈으로 돌아오면 state가 지워지기 떄문에 다시 로딩창이 뜬다. 매번 API를 재호출 하는 것이다.

## 5.4 Route States

앞서서 Crypto Icon API를 적용해보자.

[Crypto Icon Api](https://coinicons-api.vercel.app/)

```JavaScript
            <Coin key={coin.id}>
              <Link to={`/${coin.id}`}>
                <img
                  src={`https://coinicons-api.vercel.app/api/icon/${coin.symbol.toLowerCase()}`}
                  alt={coin.name}
                />
                {coin.name} &rarr;
              </Link>
            </Coin>
```

하지만 이미지가 너무 크니 img component 를 만들어주자.

```JavaScript
const Img = styled.img`
  height: 25px;
  width: 25px;
`;

```

이제 Coin.tsx로 넘어가자. 코인의 정보를 APi로 불러오는 작업을 하자. 그전에 Link로 다른 화면에 정보를 보내보자. Coin 개별 페이지로 넘어가면서 유저가 전체 정보의 로딩을 기다리기 보단 일부의 정보라도 볼 수 있는게 UI 적으로 더 좋다.

URL로 정보를 보낼 수도 있지만 state로 보낼수도 있다.

state로 코인의 이름을 보내보자.

```JavaScript
            <Coin key={coin.id}>
              <Link to={`/${coin.id}`} state={coin.name}>
                <Img
                  src={`https://coinicons-api.vercel.app/api/icon/${coin.symbol.toLowerCase()}`}
                  alt={coin.name}
                />
                {coin.name} &rarr;
              </Link>
            </Coin>
```

Coin.tsx로 가자. Container와 Loading 로직을 가져오자. 복붙하고 location으로 state값도 불러오자.

```JavaScript
function Coin() {
  const [loading, setLoading] = useState(true);
  const { coinId } = useParams<{ coinId: string }>();
  const { state } = useLocation();

  console.log(state);

  return (
    <Container>
      <Header>
        <Title>Coins</Title>
      </Header>
      {loading ? <Loading>LOADING</Loading> : null}
    </Container>
  );
}
export default Coin;

```

이렇게하면 useLocation에 오류가 난다. LocationState interface를 생성해주자.

react-router-dom의 v.6부턴 제네릭을 지원하지 않기 떄문에 아래와 같이 사용해 줘야 한다.

```JavaScript

interface LocationState {
  state: string;
}

function Coin() {
  const [loading, setLoading] = useState(true);
  const { coinId } = useParams<{ coinId: string }>();
  const { state } = useLocation() as LocationState;

  console.log(state);

  return (
    <Container>
      <Header>
        <Title>{state}</Title>
      </Header>
      {loading ? <Loading>LOADING</Loading> : null}
    </Container>
  );
}
export default Coin;

```

하지만 이 사이트를 이제 시크릿 창으로 열면 에러가 난다. state를 만들려면 먼저 홈페이지에 있어야 하기 때문이다. 아래와 같이 바꿔주자.

```JavaScript
        <Title>{state ?? 'Loading'}</Title>

```

## 5.5 Coin Data

이제 디테일 페이지를 꾸며주자.

[https://api.coinpaprika.com/v1/coins/btc-bitcoin]

[https://api.coinpaprika.com/v1/tickers/btc-bitcoin]

첫번쨰 API는 코인의 정보를, 두번쨰 API는 코인의 가격을 알려준다.

```JavaScript
  useEffect(() => {
    (async () => {
      const infoData = await (
        await fetch(`https://api.coinpaprika.com/v1/coins/${coinId}`)
      ).json();
      const priceData = await (
        await fetch(`https://api.coinpaprika.com/v1/tickers/${coinId}`)
      ).json();
      console.log(infoData);
      console.log(priceData);
    })();
  }, []);
```

이제 받아온 정보를 state에 넣어주자.

```JavaScript
  const [info, setInfo] = useState({});
  const [priceInfo, setPriceInfo] = useState({});
  const { coinId } = useParams<{ coinId: string }>();
  const { state } = useLocation() as LocationState;

  useEffect(() => {
    (async () => {
      const infoData = await (
        await fetch(`https://api.coinpaprika.com/v1/coins/${coinId}`)
      ).json();
      const priceData = await (
        await fetch(`https://api.coinpaprika.com/v1/tickers/${coinId}`)
      ).json();
      setInfo(infoData);
      setPriceInfo(priceData);
    })();
  }, []);

```

현재 typescript는 info와 priceInfo가 빈 오브젝트라고 인식한다.

아래와 같이 불러오면 typescript 에러가 난다.

```JavaScript
      {loading ? <Loading>LOADING</Loading> : <span>{info.hello}</span>}

```

그러므로 데이터 타입을 설명해줘야한다.

대부분의 상황에선 API 가 타입스크립트에게 자동으로 정보를 전달할수 있다. 일단 자바스크립트를 사용하니 그 방법은 사용하지 않을 것이다.

## 5.6 Data Types

받아온 정보들을 콘솔에 찍은 다음, 둘다 우클릭으로 Store Object as Global Variable을 실행하자.

그럼 object가 temp1 과 temp2 란 variable에 저장된다.

이제 Info와 Price를 위한 인터페이스를 만들자.

console에 Object.Keys(temp1) 을 하면 temp1에 저장된 모든 키값을 불러온다. 콘솔에 아래 명령어를 실행시켜 모든 키를 받아오자.

```JavaScript
Object.keys(temp1).join()
```

string 값을 InfoData interface에 붙여 넣은 뒤 모든 콤마를 선택하자. (콤마를 하나 선택후 컨트롤 D) 콤마를 모두 지운뒤 엔터를 친다. 그리고 모든 줄의 끝을 선택해 아래와 같이 만든다.

```JavaScript
interface InfoData{
  id:;
  name:;
  symbol:;
  rank:;
  is_new:;
  is_active:;
  type:;
  logo:;
  tags:;
  team:;
  description:;
  message:;
  open_source:;
  started_at:;
  development_status:;
  hardware_wallet:;
  proof_type:;
  org_structure:;
  hash_algorithm:;
  links:;
  links_extended:;
  whitepaper:;
  first_data_at:;
  last_data_at:;

}

```

console에 아래의 명령어를 친다.

```JavaScript
Object.values(temp1).map(v=> typeof v).join()
```

위와 같이 모두 한줄씩 분리한뒤에, InfoData의 키끝줄을 모두 선택하고, 붙여넣기를 하면 바로 아래처럼 된다.

```JavaScript
interface InfoData {
  id: string;
  name: string;
  symbol: string;
  rank: number;
  is_new: boolean;
  is_active: boolean;
  type: string;
  logo: string;
  tags: object;
  team: object;
  description: string;
  message: string;
  open_source: boolean;
  started_at: string;
  development_status: string;
  hardware_wallet: boolean;
  proof_type: string;
  org_structure: string;
  hash_algorithm: string;
  links: object;
  links_extended: object;
  whitepaper: object;
  first_data_at: string;
  last_data_at: string;
}
```

하지만 여기서 간단한 문제가 있는데, tags와 team은 object가 아닌, object로 이루어진 array다. Tag의 타입만 변경시켜주자.

```JavaScript
interface Tag {
  coin_counter: number;
  ico_counter: number;
  id: string;
  name: string;
}

interface InfoData {
  id: string;
  name: string;
  symbol: string;
  rank: number;
  is_new: boolean;
  is_active: boolean;
  type: string;
  logo: string;
  tags: Tag[];
  team: object;
  description: string;
  message: string;
  open_source: boolean;
  started_at: string;
  development_status: string;
  hardware_wallet: boolean;
  proof_type: string;
  org_structure: string;
  hash_algorithm: string;
  links: object;
  links_extended: object;
  whitepaper: object;
  first_data_at: string;
  last_data_at: string;
}

```

Infodata interface에서 필요없는 수치들은 지워줘도 된다.

이제 info state에 interface를 할당하자.

```JavaScript
  const [info, setInfo] = useState<InfoData>();

```

이제 priceData에도 같은 작업을 해주자.

```JavaScript
interface PriceData {
  id: string;
  name: string;
  symbol: string;
  rank: number;
  circulating_supply: number;
  total_supply: number;
  max_supply: number;
  beta_value: number;
  first_data_at: string;
  last_updated: string;
   quotes: {
    USD: {
      price: string;
    };
  };
}

  const [priceInfo, setPriceInfo] = useState<PriceData>();

```

## 5.7 Nested Routes part One
