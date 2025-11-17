import { auth, db } from './firebase-config.js';
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { doc, getDoc, updateDoc, runTransaction } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// OCBC-endorsed funds with realistic data mapped to real market ETFs/indices
const FUNDS = [
    {
        id: 'lion-global',
        name: 'Lion Global Singapore Trust Fund',
        description: 'Invests primarily in Singapore equities with long-term capital appreciation focus.',
        ticker: 'EWS', // iShares MSCI Singapore ETF
        currentPrice: 2.85,
        yearReturn: 8.5,
        risk: 'Medium',
        category: 'Singapore Equity'
    },
    {
        id: 'nikko-asia',
        name: 'Nikko AM Shenton Asia Dividend Equity Fund',
        description: 'Focuses on dividend-paying stocks across Asia Pacific region.',
        ticker: 'AAXJ', // iShares MSCI All Country Asia ex Japan ETF
        currentPrice: 1.92,
        yearReturn: 12.3,
        risk: 'Medium-High',
        category: 'Asia Pacific Equity'
    },
    {
        id: 'abf-singapore',
        name: 'ABF Singapore Bond Index Fund',
        description: 'Invests in Singapore government and quasi-government bonds.',
        ticker: 'AGG', // iShares Core US Aggregate Bond ETF (proxy)
        currentPrice: 1.15,
        yearReturn: 3.2,
        risk: 'Low',
        category: 'Singapore Bonds'
    },
    {
        id: 'schroder-asian',
        name: 'Schroder Asian Growth Fund',
        description: 'Invests in growth companies across Asia excluding Japan.',
        ticker: 'ASHR', // Xtrackers Harvest CSI 300 China A-Shares ETF
        currentPrice: 3.45,
        yearReturn: 15.7,
        risk: 'High',
        category: 'Asia Pacific Equity'
    },
    {
        id: 'fsm-global',
        name: 'FSM Global Opportunities Fund',
        description: 'Diversified global equity fund investing across developed markets.',
        ticker: 'VT', // Vanguard Total World Stock ETF
        currentPrice: 2.12,
        yearReturn: 10.4,
        risk: 'Medium',
        category: 'Global Equity'
    },
    {
        id: 'eastspring-dragon',
        name: 'Eastspring Investments Dragon Peacock Fund',
        description: 'Invests in Greater China equities including Hong Kong and China.',
        ticker: 'FXI', // iShares China Large-Cap ETF
        currentPrice: 1.68,
        yearReturn: 6.8,
        risk: 'High',
        category: 'China/HK Equity'
    }
];

let currentUser = null;
let userBalance = 0;
let userHoldings = [];
let pricesLoaded = false;

// Fetch real-time prices from Alpha Vantage API (free tier)
async function fetchRealPrices() {
    // Using Alpha Vantage free API - 25 requests per day limit
    // For demo, we'll use simulated real-time changes based on random walk
    // In production, you'd call the actual API
    
    const priceChanges = {
        'EWS': (Math.random() - 0.5) * 0.1,  // ±5% daily change
        'AAXJ': (Math.random() - 0.5) * 0.15, // ±7.5% daily change
        'AGG': (Math.random() - 0.5) * 0.05,  // ±2.5% daily change (bonds more stable)
        'ASHR': (Math.random() - 0.5) * 0.2,  // ±10% daily change (high risk)
        'VT': (Math.random() - 0.5) * 0.12,   // ±6% daily change
        'FXI': (Math.random() - 0.5) * 0.18   // ±9% daily change
    };
    
    FUNDS.forEach(fund => {
        const basePrice = getBasePriceForTicker(fund.ticker);
        const changePercent = priceChanges[fund.ticker] || 0;
        fund.currentPrice = basePrice * (1 + changePercent);
    });
    
    pricesLoaded = true;
}

// Get base prices for tickers (fallback values)
function getBasePriceForTicker(ticker) {
    const basePrices = {
        'EWS': 2.85,
        'AAXJ': 1.92,
        'AGG': 1.15,
        'ASHR': 3.45,
        'VT': 2.12,
        'FXI': 1.68
    };
    return basePrices[ticker] || 2.00;
}

// Update prices every 30 seconds for simulation
setInterval(() => {
    fetchRealPrices().then(() => {
        if (currentUser) {
            displayFunds();
            displayHoldings();
            calculatePortfolioValue();
        }
    });
}, 5000); // 5 seconds for more dynamic updates

onAuthStateChanged(auth, async (user) => {
    if (!user) {
        window.location.href = '/';
        return;
    }
    currentUser = user;
    
    // Fetch prices first
    await fetchRealPrices();
    
    await loadUserData();
});

// Load user data
async function loadUserData() {
    try {
        const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
        if (userDoc.exists()) {
            const data = userDoc.data();
            userBalance = data.balance || 0;
            userHoldings = data.investments || [];
            
            document.getElementById('available-cash').textContent = `$${userBalance.toFixed(2)}`;
            displayHoldings();
            calculatePortfolioValue();
        }
    } catch (error) {
        console.error('Error loading user data:', error);
    }
}

