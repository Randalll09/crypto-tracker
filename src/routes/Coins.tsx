import styled from 'styled-components';
import { Link } from 'react-router-dom';

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
    display: block;
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
          <Coin key={coin.id}>
            <Link to={`/${coin.id}`}>{coin.name} &rarr;</Link>
          </Coin>
        ))}
      </CoinList>
    </Container>
  );
}
export default Coins;
