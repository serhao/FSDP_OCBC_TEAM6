const quizQuestionPool = [
    // --- TOPIC 1: WHY INVEST & INFLATION ---
    {
        id: 'q1',
        question: "What is the primary financial risk of relying solely on a savings account over the long term?",
        correctFeedback: "This is correct. Savings accounts provide low returns, which means your money often loses purchasing power because the rate of inflation is higher than the interest earned.",
        options: [
            { 
                text: "Savings accounts are not liquid enough for unexpected expenses.", 
                isCorrect: false,
                feedback: "Savings accounts are actually highly liquid. The main risk of relying on them long-term is the erosion of value due to inflation."
            },
            { text: "Inflation continues to erode the value and purchasing power of your savings over time.", isCorrect: true },
            { 
                text: "The interest earned is subject to extremely high taxes.", 
                isCorrect: false,
                feedback: "Taxes on savings interest are secondary to the risk of inflation, and the term 'extremely high' is subjective."
            },
            { 
                text: "Banks charge high maintenance fees that offset the low interest rates.", 
                isCorrect: false,
                feedback: "While fees can exist, inflation is the greater and more fundamental risk to long-term savings growth."
            }
        ]
    },
    {
        id: 'q2',
        question: "How does investing help mitigate the impact of inflation on your money?",
        correctFeedback: "Investing allows you to seek higher returns than a savings account, enabling your money to grow at a rate that is ideally faster than inflation, preserving or increasing your purchasing power.",
        options: [
            { 
                text: "It guarantees a fixed interest rate that is always higher than inflation.", 
                isCorrect: false,
                feedback: "No investment guarantees a fixed rate always higher than inflation; only higher *potential* returns are possible."
            },
            { text: "It allows the value of assets to increase at a faster rate than a typical savings account.", isCorrect: true },
            { 
                text: "It makes goods and services cheaper to buy in the future.", 
                isCorrect: false,
                feedback: "Investing doesn't change future prices; it changes the amount of money you have to pay those prices."
            },
            { 
                text: "It reduces the amount of tax paid on earned interest.", 
                isCorrect: false,
                feedback: "Tax benefits may apply to some accounts (like SRS), but the core benefit of investing is growth potential."
            }
        ]
    },
    {
        id: 'q3',
        question: "According to the article, why might the dollar you hold today be worth less in the future?",
        correctFeedback: "Inflation is the general rise in prices, which means the same amount of money buys fewer goods and services in the future.",
        options: [
            { 
                text: "Due to decreased global trade volume.", 
                isCorrect: false,
                feedback: "While global trade impacts the economy, the loss of purchasing power mentioned in the article is specifically attributed to inflation."
            },
            { 
                text: "Due to bank reserve policies.", 
                isCorrect: false,
                feedback: "Bank policies are not the main reason the dollar's value decreases over time; inflation is the primary cause."
            },
            { text: "Due to the impact of inflation.", isCorrect: true },
            { 
                text: "Due to government regulations on withdrawal limits.", 
                isCorrect: false,
                feedback: "Withdrawal limits affect access to money, not the intrinsic purchasing power of the currency itself."
            }
        ]
    },
    {
        id: 'q4',
        question: "What is the main purpose of putting money into assets like unit trusts, stocks, and bonds?",
        correctFeedback: "The main purpose of investing is to achieve greater capital appreciation and returns than standard savings, helping you reach long-term financial goals.",
        options: [
            { 
                text: "To eliminate all financial risk immediately.", 
                isCorrect: false,
                feedback: "All investments carry some degree of risk; the goal is to manage risk, not eliminate it."
            },
            { text: "To grow wealth faster than keeping money in a savings account.", isCorrect: true },
            { 
                text: "To guarantee a comfortable life without working.", 
                isCorrect: false,
                feedback: "Investing supports a comfortable life, but it requires strategy, time, and doesn't guarantee a completely work-free life."
            },
            { 
                text: "To avoid bank fees and charges.", 
                isCorrect: false,
                feedback: "Investments often have their own fees (like management fees); this is not the main purpose."
            }
        ]
    },
    {
        id: 'q5',
        question: "What figure did the OCBC Retirement Calculator estimate a 25-year-old would need to accumulate to retire comfortably at 60?",
        correctFeedback: "The OCBC Life Goals Retirement Calculator estimated that amount, highlighting the need for long-term planning and growth beyond simple savings.",
        options: [
            { 
                text: "$500,000", 
                isCorrect: false,
                feedback: "This figure is too low for a comfortable retirement goal mentioned in the article."
            },
            { 
                text: "$1.2 million", 
                isCorrect: false,
                feedback: "This figure is lower than the amount estimated by the OCBC calculator for a comfortable retirement."
            },
            { text: "About $2.1 million", isCorrect: true },
            { 
                text: "$5 million", 
                isCorrect: false,
                feedback: "While a desirable goal, this figure is higher than the estimate provided by the OCBC calculator in the article."
            }
        ]
    },
    // --- TOPIC 2: RISK ASSESSMENT (Need, Ability, Willingness) ---
    {
        id: 'q6',
        question: "What three factors determine an investor's overall approach towards taking risks?",
        correctFeedback: "An investor's risk profile is a balance of their **Need** (required return to hit goals), **Ability** (financial capacity to absorb losses), and **Willingness** (emotional comfort with risk).",
        options: [
            { text: "Need, Ability, and Willingness", isCorrect: true },
            { 
                text: "Time, Money, and Goals", 
                isCorrect: false,
                feedback: "Time, Money, and Goals are elements of financial planning, but the specific factors for risk approach are Need, Ability, and Willingness."
            },
            { 
                text: "Income, Liabilities, and Liquidity", 
                isCorrect: false,
                feedback: "These factors contribute to assessing an investor's 'Ability to take risks,' but they are not the three comprehensive factors for the overall approach."
            },
            { 
                text: "Returns, Volatility, and Tenure", 
                isCorrect: false,
                feedback: "These are characteristics of the investment (Returns, Volatility, Tenure), not the characteristics of the investor's risk approach."
            }
        ]
    },
    {
        id: 'q7',
        question: "An investor's 'Ability to take risks' is determined by:",
        correctFeedback: "Ability is objective and measured by your financial reality: how much disposable income and capital you have to withstand market losses without compromising your life or goals.",
        options: [
            { 
                text: "Their personal comfort level with market drops.", 
                isCorrect: false,
                feedback: "Personal comfort level relates to 'Willingness to take risks,' not the objective 'Ability' to do so."
            },
            { text: "Their yearly cash flow, commitments, liabilities, and disposable income.", isCorrect: true },
            { 
                text: "The highest potential return of their portfolio.", 
                isCorrect: false,
                feedback: "This is a measure of return potential, which relates to the 'Need' for risk, not the objective 'Ability' to take it."
            },
            { 
                text: "The number of investment products they own.", 
                isCorrect: false,
                feedback: "The quantity of products is related to diversification, not the investor's core financial capacity to absorb risk."
            }
        ]
    },
    {
        id: 'q8',
        question: "What determines an investor's 'Willingness to take risks'?",
        correctFeedback: "Willingness is subjective and psychological. It's about your emotional threshold for volatility and how you might react to market drops, often assessed through a questionnaire.",
        options: [
            { 
                text: "Their annual tax bracket.", 
                isCorrect: false,
                feedback: "Tax bracket is irrelevant to an investor's psychological comfort or 'Willingness' to take risks."
            },
            { text: "Their personal preferences, often assessed via a risk profiling questionnaire.", isCorrect: true },
            { 
                text: "The maximum required rate of return to meet goals.", 
                isCorrect: false,
                feedback: "The required rate of return relates to the 'Need' to take risks, not the 'Willingness' (comfort level)."
            },
            { 
                text: "The minimum amount of money they need to retire.", 
                isCorrect: false,
                feedback: "This figure is related to the 'Need' for risk, not the psychological 'Willingness' to take it."
            }
        ]
    },
    {
        id: 'q9',
        question: "If an investor's Need and Willingness are High but their Ability is Low, their overall approach should be towards:",
        correctFeedback: "Ability (the objective financial capacity) should act as the primary constraint. You should never invest beyond what you can financially afford to lose, regardless of your high emotional comfort (Willingness) or ambitious goals (Need).",
        options: [
            { 
                text: "Aggressively High Risk.", 
                isCorrect: false,
                feedback: "An aggressively high-risk approach is only suitable if Ability is also high; Ability is the primary constraint."
            },
            { 
                text: "Moderately High Risk.", 
                isCorrect: false,
                feedback: "This is still too high. Since Ability is low, the investor's approach must be moderated to prevent financial strain if losses occur."
            },
            { text: "Lower Risk.", isCorrect: true },
            { 
                text: "Zero Risk (Savings Only).", 
                isCorrect: false,
                feedback: "While low risk is needed, if the Need is high, some calculated risk must still be taken, usually through diversified, less volatile instruments."
            }
        ]
    },
    {
        id: 'q10',
        question: "Why is 'Staying the course' crucial in an investment journey?",
        correctFeedback: "Market drops are inevitable. 'Staying the course' means adhering to your long-term plan and avoiding emotional decisions, like selling at a loss, which can permanently derail your goals.",
        options: [
            { 
                text: "It guarantees a profit regardless of market conditions.", 
                isCorrect: false,
                feedback: "'Staying the course' does not guarantee profit; it helps maximise the *probability* of achieving long-term goals by avoiding costly panic selling."
            },
            { text: "It prevents an investor from bailing out at an inopportune time due to market drops.", isCorrect: true },
            { 
                text: "It eliminates all company-specific risks.", 
                isCorrect: false,
                feedback: "Diversification eliminates company-specific risks; 'Staying the course' relates to temperament and time horizon."
            },
            { 
                text: "It automatically increases your disposable income.", 
                isCorrect: false,
                feedback: "Disposable income is based on salary and expenses; it is not directly increased by your investment strategy."
            }
        ]
    },
    // --- TOPIC 3: HOW TO INVEST (STRATEGIES & ASSETS) ---
    {
        id: 'q11',
        question: "Which investment strategy involves investing a small amount of money at monthly intervals to minimise risk?",
        correctFeedback: "Dollar Cost Averaging (DCA) is a disciplined approach where regular, fixed investments reduce the average cost of shares over time, mitigating the risk of buying high.",
        options: [
            { 
                text: "Lump-sum investing.", 
                isCorrect: false,
                feedback: "Lump-sum investing involves putting all capital in at once, which carries the risk of buying at a market peak."
            },
            { text: "Dollar Cost Averaging (DCA).", isCorrect: true },
            { 
                text: "Market timing.", 
                isCorrect: false,
                feedback: "Market timing attempts to buy low and sell high, which is notoriously difficult and risky, the opposite of DCA."
            },
            { 
                text: "Concentration investing.", 
                isCorrect: false,
                feedback: "Concentration investing involves holding a few assets and increases risk, which is contrary to the goal of minimising it."
            }
        ]
    },
    {
        id: 'q12',
        question: "What is the key advantage of DCA over lump-sum investing in a falling market (bear market)?",
        correctFeedback: "By buying regularly as prices fall, DCA allows the investor to acquire more shares for the same fixed amount of money, leading to a lower overall average cost.",
        options: [
            { 
                text: "DCA guarantees the lowest price per share.", 
                isCorrect: false,
                feedback: "DCA does not guarantee the absolute lowest price; it lowers the *average* price."
            },
            { text: "DCA ensures a lower average cost per share.", isCorrect: true },
            { 
                text: "DCA is only used for blue-chip stocks.", 
                isCorrect: false,
                feedback: "DCA can be applied to any asset class, not just blue-chip stocks."
            },
            { 
                text: "DCA eliminates all capital gains taxes.", 
                isCorrect: false,
                feedback: "DCA is a strategy for mitigating risk and managing cost; it has no direct impact on capital gains taxes."
            }
        ]
    },
    {
        id: 'q13',
        question: "The article suggests that you can start a monthly investment plan with as little as:",
        correctFeedback: "This low minimum, often available through regular savings plans (RSPs), makes investing accessible to young investors who may not have large sums of capital.",
        options: [
            { 
                text: "S$1,000.", 
                isCorrect: false,
                feedback: "While S$1,000 may be an option, the minimum amount mentioned in the article for monthly plans is lower."
            },
            { 
                text: "S$500.", 
                isCorrect: false,
                feedback: "While S$500 may be an option, the minimum amount mentioned in the article for monthly plans is lower."
            },
            { text: "S$100.", isCorrect: true },
            { 
                text: "S$10,000.", 
                isCorrect: false,
                feedback: "This figure represents a large lump sum, not the minimum monthly contribution for easy-access investment plans."
            }
        ]
    },
    {
        id: 'q14',
        question: "What is a major potential snag when investing directly in individual stocks?",
        correctFeedback: "Direct stock investment requires deep research into financial statements, market trends, and company management, which demands significant time and expertise.",
        options: [
            { 
                text: "You have too many diversification options.", 
                isCorrect: false,
                feedback: "Too many options is not a snag; the real challenge is selecting the *right* options and researching them."
            },
            { text: "The need to spend substantial time doing research to pick the right instruments.", isCorrect: true },
            { 
                text: "The instruments are generally illiquid.", 
                isCorrect: false,
                feedback: "Individual stocks are typically highly liquid and easy to buy and sell."
            },
            { 
                text: "All stocks are required to pay dividends.", 
                isCorrect: false,
                feedback: "Stocks are *not* required to pay dividends; many growth companies choose not to."
            }
        ]
    },
    {
        id: 'q15',
        question: "What does investing directly in individual stocks expose a portfolio to, alongside broader market risks?",
        correctFeedback: "When you hold a concentrated portfolio of a few stocks, you face higher 'concentration risk' and are exposed to unique risks specific to those companies (company-specific risk).",
        options: [
            { 
                text: "Zero risk.", 
                isCorrect: false,
                feedback: "All investments carry risk; individual stocks carry high risk."
            },
            { 
                text: "Only interest rate risk.", 
                isCorrect: false,
                feedback: "Individual stocks carry many risks, not just interest rate risk."
            },
            { text: "Concentration risk and company-specific risks.", isCorrect: true },
            { 
                text: "Inflation risk only.", 
                isCorrect: false,
                feedback: "While inflation is a risk, individual stocks also carry market risk, liquidity risk, and specific company risk."
            }
        ]
    },
    // --- TOPIC 4: DIVERSIFICATION AND FUNDS (ETFS/UNIT TRUSTS) ---
    {
        id: 'q16',
        question: "What is the key role of diversification in an investment portfolio?",
        correctFeedback: "Diversification involves spreading capital across different assets or sectors so that if one performs poorly, the others may compensate, leading to a smoother overall return.",
        options: [
            { 
                text: "To concentrate wealth in a single, high-growth sector.", 
                isCorrect: false,
                feedback: "Concentrating wealth *increases* volatility and risk; diversification aims to reduce it."
            },
            { 
                text: "To guarantee protection against all losses.", 
                isCorrect: false,
                feedback: "Diversification cannot guarantee protection against all losses, especially during a broad market crash."
            },
            { text: "To reduce overall portfolio volatility and risks.", isCorrect: true },
            { 
                text: "To eliminate the need for annual portfolio reviews.", 
                isCorrect: false,
                feedback: "Reviews are essential regardless of diversification to ensure the portfolio remains aligned with goals."
            }
        ]
    },
    {
        id: 'q17',
        question: "Investing in a combination of equities, bonds, and other asset classes is a strategy for:",
        correctFeedback: "This is the essence of diversification. Combining assets that do not move in lockstep (e.g., bonds and stocks) generally leads to better risk-adjusted returns.",
        options: [
            { 
                text: "Increasing concentration risk.", 
                isCorrect: false,
                feedback: "Diversification *decreases* concentration risk by spreading investments."
            },
            { text: "Improving investment returns while lowering risks.", isCorrect: true },
            { 
                text: "Focusing solely on capital preservation.", 
                isCorrect: false,
                feedback: "While bonds aid preservation, including equities indicates a goal of growth, not *solely* preservation."
            },
            { 
                text: "Ensuring all returns are tax-free.", 
                isCorrect: false,
                feedback: "Tax treatment depends on the specific product and jurisdiction, not the act of combining asset classes."
            }
        ]
    },
    {
        id: 'q18',
        question: "What benefit do Unit Trusts and ETFs offer regarding transactions?",
        correctFeedback: "Unit Trusts and ETFs already hold a basket of underlying stocks/bonds. You perform a single transaction to buy or sell that entire basket, simplifying the process.",
        options: [
            { 
                text: "They eliminate all transaction costs.", 
                isCorrect: false,
                feedback: "Transaction costs are not eliminated, but they are often lower than buying every underlying asset individually."
            },
            { text: "You only need to perform one transaction to buy into or sell out of the fund.", isCorrect: true },
            { 
                text: "They allow you to buy individual stocks commission-free.", 
                isCorrect: false,
                feedback: "They are funds, not platforms for buying individual stocks commission-free."
            },
            { 
                text: "They offer fixed-income returns only.", 
                isCorrect: false,
                feedback: "Many funds hold equities and offer growth returns; they are not limited to fixed-income returns."
            }
        ]
    },
    {
        id: 'q19',
        question: "Which of these is NOT an example of an asset class to include in a diversified portfolio mentioned in the article?",
        correctFeedback: "The article references Equities (stocks), Bonds (fixed income), and funds like Unit Trusts and ETFs, but not Consumer Goods as a core asset class.",
        options: [
            { 
                text: "Equities (Stocks).", 
                isCorrect: false,
                feedback: "Equities are a fundamental asset class for growth, mentioned in the article."
            },
            { 
                text: "Bonds (Fixed Income).", 
                isCorrect: false,
                feedback: "Bonds are a fundamental asset class for stability and income, mentioned in the article."
            },
            { text: "Consumer Goods.", isCorrect: true },
            { 
                text: "Unit Trusts/ETFs.", 
                isCorrect: false,
                feedback: "These are funds that hold multiple assets and are specifically mentioned as a tool for diversification."
            }
        ]
    },
    {
        id: 'q20',
        question: "What allows funds (Unit Trusts/ETFs) to invest in larger positions than a small individual investor?",
        correctFeedback: "Funds gather money from thousands of investors, creating a large pool of assets (economies of scale) that allows them to access institutional investment opportunities and negotiate better pricing.",
        options: [
            { 
                text: "Government subsidies.", 
                isCorrect: false,
                feedback: "Funds do not typically rely on government subsidies for size; they rely on pooled capital."
            },
            { text: "The fund's assets are pooled together from many investors (economies of scale).", isCorrect: true },
            { 
                text: "Exemption from all brokerage commissions.", 
                isCorrect: false,
                feedback: "While fees may be reduced, commissions are not completely eliminated; this is not the reason they can invest in larger positions."
            },
            { 
                text: "The ability to invest only in overseas markets.", 
                isCorrect: false,
                feedback: "Their ability to invest globally is a feature, not the reason for their large position sizes."
            }
        ]
    },
    // --- TOPIC 5: INVESTMENT ACCESSIBILITY & PRINCIPLES ---
    {
        id: 'q21',
        question: "Why did the SGX decrease the standard board lot size for equities investment from 1,000 units to 100 units?",
        correctFeedback: "This change lowered the minimum capital needed to buy a block of shares, making stock investment more affordable and accessible to retail investors.",
        options: [
            { 
                text: "To reduce transaction fees.", 
                isCorrect: false,
                feedback: "Transaction fees are separate from the lot size; the lot size affects the principal capital needed."
            },
            { text: "To meaningfully decrease the capital needed, making investments more accessible.", isCorrect: true },
            { 
                text: "To encourage lump-sum investment.", 
                isCorrect: false,
                feedback: "The change encourages all types of investment, but primarily makes investing easier for those with smaller capital."
            },
            { 
                text: "To limit the number of shares an individual can purchase.", 
                isCorrect: false,
                feedback: "The change *increased* access for small investors; it did not limit purchases."
            }
        ]
    },
    {
        id: 'q22',
        question: "What is the typical minimum investment amount for Retail Bonds made accessible through new MAS frameworks?",
        correctFeedback: "Retail bonds (like Singapore Savings Bonds) were made accessible with a low minimum investment, opening up this asset class to non-accredited investors.",
        options: [
            { 
                text: "$200,000.", 
                isCorrect: false,
                feedback: "This figure is often the minimum for institutional or non-retail bonds."
            },
            { 
                text: "$100.", 
                isCorrect: false,
                feedback: "While some investment products start this low, the typical minimum for retail bonds is higher."
            },
            { text: "$1,000.", isCorrect: true },
            { 
                text: "$50,000.", 
                isCorrect: false,
                feedback: "This figure is too high for the MAS-driven retail bond minimums."
            }
        ]
    },
    {
        id: 'q23',
        question: "A recommended investing principle is to review your portfolio holistically together with your financial goals at least how often?",
        correctFeedback: "Goals and financial circumstances change over time. An annual review ensures your portfolio remains correctly aligned and helps with rebalancing.",
        options: [
            { 
                text: "Once a month.", 
                isCorrect: false,
                feedback: "Monthly review is usually too frequent and can lead to emotional over-trading; annual review is recommended for holistic assessment."
            },
            { text: "Once a year.", isCorrect: true },
            { 
                text: "Every five years.", 
                isCorrect: false,
                feedback: "Every five years is too infrequent to catch important changes in goals or portfolio drift."
            },
            { 
                text: "Only when a major market correction occurs.", 
                isCorrect: false,
                feedback: "Reviewing only during a crisis leads to emotional decisions; review should be scheduled and systematic."
            }
        ]
    },
    {
        id: 'q24',
        question: "What should you do to overcome a lack of Willingness to take risks due to fear of losses?",
        correctFeedback: "The fear of losses often stems from the fear of the unknown. Education empowers the investor, replacing fear with knowledge and confidence, which increases Willingness.",
        options: [
            { 
                text: "Sell all current investments immediately.", 
                isCorrect: false,
                feedback: "This is a panic reaction and will likely solidify losses."
            },
            { 
                text: "Only use savings accounts.", 
                isCorrect: false,
                feedback: "This may increase comfort but guarantees you fail to meet long-term goals due to inflation."
            },
            { text: "Learn more about the various ways and assets to invest in.", isCorrect: true },
            { 
                text: "Triple your contribution to fixed deposits.", 
                isCorrect: false,
                feedback: "This is a low-risk move that reinforces the fear without increasing the necessary comfort or education to grow wealth."
            }
        ]
    },
    {
        id: 'q25',
        question: "What principle ensures you do not take on more risk than you are comfortable with?",
        correctFeedback: "Knowing your risk appetite and tolerance, often determined by a questionnaire, helps establish a risk level that aligns with your emotional comfort, preventing panic selling.",
        options: [
            { 
                text: "Understand what you are investing in.", 
                isCorrect: false,
                feedback: "Understanding is key to 'Ability' and 'Willingness' but 'Knowing your risk appetite' is the formal principle that sets the actual comfort limit."
            },
            { text: "Know your risk appetite and tolerance.", isCorrect: true },
            { 
                text: "Diversify your portfolio across all asset classes.", 
                isCorrect: false,
                feedback: "Diversification manages risk, but your risk tolerance determines *how much* diversification and what asset mix you should use."
            },
            { 
                text: "Maintain a core portfolio of Unit Trusts.", 
                isCorrect: false,
                feedback: "This is a strategy, not the fundamental principle for managing emotional risk level."
            }
        ]
    },
    // --- TOPIC 6: CORE CONCEPTS & DEFINITIONS ---
    {
        id: 'q26',
        question: "For seasoned investors, what is the purpose of maintaining a small portion of a portfolio for 'tactical investment'?",
        correctFeedback: "Tactical investment is typically a smaller, more speculative portion of a portfolio used to capitalize on short-to-medium term market movements or trends.",
        options: [
            { 
                text: "To provide greater stability and long-term returns.", 
                isCorrect: false,
                feedback: "Stability and long-term returns are handled by the large 'core' portion of the portfolio."
            },
            { text: "To capture market opportunities.", isCorrect: true },
            { 
                text: "To pay for immediate, unexpected expenses.", 
                isCorrect: false,
                feedback: "Immediate expenses should be covered by an emergency fund, which is cash/savings, not a volatile tactical investment."
            },
            { 
                text: "To eliminate the need for a financial advisor.", 
                isCorrect: false,
                feedback: "A financial advisor may still be required to manage the 'core' portfolio."
            }
        ]
    },
    {
        id: 'q27',
        question: "What product is described as a 'hybrid product that allows you to invest and insure yourself at the same time'?",
        correctFeedback: "An ILP combines the features of life insurance (providing a payout upon death/disability) with investment components (investing the premiums into sub-funds).",
        options: [
            { 
                text: "A Supplementary Retirement Scheme (SRS) Account.", 
                isCorrect: false,
                feedback: "An SRS account is a tax-relief retirement savings scheme; it does not typically include an insurance component."
            },
            { text: "An Investment-linked life insurance plan (ILP).", isCorrect: true },
            { 
                text: "A Fixed Deposit Account.", 
                isCorrect: false,
                feedback: "A Fixed Deposit is a savings product; it has no investment or insurance components."
            },
            { 
                text: "A Unit Trust.", 
                isCorrect: false,
                feedback: "A Unit Trust is purely an investment fund; it does not include an insurance component."
            }
        ]
    },
    {
        id: 'q28',
        question: "What asset class can be added to a portfolio for 'added diversification' as the portfolio grows?",
        correctFeedback: "Gold and silver are often considered 'safe-haven' assets that perform differently from stocks and bonds, providing a valuable uncorrelated hedge for diversification.",
        options: [
            { 
                text: "Personal Loans.", 
                isCorrect: false,
                feedback: "Personal loans are debts, not generally considered a core asset class for investment diversification."
            },
            { 
                text: "Credit Card Debt.", 
                isCorrect: false,
                feedback: "Credit card debt is a liability to be minimized, not an asset class for diversification."
            },
            { text: "Gold and silver.", isCorrect: true },
            { 
                text: "Cash in a safe.", 
                isCorrect: false,
                feedback: "Cash is a low-growth liquid asset; it's a foundation, not an asset added for diversification growth."
            }
        ]
    },
    {
        id: 'q29',
        question: "What is the key takeaway from the Shakespeare quote 'To thine own self be true' in the article's context?",
        correctFeedback: "The quote emphasizes the importance of honest self-assessment, particularly regarding your true risk tolerance, to avoid making investment decisions that conflict with your personality.",
        options: [
            { 
                text: "Always rely on expert advice.", 
                isCorrect: false,
                feedback: "While expert advice is useful, the quote refers to self-knowledge and personal truth."
            },
            { text: "Be truthful in assessing your personal preferences and situation regarding risk.", isCorrect: true },
            { 
                text: "You should never reveal your financial goals to anyone.", 
                isCorrect: false,
                feedback: "The quote encourages honesty with oneself, not secrecy from others."
            },
            { 
                text: "Only invest in what you know and understand.", 
                isCorrect: false,
                feedback: "This is a good principle, but the quote's context in the article is about being true to your personal risk character."
            }
        ]
    },
    {
        id: 'q30',
        question: "Which of these is NOT a financial goal mentioned in the article?",
        correctFeedback: "The article lists common long-term goals like retirement, education, and legacy planning. Paying monthly rent is a recurring expense, not a long-term financial goal you invest toward.",
        options: [
            { 
                text: "Retirement.", 
                isCorrect: false,
                feedback: "Retirement is a common long-term financial goal mentioned in the article."
            },
            { 
                text: "Children's education.", 
                isCorrect: false,
                feedback: "Education funding is a common long-term financial goal mentioned in the article."
            },
            { 
                text: "Legacy planning.", 
                isCorrect: false,
                feedback: "Legacy planning is a long-term financial goal that may require investment."
            },
            { text: "Paying monthly rent (This is a regular expense, not a long-term goal).", isCorrect: true }
        ]
    }
];