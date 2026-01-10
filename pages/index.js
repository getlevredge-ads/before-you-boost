import React, { useState } from 'react';
import { AlertCircle, CheckCircle, XCircle } from 'lucide-react';

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
    if (organicSales === 'no') {
      setResult({
        verdict: 'STOP',
        title: "You're Not Ready Yet",
        message: 'Sell 2 units organically first, then come back.',
        action: 'Your 7-Day Roadmap',
        steps: [
          { num: 1, task: 'Sell 2 units organically', detail: 'Use WhatsApp, DM, or in-person.' },
          { num: 2, task: 'Write down what worked', detail: 'What convinced them? This becomes your ad copy.' },
          { num: 3, task: 'Come back here', detail: 'Run this tracker again.' },
        ],
      });
      return;
    }

    if (closingMethod === 'unsure') {
      setResult({
        verdict: 'STOP',
        title: 'Set Up WhatsApp First',
        message: 'You need a clear way to close sales.',
        action: 'Setup WhatsApp (30 mins)',
        steps: [
          { num: 1, task: 'Download WhatsApp Business', detail: 'Free app.' },
          { num: 2, task: 'Set up auto-replies', detail: 'Thanks + product details + payment method.' },
          { num: 3, task: 'Assign a closer', detail: 'Someone to reply within 2 hours.' },
        ],
      });
      return;
    }

    if (budget && parseInt(budget) < 2000) {
      setResult({
        verdict: 'STOP',
        title: 'Budget Too Small',
        message: `You have ₦${parseInt(budget).toLocaleString()}. Save to ₦2,000 first.`,
        action: 'Your Options',
        steps: [
          { num: 1, task: 'Save to ₦2,000', detail: 'Over 2 weeks.' },
          { num: 2, task: 'OR sell organically first', detail: 'Then use profits for ads.' },
        ],
      });
      return;
    }

    setPhase('phase2');
  };

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
      flags.push(`Your expected CPS is ₦${Math.round(userCPS).toLocaleString()}, but ₦${Math.round(benchmarkCPS).toLocaleString()} is realistic.`);
      verdict = 'RISKY';
    }

    if (competition === 'Hot' && budgetNum < 5000) {
      flags.push('Crowded market + tight budget = need strong angle.');
      verdict = 'RISKY';
    }

    if (repeatBuy === 'one-time' && budgetNum < 3000) {
      flags.push('One-time purchases need larger budgets.');
      verdict = 'RISKY';
    }

    if (verdict === 'RUN') {
      setResult({
        verdict: 'RUN',
        title: '✅ You\'re Ad-Ready. Launch Within 7 Days.',
        message: `Your offer has proof. Your funnel works. Your budget fits. Time to go.`,
        benchmarks: { benchmarkCPS, userCPS, budgetNum, expectedNum },
        dailyBudget: Math.round(budgetNum / 7),
        action: '3-Step Launch Checklist',
        steps: [
          { num: 1, task: 'Set up your ad (Day 1)', detail: `Meta Ads Manager → Objective: "Messages" → Daily budget: ₦${Math.round(budgetNum / 7).toLocaleString()}` },
          { num: 2, task: 'Monitor first 24 hours (Day 2)', detail: `Cost-per-message under ₦${Math.round(benchmarkCPS).toLocaleString()}? You're on track.` },
          { num: 3, task: 'Close hard for 72 hours', detail: 'Reply within 2 hours. Track sales.' },
        ],
      });
    } else {
      setResult({
        verdict: 'RISKY',
        title: '⚠️ Risky — Fix One Thing First',
        message: `You can run ads, but you'll likely overspend.`,
        flags: flags,
        action: 'Issues to Fix',
        steps: flags.map((flag, idx) => ({
          num: idx + 1,
          task: flag,
          detail: 'Adjust before launching.',
        })),
      });
    }
  };

  // INTRO
  if (phase === 'intro') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 p-6 flex items-center justify-center">
        <div className="max-w-2xl w-full bg-slate-800 border border-slate-700 rounded-lg p-8">
          <h1 className="text-4xl font-bold text-white mb-3">Before You Boost™</h1>
          <p className="text-lg text-slate-300 mb-6">The 90-second ad readiness check</p>
          <p className="text-slate-400 mb-8">Answer 7 quick questions. Get a clear verdict: Run / Risky / Don't Run</p>
          
          <button
            onClick={() => setPhase('phase1')}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition"
          >
            Start Check →
          </button>
        </div>
      </div>
    );
  }

  // PHASE 1
  if (phase === 'phase1') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 p-6">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-white mb-8">Phase 1: Do You Pass?</h2>

          <div className="bg-slate-800 border border-slate-700 rounded-lg p-8 space-y-6">
            {/* Q1 */}
            <div>
              <p className="text-white font-semibold mb-4">Have you sold this organically in the last 90 days?</p>
              <div className="space-y-2">
                <label className="flex items-center p-3 border border-slate-600 rounded-lg hover:bg-slate-700 cursor-pointer">
                  <input type="radio" value="yes" checked={organicSales === 'yes'} onChange={(e) => setOrganicSales(e.target.value)} className="mr-3 w-4 h-4" />
                  <span className="text-white">Yes, at least once</span>
                </label>
                <label className="flex items-center p-3 border border-slate-600 rounded-lg hover:bg-slate-700 cursor-pointer">
                  <input type="radio" value="no" checked={organicSales === 'no'} onChange={(e) => setOrganicSales(e.target.value)} className="mr-3 w-4 h-4" />
                  <span className="text-white">No, never</span>
                </label>
              </div>
            </div>

            {organicSales === 'yes' && (
              <div>
                <p className="text-white font-semibold mb-4">How would you close a sale right now?</p>
                <div className="space-y-2">
                  {['whatsapp', 'phone', 'inperson', 'unsure'].map((opt) => (
                    <label key={opt} className="flex items-center p-3 border border-slate-600 rounded-lg hover:bg-slate-700 cursor-pointer">
                      <input type="radio" value={opt} checked={closingMethod === opt} onChange={(e) => setClosingMethod(e.target.value)} className="mr-3 w-4 h-4" />
                      <span className="text-white">
                        {opt === 'whatsapp' && 'WhatsApp (set up)'}
                        {opt === 'phone' && 'Phone call'}
                        {opt === 'inperson' && 'In-person'}
                        {opt === 'unsure' && 'Not sure yet'}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {organicSales === 'yes' && closingMethod && closingMethod !== 'unsure' && (
              <div>
                <p className="text-white font-semibold mb-4">What's your total ad budget?</p>
                <input type="number" placeholder="Enter amount in ₦" value={budget} onChange={(e) => setBudget(e.target.value)} className="w-full bg-slate-700 border border-slate-600 text-white px-4 py-2 rounded-lg" />
              </div>
            )}
          </div>

          <div className="flex gap-3 mt-8">
            <button onClick={() => setPhase('intro')} className="flex-1 bg-slate-700 hover:bg-slate-600 text-white font-bold py-3 px-6 rounded-lg">Back</button>
            <button onClick={handlePhase1} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg">Next →</button>
          </div>
        </div>
      </div>
    );
  }

  // PHASE 2
  if (phase === 'phase2') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 p-6">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-white mb-8">Phase 2: How Ready Are You?</h2>

          <div className="bg-slate-800 border border-slate-700 rounded-lg p-8 space-y-6">
            {/* Q4 */}
            <div>
              <p className="text-white font-semibold mb-4">Product price range?</p>
              <div className="space-y-2">
                {['500-2k', '2k-5k', '5k-15k', '15k+'].map((opt) => (
                  <label key={opt} className="flex items-center p-3 border border-slate-600 rounded-lg hover:bg-slate-700 cursor-pointer">
                    <input type="radio" value={opt} checked={priceRange === opt} onChange={(e) => setPriceRange(e.target.value)} className="mr-3 w-4 h-4" />
                    <span className="text-white">₦{opt}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Q5 */}
            <div>
              <p className="text-white font-semibold mb-4">Expected sales in 7 days?</p>
              <input type="number" placeholder="e.g., 3" value={expectedSales} onChange={(e) => setExpectedSales(e.target.value)} className="w-full bg-slate-700 border border-slate-600 text-white px-4 py-2 rounded-lg" />
            </div>

            {/* Q6 */}
            <div>
              <p className="text-white font-semibold mb-4">Repeat or one-time?</p>
              <div className="space-y-2">
                <label className="flex items-center p-3 border border-slate-600 rounded-lg hover:bg-slate-700 cursor-pointer">
                  <input type="radio" value="repeat" checked={repeatBuy === 'repeat'} onChange={(e) => setRepeatBuy(e.target.value)} className="mr-3 w-4 h-4" />
                  <span className="text-white">Repeat (they buy again)</span>
                </label>
                <label className="flex items-center p-3 border border-slate-600 rounded-lg hover:bg-slate-700 cursor-pointer">
                  <input type="radio" value="one-time" checked={repeatBuy === 'one-time'} onChange={(e) => setRepeatBuy(e.target.value)} className="mr-3 w-4 h-4" />
                  <span className="text-white">One-time</span>
                </label>
              </div>
            </div>

            {/* Q7 */}
            <div>
              <p className="text-white font-semibold mb-4">Market crowdedness?</p>
              <div className="space-y-2">
                {['Cold', 'Medium', 'Hot'].map((opt) => (
                  <label key={opt} className="flex items-center p-3 border border-slate-600 rounded-lg hover:bg-slate-700 cursor-pointer">
                    <input type="radio" value={opt} checked={competition === opt} onChange={(e) => setCompetition(e.target.value)} className="mr-3 w-4 h-4" />
                    <span className="text-white">{opt === 'Cold' ? 'Cold (niche)' : opt === 'Medium' ? 'Medium' : 'Hot (crowded)'}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="flex gap-3 mt-8">
            <button onClick={() => setPhase('phase1')} className="flex-1 bg-slate-700 hover:bg-slate-600 text-white font-bold py-3 px-6 rounded-lg">Back</button>
            <button onClick={() => { console.log('Button clicked'); handlePhase2(); }} className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg">Get My Verdict →</button>
          </div>
        </div>
      </div>
    );
  }

  // RESULTS
  if (result) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 p-6">
        <div className="max-w-3xl mx-auto">
          <div className={`mb-8 p-8 rounded-lg border-2 ${
            result.verdict === 'RUN' ? 'bg-green-950 border-green-600' :
            result.verdict === 'RISKY' ? 'bg-yellow-950 border-yellow-600' :
            'bg-red-950 border-red-600'
          }`}>
            <div className="flex items-center gap-4 mb-4">
              {result.verdict === 'RUN' && <CheckCircle className="w-12 h-12 text-green-400" />}
              {result.verdict === 'RISKY' && <AlertCircle className="w-12 h-12 text-yellow-400" />}
              {result.verdict === 'STOP' && <XCircle className="w-12 h-12 text-red-400" />}
              <h1 className={`text-3xl font-bold ${
                result.verdict === 'RUN' ? 'text-green-300' :
                result.verdict === 'RISKY' ? 'text-yellow-300' :
                'text-red-300'
              }`}>{result.title}</h1>
            </div>
            <p className="text-slate-300">{result.message}</p>
          </div>

          {result.benchmarks && (
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
                <p className="text-slate-400 text-sm">Realistic CPS</p>
                <p className="text-2xl font-bold text-green-400">₦{Math.round(result.benchmarks.benchmarkCPS).toLocaleString()}</p>
              </div>
              <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
                <p className="text-slate-400 text-sm">Your Expected CPS</p>
                <p className="text-2xl font-bold text-blue-400">₦{Math.round(result.benchmarks.userCPS).toLocaleString()}</p>
              </div>
              <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
                <p className="text-slate-400 text-sm">Daily Budget</p>
                <p className="text-2xl font-bold text-blue-400">₦{result.dailyBudget.toLocaleString()}</p>
              </div>
              <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
                <p className="text-slate-400 text-sm">Duration</p>
                <p className="text-2xl font-bold text-blue-400">7 days</p>
              </div>
            </div>
          )}

          {result.flags && result.flags.length > 0 && (
            <div className="bg-yellow-950 border border-yellow-600 rounded-lg p-6 mb-8">
              <h3 className="text-yellow-300 font-bold mb-4">⚠️ Fix These:</h3>
              <ul className="space-y-2">
                {result.flags.map((flag, idx) => (
                  <li key={idx} className="text-yellow-200"><span className="font-bold">{idx + 1}.</span> {flag}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="bg-slate-800 border border-slate-700 rounded-lg p-8 mb-8">
            <h3 className="text-white font-bold text-lg mb-6">{result.action}</h3>
            <div className="space-y-4">
              {result.steps.map((step) => (
                <div key={step.num} className="flex gap-4">
                  <div className="flex items-center justify-center h-8 w-8 rounded-full bg-blue-600 text-white font-bold flex-shrink-0">{step.num}</div>
                  <div>
                    <p className="text-white font-semibold">{step.task}</p>
                    <p className="text-slate-400 text-sm">{step.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-3">
            <button onClick={() => { setPhase('intro'); setOrganicSales(''); setClosingMethod(''); setBudget(''); setPriceRange(''); setExpectedSales(''); setRepeatBuy(''); setCompetition(''); setResult(null); }} className="flex-1 bg-slate-700 hover:bg-slate-600 text-white font-bold py-3 px-6 rounded-lg">Start Over</button>
            <a href="https://paystack.com/pay/beforeyouboost" target="_blank" rel="noopener noreferrer" className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg text-center">Get Access Now</a>
          </div>
        </div>
      </div>
    );
  }
}
