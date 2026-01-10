import React, { useState } from 'react';

export default function App() {
  const [phase, setPhase] = useState('intro');
  const [organicSales, setOrganicSales] = useState('');
  const [closingMethod, setClosingMethod] = useState('');
  const [budget, setBudget] = useState('');
  const [priceRange, setPriceRange] = useState('');
  const [expectedSales, setExpectedSales] = useState('');
  const [repeatBuy, setRepeatBuy] = useState('');
  const [competition, setCompetition] = useState('');
  const [result, setResult] = useState(null);

  const handlePhase2 = () => {
    const priceMap = { '500-2k': 1000, '2k-5k': 3500, '5k-15k': 8000, '15k+': 30000 };
    const basePrice = priceMap[priceRange] || 3000;
    const benchmarkCPS = basePrice * 0.2;
    const budgetNum = parseInt(budget) || 0;
    const expectedNum = parseInt(expectedSales) || 1;
    const userCPS = budgetNum / expectedNum;

    let flags = [];
    let verdict = 'RUN';

    if (userCPS > benchmarkCPS * 1.5) {
      flags.push(`CPS is ₦${Math.round(userCPS)}, should be under ₦${Math.round(benchmarkCPS)}.`);
      verdict = 'RISKY';
    }

    if (competition === 'Hot' && budgetNum < 5000) {
      flags.push('Hot market + small budget = need strong angle.');
      verdict = 'RISKY';
    }

    if (repeatBuy === 'one-time' && budgetNum < 3000) {
      flags.push('One-time sales need bigger budgets.');
      verdict = 'RISKY';
    }

    setResult({
      verdict,
      title: verdict === 'RUN' ? '✅ GO!' : '⚠️ RISKY',
      flags,
      dailyBudget: Math.round(budgetNum / 7),
      benchmarkCPS
    });
  };

  if (result) {
    return (
      <div style={{ padding: '40px', backgroundColor: '#f0f0f0', minHeight: '100vh' }}>
        <h1>{result.verdict === 'RUN' ? 'YOU CAN RUN ADS' : 'RISKY - FIX THESE'}</h1>
        <p>Daily Budget: ₦{result.dailyBudget}</p>
        <p>Realistic CPS: ₦{Math.round(result.benchmarkCPS)}</p>
        {result.flags.length > 0 && (
          <div>
            <h3>Issues:</h3>
            {result.flags.map((f, i) => <p key={i}>{i + 1}. {f}</p>)}
          </div>
        )}
        <button onClick={() => setResult(null)} style={{ padding: '10px 20px', marginTop: '20px' }}>Start Over</button>
      </div>
    );
  }

  if (phase === 'phase2') {
    return (
      <div style={{ padding: '40px', maxWidth: '600px', margin: '0 auto' }}>
        <h2>Phase 2</h2>
        <div style={{ marginBottom: '20px' }}>
          <p>Price range?</p>
          {['500-2k', '2k-5k', '5k-15k', '15k+'].map(opt => (
            <label key={opt} style={{ display: 'block', marginBottom: '10px' }}>
              <input type="radio" checked={priceRange === opt} onChange={() => setPriceRange(opt)} />
              {' '} ₦{opt}
            </label>
          ))}
        </div>

        <div style={{ marginBottom: '20px' }}>
          <p>Expected sales in 7 days?</p>
          <input type="number" value={expectedSales} onChange={(e) => setExpectedSales(e.target.value)} style={{ padding: '8px', width: '100%' }} />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <p>Repeat or one-time?</p>
          <label style={{ display: 'block', marginBottom: '10px' }}>
            <input type="radio" checked={repeatBuy === 'repeat'} onChange={() => setRepeatBuy('repeat')} />
            {' '} Repeat
          </label>
          <label style={{ display: 'block' }}>
            <input type="radio" checked={repeatBuy === 'one-time'} onChange={() => setRepeatBuy('one-time')} />
            {' '} One-time
          </label>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <p>Market?</p>
          {['Cold', 'Medium', 'Hot'].map(opt => (
            <label key={opt} style={{ display: 'block', marginBottom: '10px' }}>
              <input type="radio" checked={competition === opt} onChange={() => setCompetition(opt)} />
              {' '} {opt}
            </label>
          ))}
        </div>

        <button onClick={() => setPhase('phase1')} style={{ padding: '10px 20px', marginRight: '10px' }}>Back</button>
        <button onClick={handlePhase2} style={{ padding: '10px 20px', backgroundColor: 'green', color: 'white', cursor: 'pointer' }}>Get Verdict</button>
      </div>
    );
  }

  return (
    <div style={{ padding: '40px', maxWidth: '600px', margin: '0 auto' }}>
      <h1>Before You Boost™</h1>
      <button onClick={() => setPhase('phase2')} style={{ padding: '15px 30px', backgroundColor: 'blue', color: 'white', cursor: 'pointer', fontSize: '16px' }}>Start →</button>
    </div>
  );
}
