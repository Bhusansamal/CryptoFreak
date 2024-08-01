import React, { useContext, useEffect, useState } from 'react';
import './Coin.css';
import { useParams } from 'react-router-dom';
import { CoinContext } from '../../Context/CoinContext';
import LineChart from '../../Components/LineChart/LineChart';

const Coin = () => {
  const { coinId } = useParams();
  const [coinData, setCoinData] = useState(null);
  const [historicalData, setHistoricalData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { currency } = useContext(CoinContext);

  const fetchCoinData = async () => {
    try {
      const response = await fetch(`https://api.coingecko.com/api/v3/coins/${coinId}`, {
        method: 'GET',
        headers: { accept: 'application/json', 'x-cg-demo-api-key': 'CG-4wgvQtGgaDj19w4uTZ2P38C6' },
      });
      const data = await response.json();
      setCoinData(data);
    } catch (err) {
      setError('Failed to fetch coin data.');
    }
  };

  const fetchHistoricalData = async () => {
    try {
      const response = await fetch(
        `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=${currency.name}&days=10&interval=daily`,
        {
          method: 'GET',
          headers: { accept: 'application/json', 'x-cg-demo-api-key': 'CG-4wgvQtGgaDj19w4uTZ2P38C6' },
        }
      );
      const data = await response.json();
      setHistoricalData(data);
    } catch (err) {
      setError('Failed to fetch historical data.');
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await fetchCoinData();
      await fetchHistoricalData();
      setLoading(false);
    };
    loadData();
  }, [currency, coinId]);

  if (loading) {
    console.log('Loading state is true'); // Debugging log
    return (
      <div className='spinner'>
        <div className="spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='error'>
        <p>{error}</p>
      </div>
    );
  }

  if (coinData && historicalData) {
    return (
      <div className='coin'>
        <div className="coin-name">
          <img src={coinData.image.large} alt={coinData.name} />
          <p><b>{coinData.name} ({coinData.symbol.toUpperCase()})</b></p>
        </div>
        <div className="coin-chart">
          <LineChart historicalData={historicalData} />
        </div>
        <div className="coin-info">
          <ul>
            <li>Crypto Market Rank</li>
            <li>{coinData.market_cap_rank}</li>
          </ul>
          <ul>
            <li>Current Price</li>
            <li>{currency.symbol} {coinData.market_data.current_price[currency.name]}</li>
          </ul>
          <ul>
            <li>Market Cap</li>
            <li>{currency.symbol} {coinData.market_data.market_cap[currency.name].toLocaleString()}</li>
          </ul>
          <ul>
            <li>24 Hour High</li>
            <li>{currency.symbol} {coinData.market_data.high_24h[currency.name].toLocaleString()}</li>
          </ul>
          <ul>
            <li>24 Hour Low</li>
            <li>{currency.symbol} {coinData.market_data.low_24h[currency.name].toLocaleString()}</li>
          </ul>
        </div>
      </div>
    );
  }

  return null;
};

export default Coin;
