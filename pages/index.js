import { useState } from 'react';

export default function Home() {
  const [phase, setPhase] = useState('intro');
  const [budget, setBudget] = useState('');
  const [priceRange, setPriceRange] = useState('');
  const [expectedSales, setExpectedSales] = useState('');
  const [repeatBuy, setRepeatBuy] = useState('');
  const [competition, setCompetition] = useState('');
  const [result, setResult] = useState(null);

  const handleVerdict = () => {
    const priceMap = { '500-2k': 1000, '2k-5k': 3500, '5k-15k': 8000, '15k+': 30000 };
    const bp = priceMap[priceRange] || 3000;
    const cps = bp * 0.2;
    const budgetNum = parseInt(budget) || 5000;
    const expected = parseInt(expectedSales) || 1;
    const userCPS = budgetNum / expected;

    let issues = [];
    if (budgetNum < 2000) issues.push('Budget too small (minimum ₦2k)');
    if (userCPS > cps * 1.5) issues.push('CPS too high');
    if (competition === 'Hot') issues.push('Market crowded');
    if (repeatBuy === 'one-time') issues.push('One-time model risky');

    setResult({ verdict: issues.length > 0 ? 'RISKY' : 'RUN', issues, cps, userCPS });
  };

  // RESULT PAGE
  if (result) {
    return (
      <div style={{ padding: '40px', fontFamily: 'Arial' }}>
        <h1>{result.verdict}</h1>
        <p>Benchmark CPS: ₦{Math.round(result.cps)}</p>
        <p>Your CPS: ₦{Math.round(result.userCPS)}</p>
        {result.issues.length > 0 && (
          <div>
            <h3>Issues:</h3>
            {result.issues.map((i, idx) => <p key={idx}>{idx + 1}. {i}</p>)}
          </div>
        )}
        <button onClick={() => setResult(null)} style={{ padding: '10px', marginTop: '20px' }}>Back</button>
      </div>
    );
  }

  // PHASE 1
  if (phase === 'phase1') {
    return (
      <div style={{ padding: '40px', fontFamily: 'Arial' }}>
        <h2>Phase 1: Do You Pass?</h2>
        <p>What's your total ad budget?</p>
        <input type="number" placeholder="Enter amount in ₦" value={budget} onChange={(e) => setBudget(e.target.value)} style={{ padding: '8px', marginBottom: '15px', width: '100%' }} />
        <p style={{ fontSize: '12px', color: '#666' }}>Minimum: ₦2,000</p>
        <button onClick={() => setPhase('intro')} style={{ padding: '10px', marginRight: '10px' }}>Back</button>
        <button onClick={() => budget && parseInt(budget) >= 2000 ? setPhase('phase2') : alert('Budget must be ₦2k+')} style={{ padding: '10px', backgroundColor: '#3b82f6', color: 'white', cursor: 'pointer' }}>Next →</button>
      </div>
    );
  }

  // PHASE 2
  if (phase === 'phase2') {
    return (
      <div style={{ padding: '40px', fontFamily: 'Arial' }}>
        <h2>Phase 2: How Ready Are You?</h2>
        <p>Price?</p>
        <select value={priceRange} onChange={(e) => setPriceRange(e.target.value)} style={{ padding: '8px', marginBottom: '15px' }}>
          <option value="">Select</option>
          <option value="500-2k">₦500-2k</option>
          <option value="2k-5k">₦2k-5k</option>
          <option value="5k-15k">₦5k-15k</option>
          <option value="15k+">₦15k+</option>
        </select>

        <p>Expected sales in 7 days?</p>
        <input type="number" placeholder="e.g., 3" value={expectedSales} onChange={(e) => setExpectedSales(e.target.value)} style={{ padding: '8px', marginBottom: '15px' }} />

        <p>Repeat or one-time?</p>
        <select value={repeatBuy} onChange={(e) => setRepeatBuy(e.target.value)} style={{ padding: '8px', marginBottom: '15px' }}>
          <option value="">Select</option>
          <option value="repeat">Repeat</option>
          <option value="one-time">One-time</option>
        </select>

        <p>Market?</p>
        <select value={competition} onChange={(e) => setCompetition(e.target.value)} style={{ padding: '8px', marginBottom: '15px' }}>
          <option value="">Select</option>
          <option value="Cold">Cold (niche)</option>
          <option value="Medium">Medium</option>
          <option value="Hot">Hot (crowded)</option>
        </select>

        <button onClick={() => setPhase('phase1')} style={{ padding: '10px', marginRight: '10px' }}>Back</button>
        <button onClick={handleVerdict} style={{ padding: '10px', backgroundColor: '#10b981', color: 'white', cursor: 'pointer' }}>Get Verdict</button>
      </div>
    );
  }

  // INTRO
  return (
    <div style={{ padding: '40px', fontFamily: 'Arial', textAlign: 'center' }}>
      <h1>Before You Boost™</h1>
      <p>The 90-second ad readiness check</p>
      <button onClick={() => setPhase('phase1')} style={{ padding: '15px 30px', backgroundColor: '#3b82f6', color: 'white', fontSize: '16px', cursor: 'pointer' }}>Start Check →</button>
    </div>
  );
}
