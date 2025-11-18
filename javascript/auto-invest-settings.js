import { auth, db } from './firebase-config.js';
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { doc, getDoc, updateDoc, arrayUnion, arrayRemove } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// OCBC-endorsed funds (same as investments.js)
const FUNDS = [
    {
        id: 'lion-global',
        name: 'Lion Global Singapore Trust Fund',
        description: 'Invests primarily in Singapore equities with long-term capital appreciation focus.'
    },
    {
        id: 'nikko-asia',
        name: 'Nikko AM Shenton Asia Dividend Equity Fund',
        description: 'Focuses on dividend-paying stocks across Asia Pacific region.'
    },
    {
        id: 'abf-singapore',
        name: 'ABF Singapore Bond Index Fund',
        description: 'Invests in Singapore government and quasi-government bonds.'
    },
    {
        id: 'schroder-asian',
        name: 'Schroder Asian Growth Fund',
        description: 'Invests in growth companies across Asia excluding Japan.'
    },
    {
        id: 'fsm-global',
        name: 'FSM Global Opportunities Fund',
        description: 'Global diversified equity fund investing across developed and emerging markets.'
    },
    {
        id: 'eastspring-dragon',
        name: 'Eastspring Investments Dragon Peacock Fund',
        description: 'Focuses on Greater China equities including Hong Kong, China, and Taiwan.'
    }
];

let currentUser = null;

// Initialize page
onAuthStateChanged(auth, async (user) => {
    if (user) {
        currentUser = user;
        populateFundSelect();
        await loadUserRules();
    } else {
        window.location.href = '/login';
    }
});

// Populate fund dropdown
function populateFundSelect() {
    const fundSelect = document.getElementById('fund-select');
    FUNDS.forEach(fund => {
        const option = document.createElement('option');
        option.value = fund.id;
        option.textContent = fund.name;
        fundSelect.appendChild(option);
    });
}

// Load user's existing rules
async function loadUserRules() {
    try {
        const userDoc = await getDoc(doc(db, "users", currentUser.uid));
        const userData = userDoc.data();
        const rules = userData.autoInvestmentRules || [];
        
        displayRules(rules);
    } catch (error) {
        console.error("Error loading rules:", error);
        alert("Failed to load auto-investment rules");
    }
}

// Display rules in the UI
function displayRules(rules) {
    const rulesList = document.getElementById('rules-list');
    
    if (rules.length === 0) {
        rulesList.innerHTML = '<p class="no-rules">No auto-investment rules configured yet.</p>';
        return;
    }
    
    rulesList.innerHTML = rules.map((rule, index) => {
        const fund = FUNDS.find(f => f.id === rule.fundId);
        return `
            <div class="rule-card" data-index="${index}">
                <div class="rule-info">
                    <div class="rule-header">
                        <span class="rule-phone">${rule.sourcePhone}</span>
                        <span class="rule-percentage">${rule.percentage}%</span>
                    </div>
                    <div class="rule-fund">
                        <strong>→ ${fund ? fund.name : 'Unknown Fund'}</strong>
                    </div>
                    <div class="rule-description">
                        When receiving transfers from this number, ${rule.percentage}% will be auto-invested
                    </div>
                </div>
                <button class="delete-rule-btn" onclick="window.deleteRule(${index})">Delete</button>
            </div>
        `;
    }).join('');
}

// Add new rule
document.getElementById('add-rule-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const sourcePhone = document.getElementById('source-phone').value.trim();
    const percentage = parseInt(document.getElementById('percentage').value);
    const fundId = document.getElementById('fund-select').value;
    
    // Validation
    if (!sourcePhone || !percentage || !fundId) {
        alert("Please fill in all fields");
        return;
    }
    
    if (percentage < 1 || percentage > 100) {
        alert("Percentage must be between 1 and 100");
        return;
    }
    
    // Phone number format validation (basic)
    const phoneRegex = /^[\d\s\+\-\(\)]+$/;
    if (!phoneRegex.test(sourcePhone)) {
        alert("Please enter a valid phone number");
        return;
    }
    
    try {
        const userRef = doc(db, "users", currentUser.uid);
        const userDoc = await getDoc(userRef);
        const existingRules = userDoc.data().autoInvestmentRules || [];
        
        // Check if rule for this phone number already exists
        const duplicate = existingRules.find(r => r.sourcePhone === sourcePhone);
        if (duplicate) {
            alert(`A rule for ${sourcePhone} already exists. Please delete it first if you want to create a new one.`);
            return;
        }
        
        const newRule = {
            sourcePhone: sourcePhone,
            percentage: percentage,
            fundId: fundId,
            createdAt: new Date().toISOString()
        };
        
        await updateDoc(userRef, {
            autoInvestmentRules: arrayUnion(newRule)
        });
        
        alert("Auto-investment rule added successfully!");
        
        // Clear form
        document.getElementById('add-rule-form').reset();
        
        // Reload rules
        await loadUserRules();
        
    } catch (error) {
        console.error("Error adding rule:", error);
        alert("Failed to add auto-investment rule: " + error.message);
    }
});

// Delete rule
window.deleteRule = async function(index) {
    if (!confirm("Are you sure you want to delete this auto-investment rule?")) {
        return;
    }
    
    try {
        const userRef = doc(db, "users", currentUser.uid);
        const userDoc = await getDoc(userRef);
        const rules = userDoc.data().autoInvestmentRules || [];
        
        if (index >= 0 && index < rules.length) {
            const ruleToDelete = rules[index];
            
            await updateDoc(userRef, {
                autoInvestmentRules: arrayRemove(ruleToDelete)
            });
            
            alert("Rule deleted successfully!");
            await loadUserRules();
        }
    } catch (error) {
        console.error("Error deleting rule:", error);
        alert("Failed to delete rule: " + error.message);
    }
};

// Logout
document.getElementById('logoutBtn').addEventListener('click', async () => {
    try {
        await signOut(auth);
        window.location.href = '/login';
    } catch (error) {
        console.error("Logout error:", error);
        alert("Failed to logout");
    }
});
