import { useState, useEffect } from 'react';
import { useQuery } from 'react-query';
import {
  Link,
  Outlet,
  useLocation,
  useMatch,
  useParams,
} from 'react-router-dom';
import styled from 'styled-components';
import { fetchCoinInfo, fetchCoinTickers } from '../api';

const Container = styled.div`
  padding: 0px 20px;
  margin: 0 12vw;
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
  display: grid;
  gap: 2vw;
  grid-template-columns: 10vw 10vw 52vw;
`;

const Description = styled.p`
  font: 400 16px/2 'Sofia Sans', sans-serif;
`;

const Overview = styled.ul`
  background-color: ${({ theme }) => theme.tabColor};
  border-radius: 8px;
  padding: 24px;
  gap: 24px;
  width: 10vw;
  display: flex;
  gap: 32px;
  flex-direction: column;
`;

const OverviewItem = styled.li`
  color: ${({ theme }) => theme.textColor};
  text-align: center;
  > p {
    &:nth-of-type(1) {
      font-size: 20px;
      font-weight: 700;
      margin-bottom: 14px;
    }
    &:nth-of-type(2) {
      font-size: 16px;
      font-weight: 500;
    }
  }
`;

const Tab = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-around;
  margin-top: 32px;
`;

const TabEl = styled.p<{ isActive?: boolean }>`
  > a {
    color: ${(props) =>
      props.isActive ? props.theme.accentColor : props.theme.textColor};
    display: block;
    width: 300px;
    font: 700 24px/2 ${({ theme }) => theme.defaultFont};
    background-color: ${({ theme }) => theme.tabColor};
    text-align: center;
    border-radius: 8px;
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
  // const [loading, setLoading] = useState(true);
  // const [info, setInfo] = useState<InfoData>();
  // const [priceInfo, setPriceInfo] = useState<PriceData>();
  const { coinId } = useParams<{ coinId: string }>();
  const { state } = useLocation() as LocationState;
  const priceMatch = useMatch('/:coinId/price');
  const chartMatch = useMatch('/:coinId/chart');
  // useEffect(() => {
  //   (async () => {
  //     const infoData = await (
  //       await fetch(`https://api.coinpaprika.com/v1/coins/${coinId}`)
  //     ).json();
  //     const priceData = await (
  //       await fetch(`https://api.coinpaprika.com/v1/tickers/${coinId}`)
  //     ).json();
  //     setInfo(infoData);
  //     setPriceInfo(priceData);
  //     setLoading(false);
  //   })();
  // }, [coinId]);

  const {} = useQuery(['info', coinId], () => fetchCoinInfo(coinId!));
  const {} = useQuery(['tickers', coinId], () => fetchCoinTickers(coinId!));

  return (
    <Container>
      <Header>
        <Title>{state ? state : loading ? 'Loading' : info?.name}</Title>
      </Header>
      {loading ? (
        <Loading>LOADING</Loading>
      ) : (
        <>
          <Info>
            <Overview className="overview">
              <OverviewItem>
                <p>RANK</p>
                <p>{info?.rank}</p>
              </OverviewItem>
              <OverviewItem>
                <p>SYMBOL</p>
                <p>{info?.symbol}</p>
              </OverviewItem>
              <OverviewItem>
                <p>OPEN SOURCE</p>
                <p>{info?.open_source ? 'Yes' : 'No'}</p>
              </OverviewItem>
            </Overview>
            <Overview className="overview">
              <OverviewItem>
                <p>TOTAL SUPPLY</p>
                <p>{priceInfo?.total_supply}</p>
              </OverviewItem>
              <OverviewItem>
                <p>MAX SUPPLY</p>
                <p>{priceInfo?.max_supply}</p>
              </OverviewItem>
            </Overview>
            <Description className="description">
              {info?.description}
            </Description>
          </Info>
          <Tab>
            <TabEl isActive={priceMatch != null}>
              <Link to={`/${coinId}/price`}>Price</Link>
            </TabEl>
            <TabEl isActive={chartMatch != null}>
              <Link to={`/${coinId}/chart`}>Chart</Link>
            </TabEl>
          </Tab>
        </>
      )}
      <Outlet />
    </Container>
  );
}
export default Coin;
