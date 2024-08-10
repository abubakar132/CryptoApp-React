// Converter.js
import React, { useState, useEffect } from 'react';
import './components.css'; // Import CSS file for styling
import { debounce } from 'lodash';

const Converter = () => {
    const [baseCurrency, setBaseCurrency] = useState('bitcoin');
    const [amount, setAmount] = useState(1);
    const [exchangeRate, setExchangeRate] = useState(null);
    const [cryptoOptions, setCryptoOptions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCryptoOptions = async () => {
            try {
                const response = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=40&page=1&sparkline=false');
                const data = await response.json();
                setCryptoOptions(data);
            } catch (error) {
                setError('Error fetching cryptocurrency list. Please try again later.');
            }
        };

        fetchCryptoOptions();
    }, []);

    const fetchExchangeRate = async () => {
        setLoading(true);
        try {
            const response = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${baseCurrency}&vs_currencies=usd`);
            const data = await response.json();
            setExchangeRate(data[baseCurrency].usd);
            setLoading(false);
            setError(null);
        } catch (error) {
            setLoading(false);
            setError('Error fetching exchange rate data. Please try again later.');
        }
    };

    useEffect(() => {
        fetchExchangeRate();
    }, [baseCurrency]);

    const debouncedFetchExchangeRate = debounce(fetchExchangeRate, 500);

    const handleBaseCurrencyChange = (e) => {
        setBaseCurrency(e.target.value);
        setAmount(1); // Reset amount to 1 when base currency changes
        debouncedFetchExchangeRate();
    };

    const handleAmountChange = (e) => {
        setAmount(e.target.value);
    };

    return (
        <div className="converter-container">
            <h1>Cryptocurrency to USD Converter</h1>
            {error && <p className="error-message">{error}</p>}
            <div className="converter-form">
                <label htmlFor="amount">Amount:</label>
                <input
                    id="amount"
                    type="number"
                    value={amount}
                    onChange={handleAmountChange}
                    min="0"
                    step="0.01"
                    disabled={loading}
                />
                <label htmlFor="baseCurrency">Cryptocurrency:</label>
                <select
                    id="baseCurrency"
                    value={baseCurrency}
                    onChange={handleBaseCurrencyChange}
                    disabled={loading}
                >
                    {cryptoOptions.map(crypto => (
                        <option key={crypto.id} value={crypto.id}>{crypto.symbol.toUpperCase()} - {crypto.name}</option>
                    ))}
                </select>
                <p>=</p>
                <input
                    type="text"
                    value={exchangeRate ? (amount * exchangeRate).toFixed(6) : ''}
                    disabled
                />
                {loading && <div className="loader"></div>}
            </div>
        </div>
    );
}

export default Converter;