// Home
import React, { useState, useEffect, useCallback } from 'react';
import './components.css'; // Import CSS file for styling
import { CircularProgress } from '@material-ui/core'; // Import CircularProgress from Material-UI

const Dashboard = () => {
    const [cryptos, setCryptos] = useState([]);
    const [loading, setLoading] = useState(true); // State to track loading status
    const [alerts, setAlerts] = useState([]); // State to track user alerts
    const [notification, setNotification] = useState(''); // State to show notifications

    const API_KEY = 'a7e63941340d34e28b46a534c1784393e92062df6e0f2f4f513f974982da8655';
    const API_URL = `https://min-api.cryptocompare.com/data/top/mktcapfull?limit=40&tsym=USD&api_key=${API_KEY}`;

    const checkAlerts = useCallback((cryptoData) => {
        alerts.forEach(alert => {
            const crypto = cryptoData.find(c => c.id === alert.id);
            if (crypto && ((alert.type === 'above' && crypto.price > alert.price) || (alert.type === 'below' && crypto.price < alert.price))) {
                setNotification(`Alert: ${crypto.name} has ${alert.type} ${alert.price}`);
            }
        });
    }, [alerts]);

    const fetchData = useCallback(async () => {
        try {
            const response = await fetch(API_URL);
            const data = await response.json();
            const cryptoData = data.Data.map((crypto) => ({
                id: crypto.CoinInfo.Id,
                name: crypto.CoinInfo.FullName,
                price: parseFloat(crypto.RAW.USD.PRICE.toFixed(2)),
                change: parseFloat(crypto.RAW.USD.CHANGEPCT24HOUR.toFixed(2)),
            }));
            setCryptos(cryptoData);
            setLoading(false); // Set loading to false when data is fetched
            checkAlerts(cryptoData); // Check alerts with the new data
        } catch (error) {
            console.error('Error fetching cryptocurrency data:', error);
            setLoading(false); // Set loading to false in case of error
        }
    }, [API_URL, checkAlerts]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleSetAlert = (id, price, type) => {
        setAlerts([...alerts, { id, price: parseFloat(price), type }]);
        const cryptoName = cryptos.find(c => c.id === id).name;
        setNotification(`Alert set successfully! You will be notified when ${cryptoName} is ${type} ${price}.`);
    };

    return (
        <div className="dashboard">
            {loading ? (
                <div className="loading-container">
                    <CircularProgress />
                </div>
            ) : (
                <div>
                    <div className="alert-form">
                        <h2>Set Price Alert</h2>
                        <select id="crypto-select" className="alert-input">
                            {cryptos.map(crypto => (
                                <option key={crypto.id} value={crypto.id}>{crypto.name}</option>
                            ))}
                        </select>
                        <input type="number" id="alert-price" className="alert-input" placeholder="Enter price" />
                        <select id="alert-type" className="alert-input">
                            <option value="above">Above</option>
                            <option value="below">Below</option>
                        </select>
                        <button className="alert-button" onClick={() => {
                            const id = document.getElementById('crypto-select').value;
                            const price = document.getElementById('alert-price').value;
                            const type = document.getElementById('alert-type').value;
                            handleSetAlert(id, price, type);
                        }}>Set Alert</button>
                    </div>

                    {notification && (
                        <div className="notification">
                            {notification}
                        </div>
                    )}

                    <div className="coin-grid">
                        {cryptos.map(crypto => (
                            <div key={crypto.id} className="coin-card">
                                <h2 className="coin-name">{crypto.name}</h2>
                                <div className="coin-details">
                                    <p className="coin-price">${crypto.price.toFixed(2)}</p>
                                    <p className={`coin-change ${crypto.change >= 0 ? 'positive' : 'negative'}`}>
                                        {crypto.change.toFixed(2)}%
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
