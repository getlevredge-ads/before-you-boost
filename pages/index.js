import { useState } from 'react';

export default function Home() {
  const [phase, setPhase] = useState('intro');
  const [organicSales, setOrganicSales] = useState('');
  const [closingMethod, setClosingMethod] = useState('');
  const [budget, setBudget] = useState('');
  const [priceRange, setPriceRange] = useState('');
  const [expectedSales, setExpectedSales] = useState('');
  const [repeatBuy, setRepeatBuy] = useState('');
  const [competition, setCompetition] = useState('');
  const [result, setResult] = useState(null);

  const handlePhase1 = () => {
    if (!organicSales || !closingMethod || !budget) {
      alert('Please answer all questions');
      return;
    }
    if (organicSales === 'no') {
      setResult({
        verdict: 'STOP',
        title: "You're Not Ready Yet",
        message: 'Sell 2 units organically first.',
        steps: [
          { num: 1, task: 'Sell 2 units organically', detail: 'Via WhatsApp, DM, or in-person' },
          { num: 2, task: 'Document what worked', detail: 'Save these insights for ad copy' },
          { num: 3, task: 'Come back here', detail: 'Run this tracker again' },
        ],
      });
      return;
    }
    if (closingMethod === 'unsure') {
      setResult({
        verdict: 'STOP',
        title: 'Set Up WhatsApp First',
        message: 'You need a clear way to close sales.',
        steps: [
          { num: 1, task: 'Download WhatsApp Business', detail: 'Free app' },
          { num: 2, task: 'Set up auto-replies', detail: 'Thanks + product + payment method' },
          { num: 3, task: 'Assign a closer', detail: 'Someone to reply within 2 hours' },
        ],
      });
      return;
    }
    if (parseInt(budget) < 2000) {
      setResult({
        verdict: 'STOP',
        title: 'Budget Too Small',
        message: `You have ₦${parseInt(budget).toLocaleString()}. Save to ₦2k first.`,
        steps: [
          { num: 1, task: 'Save ₦2,000', detail: 'Over next 2 weeks' },
          { num: 2, task: 'OR sell organically first', detail: 'Use profits to fund ads' },
        ],
      });
      return;
    }
    setPhase('phase2');
  };

  const handlePhase2 = () => {
    if (!priceRange || !expectedSales || !repeatBuy || !competition) {
      alert('Please answer all questions');
      return;
    }

    const priceMap = { '500-2k': 1000, '2k-5k': 3500, '5k-15k': 8000, '15k+': 30000 };
    const bp = priceMap[priceRange] || 3000;
    const benchmarkCPS = bp * 0.2;
    const budgetNum = parseInt(budget);
    const expectedNum = parseInt(expectedSales);
    const userCPS = budgetNum / expectedNum;

    let flags = [];
    let verdict = 'RUN';

    if (userCPS > benchmarkCPS * 1.5) {
      flags.push(`Your CPS (₦${Math.round(userCPS)}) is high. Benchmark: ₦${Math.round(benchmarkCPS)}`);
      verdict = 'RISKY';
    }
    if (competition === 'Hot' && budgetNum < 5000) {
      flags.push('Hot market + tight budget = need strong unique angle');
      verdict = 'RISKY';
    }
    if (repeatBuy === 'one-time' && budgetNum < 3000) {
      flags.push('One-time purchases need bigger budgets to break even');
      verdict = 'RISKY';
    }

    if (verdict === 'RUN') {
      setResult({
        verdict: 'RUN',
        title: '✅ You\'re Ad-Ready',
        message: 'Your offer has proof. Your funnel works. Your budget fits.',
        benchmarks: { benchmarkCPS, userCPS },
        dailyBudget: Math.round(budgetNum / 7),
        steps: [
          { num: 1, task: 'Set up ad (Day 1)', detail: `Meta Ads → Messages objective → ₦${Math.round(budgetNum / 7)}/day` },
          { num: 2, task: 'Monitor 24h (Day 2)', detail: `Cost per message under ₦${Math.round(benchmarkCPS)}?` },
          { num: 3, task: 'Close hard (Days 3-4)', detail: 'Reply within 2 hours, track sales' },
        ],
      });
    } else {
      setResult({
        verdict: 'RISKY',
        title: '⚠️ Risky - Fix These First',
        message: 'You can run ads, but you\'ll likely overspend.',
        flags,
        steps: flags.map((f, i) => ({ num: i + 1, task: f, detail: 'Adjust before launch' })),
      });
    }
  };

  const styles = {
    container: { minHeight: '100vh', backgroundColor: '#0f172a', color: '#f1f5f9', fontFamily: 'Arial, sans-serif', padding: '20px' },
    maxWidth: { maxWidth: '600px', margin: '0 auto' },
    card: { backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px', padding: '30px', marginBottom: '20px' },
    h1: { fontSize: '32px', fontWeight: 'bold', marginBottom: '10px' },
    h2: { fontSize: '24px', fontWeight: 'bold', marginBottom: '20px' },
    p: { marginBottom: '15px', color: '#cbd5e1' },
    label: { display: 'block', marginBottom: '12px', cursor: 'pointer', padding: '10px', border: '1px solid #334155', borderRadius: '6px', backgroundColor: '#0f172a' },
    input: { width: '100%', padding: '10px', marginBottom: '15px', backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '6px', color: '#f1f5f9' },
    select: { width: '100%', padding: '10px', marginBottom: '15px', backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '6px', color: '#f1f5f9' },
    buttonContainer: { display: 'flex', gap: '10px', marginTop: '20px' },
    buttonBack: { flex: 1, padding: '12px', backgroundColor: '#475569', color: '#f1f5f9', border: 'none', borderRadius: '6px', cursor: 'pointer' },
    buttonNext: { flex: 1, padding: '12px', backgroundColor: '#3b82f6', color: '#f1f5f9', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' },
    buttonGreen: { flex: 1, padding: '12px', backgroundColor: '#10b981', color: '#f1f5f9', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' },
    step: { marginBottom: '15px', borderLeft: '4px solid #3b82f6', paddingLeft: '15px' },
    stepNum: { fontWeight: 'bold', color: '#3b82f6', marginBottom: '5px' },
    flag: { color: '#fca5a5', marginBottom: '10px' },
  };

  // RESULT PAGE
  if (result) {
    return (
      <div style={styles.container}>
        <div style={{ ...styles.maxWidth, ...styles.card }}>
          <h1 style={styles.h1}>{result.title}</h1>
          <p style={styles.p}>{result.message}</p>

          {result.benchmarks && (
            <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#0f172a', borderRadius: '6px' }}>
              <p style={styles.p}>📊 Realistic CPS: <strong>₦{Math.round(result.benchmarks.benchmarkCPS).toLocaleString()}</strong></p>
              <p style={styles.p}>📊 Your Expected CPS: <strong>₦{Math.round(result.benchmarks.userCPS).toLocaleString()}</strong></p>
              <p style={styles.p}>💰 Daily Budget: <strong>₦{result.dailyBudget.toLocaleString()}</strong></p>
            </div>
          )}

          {result.flags && result.flags.length > 0 && (
            <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#78350f', borderRadius: '6px' }}>
              <h3 style={{ color: '#fcd34d', marginBottom: '10px' }}>⚠️ Issues to Fix:</h3>
              {result.flags.map((f, i) => (
                <p key={i} style={styles.flag}>{i + 1}. {f}</p>
              ))}
            </div>
          )}

          {result.steps && (
            <div style={{ marginBottom: '20px' }}>
              <h3 style={{ color: '#e0e7ff', marginBottom: '15px' }}>Your Next Steps:</h3>
              {result.steps.map((step) => (
                <div key={step.num} style={styles.step}>
                  <div style={styles.stepNum}>Step {step.num}: {step.task}</div>
                  <p style={{ color: '#cbd5e1', margin: '0' }}>{step.detail}</p>
                </div>
              ))}
            </div>
          )}

          <div style={styles.buttonContainer}>
            <button onClick={() => setResult(null)} style={styles.buttonBack}>← Start Over</button>
            <a href="https://paystack.com/pay/beforeyouboost" target="_blank" rel="noopener noreferrer" style={{ ...styles.buttonNext, textDecoration: 'none', textAlign: 'center' }}>Get Lifetime Access ₦3.5k →</a>
          </div>
        </div>
      </div>
    );
  }

  // PHASE 1 - 3 QUESTIONS
  if (phase === 'phase1') {
    return (
      <div style={styles.container}>
        <div style={{ ...styles.maxWidth, ...styles.card }}>
          <h2 style={styles.h2}>Phase 1: Do You Pass?</h2>
          <p style={styles.p}>3 knockout questions. If you fail any, you're not ready.</p>

          {/* Q1 */}
          <p style={styles.p}><strong>Q1: Have you sold this organically in the last 90 days?</strong></p>
          <label style={styles.label}>
            <input type="radio" checked={organicSales === 'yes'} onChange={() => setOrganicSales('yes')} /> Yes, at least once
          </label>
          <label style={styles.label}>
            <input type="radio" checked={organicSales === 'no'} onChange={() => setOrganicSales('no')} /> No, never
          </label>

          {/* Q2 */}
          {organicSales === 'yes' && (
            <>
              <p style={styles.p}><strong>Q2: How would you close a sale right now?</strong></p>
              <label style={styles.label}>
                <input type="radio" checked={closingMethod === 'whatsapp'} onChange={() => setClosingMethod('whatsapp')} /> WhatsApp (set up)
              </label>
              <label style={styles.label}>
                <input type="radio" checked={closingMethod === 'phone'} onChange={() => setClosingMethod('phone')} /> Phone call
              </label>
              <label style={styles.label}>
                <input type="radio" checked={closingMethod === 'inperson'} onChange={() => setClosingMethod('inperson')} /> In-person
              </label>
              <label style={styles.label}>
                <input type="radio" checked={closingMethod === 'unsure'} onChange={() => setClosingMethod('unsure')} /> Not sure yet
              </label>
            </>
          )}

          {/* Q3 */}
          {organicSales === 'yes' && closingMethod && closingMethod !== 'unsure' && (
            <>
              <p style={styles.p}><strong>Q3: What's your total ad budget?</strong></p>
              <input type="number" placeholder="Enter amount in ₦" value={budget} onChange={(e) => setBudget(e.target.value)} style={styles.input} />
              <p style={{ ...styles.p, fontSize: '12px', color: '#94a3b8' }}>Minimum recommended: ₦2,000</p>
            </>
          )}

          <div style={styles.buttonContainer}>
            <button onClick={() => setPhase('intro')} style={styles.buttonBack}>← Back</button>
            <button onClick={handlePhase1} style={styles.buttonNext}>Next → </button>
          </div>
        </div>
      </div>
    );
  }

  // PHASE 2 - 4 QUESTIONS
  if (phase === 'phase2') {
    return (
      <div style={styles.container}>
        <div style={{ ...styles.maxWidth, ...styles.card }}>
          <h2 style={styles.h2}>Phase 2: How Ready Are You?</h2>
          <p style={styles.p}>4 questions about your offer & market.</p>

          {/* Q4 */}
          <p style={styles.p}><strong>Q4: Product price range?</strong></p>
          <select value={priceRange} onChange={(e) => setPriceRange(e.target.value)} style={styles.select}>
            <option value="">Select</option>
            <option value="500-2k">₦500-2k</option>
            <option value="2k-5k">₦2k-5k</option>
            <option value="5k-15k">₦5k-15k</option>
            <option value="15k+">₦15k+</option>
          </select>

          {/* Q5 */}
          <p style={styles.p}><strong>Q5: Expected sales in 7 days?</strong></p>
          <input type="number" placeholder="e.g., 5" value={expectedSales} onChange={(e) => setExpectedSales(e.target.value)} style={styles.input} />

          {/* Q6 */}
          <p style={styles.p}><strong>Q6: Repeat purchase or one-time?</strong></p>
          <label style={styles.label}>
            <input type="radio" checked={repeatBuy === 'repeat'} onChange={() => setRepeatBuy('repeat')} /> Repeat (they buy again)
          </label>
          <label style={styles.label}>
            <input type="radio" checked={repeatBuy === 'one-time'} onChange={() => setRepeatBuy('one-time')} /> One-time (one sale per person)
          </label>

          {/* Q7 */}
          <p style={styles.p}><strong>Q7: How crowded is your market?</strong></p>
          <label style={styles.label}>
            <input type="radio" checked={competition === 'Cold'} onChange={() => setCompetition('Cold')} /> Cold (niche, few competitors)
          </label>
          <label style={styles.label}>
            <input type="radio" checked={competition === 'Medium'} onChange={() => setCompetition('Medium')} /> Medium (some competition)
          </label>
          <label style={styles.label}>
            <input type="radio" checked={competition === 'Hot'} onChange={() => setCompetition('Hot')} /> Hot (crowded, many competitors)
          </label>

          <div style={styles.buttonContainer}>
            <button onClick={() => setPhase('phase1')} style={styles.buttonBack}>← Back</button>
            <button onClick={handlePhase2} style={styles.buttonGreen}>Get My Verdict →</button>
          </div>
        </div>
      </div>
    );
  }

  // INTRO
  return (
    <div style={styles.container}>
      <div style={{ ...styles.maxWidth, ...styles.card, textAlign: 'center' }}>
        <h1 style={styles.h1}>Before You Boost™</h1>
        <p style={styles.p}>The 90-second ad readiness check that tells you: Run / Risky / Don't Run</p>
        <p style={{ ...styles.p, color: '#94a3b8' }}>Stop wasting money on ads that won't convert. Answer 7 quick questions and get a clear verdict + action plan.</p>
        <button onClick={() => setPhase('phase1')} style={{ ...styles.buttonNext, width: '100%', padding: '15px' }}>Start 90-Second Check →</button>
      </div>
    </div>
  );
}
