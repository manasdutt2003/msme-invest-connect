const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, '../data/daily-insights.json');

const SENTIMENTS = ['Bullish', 'Bearish', 'Neutral', 'Volatile'];
const SECTORS = ['Technology', 'Healthcare', 'Finance', 'Energy', 'Consumer Goods', 'Real Estate'];
const GAINERS = ['TechCorp', 'HealthPlus', 'FinBank', 'PowerGrid', 'ShopMart', 'PropDevelop'];

function getRandomItem(array) {
    return array[Math.floor(Math.random() * array.length)];
}

function generateInsights() {
    const today = new Date().toISOString().split('T')[0];

    const insights = {
        lastUpdated: new Date().toISOString(),
        date: today,
        marketSentiment: getRandomItem(SENTIMENTS),
        sectorOfTheDay: getRandomItem(SECTORS),
        topGainer: getRandomItem(GAINERS),
        notes: `Market data automatically updated for ${today}.`
    };

    try {
        fs.writeFileSync(DATA_FILE, JSON.stringify(insights, null, 2));
        console.log('Successfully generated daily insights:', insights);
    } catch (error) {
        console.error('Error writing daily insights:', error);
        process.exit(1);
    }
}

generateInsights();
