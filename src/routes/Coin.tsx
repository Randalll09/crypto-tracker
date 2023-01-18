import { useState, useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import styled from 'styled-components';

const Container = styled.div`
  padding: 0px 20px;
`;

const Header = styled.header`
  height: 20vh;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 auto;
`;

const Title = styled.h1`
  color: ${({ theme }) => theme.accentColor};
  font-size: 48px;

  font-weight: 900;
`;

const Loading = styled.span`
  color: ${({ theme }) => theme.accentColor};
  font-size: 48px;
  display: block;
  text-align: center;
  font-weight: 600;
  margin-top: 50px;
`;

const Info = styled.div`
  margin: 0 18vw;
  > p {
  }
`;

interface LocationState {
  state: string;
}

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
  description: string;
  message: string;
  open_source: boolean;
  started_at: string;
  development_status: string;
  hardware_wallet: boolean;
  proof_type: string;
  org_structure: string;
  hash_algorithm: string;
  first_data_at: string;
  last_data_at: string;
}

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

function Coin() {
  const [loading, setLoading] = useState(true);
  const [info, setInfo] = useState<InfoData>();
  const [priceInfo, setPriceInfo] = useState<PriceData>();
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
      setLoading(false);
    })();
  }, [coinId]);

  return (
    <Container>
      <Header>
        <Title>{state ?? 'Loading'}</Title>
      </Header>
      {loading ? (
        <Loading>LOADING</Loading>
      ) : (
        <Info>
          <div>
            <ul>
              <li>
                <p>RANK</p>
                <p>{info?.rank}</p>
              </li>
              <li>
                <p>PRICE</p>
                <p>{priceInfo?.quotes.USD.price}</p>
              </li>
              <li>
                <p>SYMBOL</p>
                <p>{info?.symbol}</p>
              </li>
            </ul>
          </div>
          <p>{info?.description}</p>
        </Info>
      )}
    </Container>
  );
}
export default Coin;
