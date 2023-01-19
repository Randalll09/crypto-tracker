import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { useQuery } from 'react-query';
import { fetchCoins } from '../api';
import { Helmet } from 'react-helmet';
import { useSetRecoilState } from 'recoil';
import { isDarkAtom } from '../atoms';

const Container = styled.div`
  padding: 0px 20px;
`;

const Header = styled.header`
  height: 10vh;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 auto;
`;

const CoinList = styled.ul``;

const Coin = styled.li`
  background-color: white;
  color: ${({ theme }) => theme.bgColor};
  margin-bottom: 10px;
  border-radius: 15px;
  a {
    padding: 20px;
    transition: color 0.2s ease-in;
    display: flex;
    align-items: center;
  }
  &:hover {
    a {
      color: ${({ theme }) => theme.accentColor};
    }
  }
`;

const Title = styled.h1`
  color: ${({ theme }) => theme.accentColor};
  font-size: 48px;
`;

const Loading = styled.span`
  color: ${({ theme }) => theme.accentColor};
  font-size: 48px;
  display: block;
  text-align: center;
  font-weight: 600;
  margin-top: 50px;
`;

const Img = styled.img`
  height: 25px;
  width: 25px;
  margin-right: 10px;
`;

interface CoinInterface {
  id: string;
  name: string;
  symbol: string;
  rank: number;
  is_new: boolean;
  is_active: boolean;
  type: string;
}

function Coins() {
  const { isLoading, data } = useQuery<CoinInterface[]>('allCoins', fetchCoins);
  const setDarkAtom = useSetRecoilState(isDarkAtom);
  return (
    <Container>
      <Helmet>
        <title>코인</title>
      </Helmet>
      <Header>
        <Title>Coins</Title>
        <button onClick={() => setDarkAtom((prev) => !prev)}>
          Toggle Dark Mode
        </button>
      </Header>
      {isLoading ? (
        <Loading>LOADING</Loading>
      ) : (
        <CoinList>
          {data?.slice(0, 100).map((coin) => (
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
