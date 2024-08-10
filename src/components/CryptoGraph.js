//Graph
import React, { useState, useEffect, useRef, useCallback } from 'react';
import './components.css'; // Import CSS file for styling
import Chart from 'chart.js/auto'; // Import Chart.js library
import 'chartjs-adapter-date-fns'; // Import date-fns adapter for Chart.js

const CryptoGraph = () => {
    const chartRef = useRef(null); // Reference to the chart canvas element
    const [cryptoData, setCryptoData] = useState([]);
    const [selectedCurrency, setSelectedCurrency] = useState('bitcoin');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [cryptoOptions, setCryptoOptions] = useState([]);

    useEffect(() => {
        const fetchCryptoOptions = async () => {
            try {
                const response = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=40&page=1&sparkline=false');
                const data = await response.json();
                setCryptoOptions(data);
            } catch (error) {
                console.error('Error fetching cryptocurrency options:', error);
            }
        };

        fetchCryptoOptions();
    }, []);

    useEffect(() => {
        const fetchCryptoData = async () => {
            setLoading(true);
            try {
                const response = await fetch(`https://api.coingecko.com/api/v3/coins/${selectedCurrency}/market_chart?vs_currency=usd&days=7&interval=daily`);
                const data = await response.json();
                setCryptoData(data.prices);
                setLoading(false);
                setError(null);
            } catch (error) {
                setLoading(false);
                setError('Error fetching cryptocurrency data. Please try again later.');
            }
        };

        fetchCryptoData();
    }, [selectedCurrency]);

    const chartInstanceRef = useRef(null);

    const renderGraph = useCallback(() => {
        if (chartRef.current && cryptoData.length > 0) {
            const ctx = chartRef.current.getContext('2d');
            const timestamps = cryptoData.map(data => new Date(data[0]));
            const prices = cryptoData.map(data => data[1]);

            if (chartInstanceRef.current) {
                chartInstanceRef.current.destroy();
            }

            chartInstanceRef.current = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: timestamps,
                    datasets: [{
                        label: 'Price (USD)',
                        data: prices,
                        backgroundColor: 'rgba(75, 192, 192, 0.2)',
                        borderColor: 'rgba(75, 192, 192, 1)',
                        borderWidth: 1
                    }]
                },
                options: {
                    scales: {
                        x: {
                            type: 'time',
                            time: {
                                unit: 'day'
                            }
                        },
                        y: {
                            title: {
                                display: true,
                                text: 'Price (USD)'
                            }
                        }
                    }
                }
            });
        }
    }, [cryptoData]);

    useEffect(() => {
        renderGraph();
    }, [renderGraph]);

    const handleCurrencyChange = (e) => {
        setSelectedCurrency(e.target.value);
    };

    return (
        <div className="crypto-graph-container">
            <h1>Cryptocurrency Graph</h1>
            {error && <p className="error-message">{error}</p>}
            <div className="currency-select">
                <label htmlFor="cryptoCurrency">Select Cryptocurrency:</label>
                <select
                    id="cryptoCurrency"
                    value={selectedCurrency}
                    onChange={handleCurrencyChange}
                    disabled={loading}
                >
                    {cryptoOptions.map(crypto => (
                        <option key={crypto.id} value={crypto.id}>{crypto.symbol.toUpperCase()} - {crypto.name}</option>
                    ))}
                </select>
            </div>
            {loading ? (
                <div className="loading-container">
                    <div className="loader"></div>
                    <p className="loading-message">Loading...</p>
                </div>
            ) : (
                <div className="graph">
                    <canvas ref={chartRef}></canvas>
                </div>
            )}
        </div>
    );
}

export default CryptoGraph;