// Display user holdings
function displayHoldings() {
    const holdingsList = document.getElementById('holdings-list');
    
    if (userHoldings.length === 0) {
        holdingsList.innerHTML = '<p class="no-holdings">You have no investments yet. Start investing below!</p>';
        return;
    }
    
    let html = '<div class="holdings-grid">';
    userHoldings.forEach(holding => {
        const fund = FUNDS.find(f => f.id === holding.fundId);
        if (!fund) return;
        
        const currentValue = holding.units * fund.currentPrice;
        const profit = currentValue - holding.invested;
        const profitPercent = ((profit / holding.invested) * 100).toFixed(2);
        const profitClass = profit >= 0 ? 'positive' : 'negative';
        
        html += `
            <div class="holding-card">
                <h4>${fund.name}</h4>
                <p><strong>Units:</strong> ${holding.units.toFixed(4)}</p>
                <p><strong>Invested:</strong> $${holding.invested.toFixed(2)}</p>
                <p><strong>Current Value:</strong> $${currentValue.toFixed(2)}</p>
                <p class="${profitClass}"><strong>Returns:</strong> $${profit.toFixed(2)} (${profitPercent}%)</p>
            </div>
        `;
    });
    html += '</div>';
    holdingsList.innerHTML = html;
}

// Calculate total portfolio value
function calculatePortfolioValue() {
    let totalInvested = 0;
    let totalCurrent = 0;
    
    userHoldings.forEach(holding => {
        const fund = FUNDS.find(f => f.id === holding.fundId);
        if (fund) {
            totalInvested += holding.invested;
            totalCurrent += holding.units * fund.currentPrice;
        }
    });
    
    const totalReturns = totalCurrent - totalInvested;
    const returnPercent = totalInvested > 0 ? ((totalReturns / totalInvested) * 100).toFixed(2) : 0;
    const returnClass = totalReturns >= 0 ? 'positive' : 'negative';
    
    document.getElementById('total-investment').textContent = `$${totalCurrent.toFixed(2)}`;
    document.getElementById('total-returns').textContent = `$${totalReturns.toFixed(2)} (${returnPercent}%)`;
    document.getElementById('total-returns').className = `value returns ${returnClass}`;
}

// Display available funds
function displayFunds() {
    const fundsGrid = document.getElementById('funds-grid');
    let html = '';
    
    FUNDS.forEach(fund => {
        const returnClass = fund.yearReturn >= 10 ? 'high-return' : fund.yearReturn >= 5 ? 'medium-return' : 'low-return';
        html += `
            <div class="fund-card" data-fund-id="${fund.id}">
                <h4>${fund.name}</h4>
                <p class="fund-category">${fund.category}</p>
                <p class="fund-price">$${fund.currentPrice.toFixed(2)} <span class="price-live">●</span></p>
                <p class="fund-return ${returnClass}">1Y Return: ${fund.yearReturn}%</p>
                <p class="fund-risk">Risk: ${fund.risk}</p>
                <button class="view-btn" onclick="window.openInvestmentModal('${fund.id}')">Invest</button>
            </div>
        `;
    });
    
    fundsGrid.innerHTML = html;
}

// Open investment modal
window.openInvestmentModal = function(fundId) {
    const fund = FUNDS.find(f => f.id === fundId);
    if (!fund) return;
    
    document.getElementById('modal-fund-name').textContent = fund.name;
    document.getElementById('modal-fund-description').textContent = fund.description;
    document.getElementById('modal-fund-price').textContent = fund.currentPrice.toFixed(2);
    document.getElementById('modal-fund-return').textContent = fund.yearReturn;
    document.getElementById('modal-fund-risk').textContent = fund.risk;
    
    const modal = document.getElementById('investment-modal');
    modal.style.display = 'block';
    modal.dataset.fundId = fundId;
};

// Close modal
document.querySelector('.close').addEventListener('click', () => {
    document.getElementById('investment-modal').style.display = 'none';
});

window.addEventListener('click', (e) => {
    const modal = document.getElementById('investment-modal');
    if (e.target === modal) {
        modal.style.display = 'none';
    }
});

// Handle investment
document.getElementById('invest-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const amount = parseFloat(document.getElementById('invest-amount').value);
    const modal = document.getElementById('investment-modal');
    const fundId = modal.dataset.fundId;
    const fund = FUNDS.find(f => f.id === fundId);
    
    if (amount < 100) {
        alert('Minimum investment is $100');
        return;
    }
    
    if (amount > userBalance) {
        alert('Insufficient balance');
        return;
    }
    
    const investBtn = document.getElementById('invest-btn');
    investBtn.disabled = true;
    investBtn.textContent = 'Processing...';
    
    try {
        await runTransaction(db, async (transaction) => {
            const userRef = doc(db, 'users', currentUser.uid);
            const userDoc = await transaction.get(userRef);
            
            const currentBalance = userDoc.data().balance || 0;
            const currentInvestments = userDoc.data().investments || [];
            
            if (currentBalance < amount) {
                throw new Error('Insufficient balance');
            }
            
            // Calculate units purchased
            const units = amount / fund.currentPrice;
            
            // Check if user already has this fund
            const existingIndex = currentInvestments.findIndex(inv => inv.fundId === fundId);
            
            if (existingIndex >= 0) {
                // Add to existing holding
                currentInvestments[existingIndex].units += units;
                currentInvestments[existingIndex].invested += amount;
            } else {
                // Create new holding
                currentInvestments.push({
                    fundId: fundId,
                    units: units,
                    invested: amount,
                    purchaseDate: new Date().toISOString()
                });
            }
            
            // Update user document
            transaction.update(userRef, {
                balance: currentBalance - amount,
                investments: currentInvestments
            });
        });
        
        alert(`Successfully invested $${amount.toFixed(2)} in ${fund.name}`);
        modal.style.display = 'none';
        document.getElementById('invest-form').reset();
        await loadUserData();
        
    } catch (error) {
        console.error('Investment error:', error);
        alert('Investment failed: ' + error.message);
    } finally {
        investBtn.disabled = false;
        investBtn.textContent = 'Invest Now';
    }
});

// Back button
document.getElementById('back-dashboard-btn').addEventListener('click', () => {
    window.location.href = '/dashboard';
});

// Initialize
displayFunds();
