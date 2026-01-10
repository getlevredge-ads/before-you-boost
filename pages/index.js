import React, { useState } from 'react';
import { AlertCircle, CheckCircle, XCircle } from 'lucide-react';

export default function Home() {
  const [phase, setPhase] = useState('intro');
  const [answers, setAnswers] = useState({
    organicSales: null,
    closingMethod: null,
    budget: null,
    priceRange: null,
    expectedSales: null,
    repeatBuy: null,
    competition: null,
  });
  const [result, setResult] = useState(null);

  const updateAnswer = (key, value) => {
    setAnswers({ ...answers, [key]: value });
  };

  const handlePhase1 = () => {
    if (answers.organicSales === 'no') {
      setResult({
        verdict: 'STOP',
        title: "You're Not Ready Yet (But This is Good News)",
        message: 'Ads amplify proven offers. Right now, you need to prove your product works.',
        action: 'Your 7-Day Roadmap',
        steps: [
          { num: 1, task: 'Sell 2 units organically', detail: 'Use WhatsApp, DM, in-person, or email. Just 2 sales. You need proof this product resonates.' },
          { num: 2, task: 'Write down what worked', detail: 'What convinced them? What questions did they ask? This becomes your ad copy.' },
          { num: 3, task: 'Come back here', detail: 'Once you have 2 organic sales, run this tracker again. You\'ll likely get "RUN."' },
        ],
        nextButton: 'Start Selling Organically',
      });
      return;
    }

    if (answers.closingMethod === 'unsure') {
      setResult({
        verdict: 'STOP',
        title: 'Your Closing System Isn\'t Ready',
        message: 'If someone messages you excited about your product, can you actually close them?',
        action: 'Set Up WhatsApp (Free, 30 mins)',
        steps: [
          { num: 1, task: 'Download WhatsApp Business', detail: 'Free app on Android/iPhone. Takes 5 minutes.' },
          { num: 2, task: 'Set up 3 auto-replies', detail: 'Thanks + product details + payment method.' },
          { num: 3, task: 'Assign someone to reply within 2 hours', detail: 'This is your closer. They need to be fast.' },
          { num: 4, task: 'Come back here', detail: 'Once set up, run the tracker again.' },
        ],
        nextButton: 'Setup Complete',
      });
      return;
    }

    if (answers.budget && parseInt(answers.budget) < 2000) {
      setResult({
        verdict: 'STOP',
        title: 'Your Budget is Too Small (For Now)',
        message: `You have ₦${parseInt(answers.budget).toLocaleString()}. Ads work best with at least ₦2,000 for a test.`,
        action: 'Your Options',
        steps: [
          { num: 1, task: 'Save to ₦2,000', detail: 'Set aside ₦2k over the next 2 weeks. Focus on organic sales to build momentum first.' },
          { num: 2, task: 'OR start with organic only', detail: 'Sell 5–10 units via WhatsApp/DM first. Then use profits to fund your first ad test.' },
          { num: 3, task: 'Come back when ready', detail: 'Budget ₦2k+? Run this tracker again.' },
        ],
        nextButton: 'I\'ll Save & Come Back',
      });
      return;
    }

    setPhase('phase2');
  };

  const calculateBenchmark = () => {
    const priceMap = { '500-2k': 1000, '2k-5k': 3500, '5k-15k': 8000, '15k+': 30000 };
    const basePrice = priceMap[answers.priceRange] || 3000;
    const benchmarkCPS = basePrice * 0.2;
    const budget = parseInt(answers.budget) || 0;
    const expected = parseInt(answers.expectedSales) || 1;
    const userCPS = budget / expected;

    return { benchmarkCPS, userCPS, budget, expected };
  };

  const handlePhase2 = () => {
    const { benchmarkCPS, userCPS, budget, expected } = calculateBenchmark();

    let flags = [];
    let verdict = 'RUN';

    if (userCPS > benchmarkCPS * 1.5) {
      flags.push({
        type: 'budget',
        message: `Your expected CPS is ₦${Math.round(userCPS).toLocaleString()}, but ₦${Math.round(benchmarkCPS).toLocaleString()} is realistic for your price point.`,
      });
      verdict = 'RISKY';
    }

    if (answers.competition === 'Hot' && budget < 5000) {
      flags.push({
        type: 'market',
        message: 'You\'re in a crowded market with a tight budget. You\'ll need a strong unique angle to stand out.',
      });
      verdict = 'RISKY';
    }

    if (answers.repeatBuy === 'one-time' && budget < 3000) {
      flags.push({
        type: 'model',
        message: 'One-time purchases need larger budgets to break even. Consider selling to existing customers first.',
      });
      verdict = 'RISKY';
    }

    if (verdict === 'RUN') {
      setResult({
        verdict: 'RUN',
        title: '✅ You\'re Ad-Ready. Launch Within 7 Days.',
        message: `Your offer has proof. Your funnel works. Your budget fits. Time to go.`,
        benchmarks: { benchmarkCPS, userCPS, budget, expected },
        dailyBudget: Math.round(budget / 7),
        action: '3-Step Launch Checklist',
        steps: [
          { num: 1, task: 'Set up your ad (Day 1)', detail: `Meta Ads Manager → Objective: "Messages" → Daily budget: ₦${Math.round(budget / 7).toLocaleString()}` },
          { num: 2, task: 'Monitor first 24 hours (Day 2)', detail: `Record impressions & messages. Cost-per-message under ₦${Math.round(benchmarkCPS).toLocaleString()}? You're on track.` },
          { num: 3, task: 'Close hard for 72 hours (Day 3–4)', detail: 'Reply within 2 hours. Use WhatsApp script below. Track sales.' },
        ],
        nextButton: 'Launch Today',
      });
    } else {
      setResult({
        verdict: 'RISKY',
        title: '⚠️ Risky — Fix One Thing First',
        message: `You can run ads, but you'll likely overspend.`,
        flags: flags,
        action: 'Your Priority Fix',
        steps: flags.map((flag, idx) => ({
          num: idx + 1,
          task: flag.message,
          detail: 'Adjust your strategy before launching.',
        })),
        nextButton: 'Fixed — Run Again',
      });
    }
  };

  // INTRO
  if (phase === 'intro') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 p-6 flex items-center justify-center">
        <div className="max-w-2xl w-full bg-slate-800 border border-slate-700 rounded-lg p-8">
          <h1 className="text-4xl font-bold text-white mb-3">Before You Boost™</h1>
          <p className="text-lg text-slate-300 mb-6">The 90-second ad readiness check that tells you: Run / Risky / Don't Run</p>
          <p className="text-slate-400 mb-8">Stop wasting money on ads that won't convert. Answer 7 quick questions and get a clear verdict + action plan.</p>
          
          <button
            onClick={() => setPhase('phase1')}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition"
          >
            Start 90-Second Check →
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
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-2">Phase 1: Do You Pass?</h2>
            <p className="text-slate-400 text-sm">3 knockout questions.</p>
          </div>

          <div className="space-y-6 bg-slate-800 border border-slate-700 rounded-lg p-8">
            {/* Q1 */}
            <div className="border-b border-slate-700 pb-6">
              <label className="block text-white font-semibold mb-4">
                Have you sold this product/service organically (WhatsApp, DM, in-person) in the last 90 days?
              </label>
              <div className="space-y-2">
                {['yes', 'no'].map((opt) => (
                  <label key={opt} className="flex items-center p-3 border border-slate-600 rounded-lg hover:bg-slate-700 cursor-pointer">
                    <input
                      type="radio"
                      name="organicSales"
                      value={opt}
                      checked={answers.organicSales === opt}
                      onChange={(e) => updateAnswer('organicSales', e.target.value)}
                      className="mr-3 w-4 h-4"
                    />
                    <span className="text-white capitalize">{opt === 'yes' ? 'Yes, at least once' : 'No, never'}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Q2 */}
            {answers.organicSales === 'yes' && (
              <div className="border-b border-slate-700 pb-6">
                <label className="block text-white font-semibold mb-4">
                  How would you close a sale if someone messages you right now?
                </label>
                <div className="space-y-2">
                  {['whatsapp', 'phone', 'inperson', 'unsure'].map((opt) => (
                    <label key={opt} className="flex items-center p-3 border border-slate-600 rounded-lg hover:bg-slate-700 cursor-pointer">
                      <input
                        type="radio"
                        name="closingMethod"
                        value={opt}
                        checked={answers.closingMethod === opt}
                        onChange={(e) => updateAnswer('closingMethod', e.target.value)}
                        className="mr-3 w-4 h-4"
                      />
                      <span className="text-white">
                        {opt === 'whatsapp' && 'WhatsApp (I have it set up)'}
                        {opt === 'phone' && 'Phone call'}
                        {opt === 'inperson' && 'In-person'}
                        {opt === 'unsure' && 'Not sure yet'}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Q3 */}
            {answers.organicSales === 'yes' && answers.closingMethod && answers.closingMethod !== 'unsure' && (
              <div className="pb-6">
                <label className="block text-white font-semibold mb-4">
                  What's your total ad budget?
                </label>
                <input
                  type="number"
                  placeholder="Enter amount in ₦"
                  value={answers.budget || ''}
                  onChange={(e) => updateAnswer('budget', e.target.value)}
                  className="w-full bg-slate-700 border border-slate-600 text-white px-4 py-2 rounded-lg focus:outline-none focus:border-blue-500"
                />
                <p className="text-slate-400 text-sm mt-2">Minimum recommended: ₦2,000</p>
              </div>
            )}
          </div>

          <div className="flex gap-3 mt-8">
            <button
              onClick={() => setPhase('intro')}
              className="flex-1 bg-slate-700 hover:bg-slate-600 text-white font-bold py-3 px-6 rounded-lg transition"
            >
              Back
            </button>
            <button
              onClick={handlePhase1}
              disabled={!answers.organicSales || (answers.organicSales === 'yes' && !answers.closingMethod)}
              className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-lg transition"
            >
              Next →
            </button>
          </div>
        </div>
      </div>
    );
  }

  // PHASE 2
  if (phase === 'phase2') {
    const canProceed = !!(answers.priceRange && answers.expectedSales && answers.repeatBuy && answers.competition);
    
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 p-6">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-2">Phase 2: How Ready Are You?</h2>
            <p className="text-slate-400 text-sm">4 quick questions about your offer & market.</p>
          </div>

          <div className="space-y-6 bg-slate-800 border border-slate-700 rounded-lg p-8">
            {/* Q4 */}
            <div className="border-b border-slate-700 pb-6">
              <label className="block text-white font-semibold mb-4">What's your product price range?</label>
              <div className="space-y-2">
                {['500-2k', '2k-5k', '5k-15k', '15k+'].map((opt) => (
                  <label key={opt} className="flex items-center p-3 border border-slate-600 rounded-lg hover:bg-slate-700 cursor-pointer">
                    <input
                      type="radio"
                      name="priceRange"
                      value={opt}
                      checked={answers.priceRange === opt}
                      onChange={(e) => updateAnswer('priceRange', e.target.value)}
                      className="mr-3 w-4 h-4"
                    />
                    <span className="text-white">₦{opt}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Q5 */}
            <div className="border-b border-slate-700 pb-6">
              <label className="block text-white font-semibold mb-4">
                In a 7-day test, how many sales would make you happy?
              </label>
              <input
                type="number"
                placeholder="e.g., 3"
                value={answers.expectedSales || ''}
                onChange={(e) => updateAnswer('expectedSales', e.target.value)}
                className="w-full bg-slate-700 border border-slate-600 text-white px-4 py-2 rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Q6 */}
            <div className="border-b border-slate-700 pb-6">
              <label className="block text-white font-semibold mb-4">Is this a repeat purchase or one-time?</label>
              <div className="space-y-2">
                {['repeat', 'one-time'].map((opt) => (
                  <label key={opt} className="flex items-center p-3 border border-slate-600 rounded-lg hover:bg-slate-700 cursor-pointer">
                    <input
                      type="radio"
                      name="repeatBuy"
                      value={opt}
                      checked={answers.repeatBuy === opt}
                      onChange={(e) => updateAnswer('repeatBuy', e.target.value)}
                      className="mr-3 w-4 h-4"
                    />
                    <span className="text-white">
                      {opt === 'repeat' ? 'Repeat (they buy again)' : 'One-time (one sale per person)'}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Q7 */}
            <div className="pb-6">
              <label className="block text-white font-semibold mb-4">How crowded is your market?</label>
              <div className="space-y-2">
                {['Cold', 'Medium', 'Hot'].map((opt) => (
                  <label key={opt} className="flex items-center p-3 border border-slate-600 rounded-lg hover:bg-slate-700 cursor-pointer">
                    <input
                      type="radio"
                      name="competition"
                      value={opt}
                      checked={answers.competition === opt}
                      onChange={(e) => updateAnswer('competition', e.target.value)}
                      className="mr-3 w-4 h-4"
                    />
                    <span className="text-white">
                      {opt === 'Cold' && 'Cold (niche, few competitors)'}
                      {opt === 'Medium' && 'Medium (some competition)'}
                      {opt === 'Hot' && 'Hot (crowded, many competitors)'}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="flex gap-3 mt-8">
            <button
              onClick={() => setPhase('phase1')}
              className="flex-1 bg-slate-700 hover:bg-slate-600 text-white font-bold py-3 px-6 rounded-lg transition"
            >
              Back
            </button>
            <button
              onClick={handlePhase2}
              disabled={!canProceed}
              className={`flex-1 font-bold py-3 px-6 rounded-lg transition text-white ${
                canProceed 
                  ? 'bg-green-600 hover:bg-green-700 cursor-pointer' 
                  : 'bg-slate-600 cursor-not-allowed opacity-50'
              }`}
            >
              Get My Verdict →
            </button>
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
                <p className="text-slate-400 text-sm">Realistic Cost Per Sale</p>
                <p className="text-2xl font-bold text-green-400">₦{Math.round(result.benchmarks.benchmarkCPS).toLocaleString()}</p>
              </div>
              <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
                <p className="text-slate-400 text-sm">Your Expected Cost Per Sale</p>
                <p className={`text-2xl font-bold ${result.benchmarks.userCPS <= result.benchmarks.benchmarkCPS * 1.2 ? 'text-green-400' : 'text-yellow-400'}`}>
                  ₦{Math.round(result.benchmarks.userCPS).toLocaleString()}
                </p>
              </div>
              <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
                <p className="text-slate-400 text-sm">Recommended Daily Budget</p>
                <p className="text-2xl font-bold text-blue-400">₦{result.dailyBudget.toLocaleString()}/day</p>
              </div>
              <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
                <p className="text-slate-400 text-sm">Test Duration</p>
                <p className="text-2xl font-bold text-blue-400">7 days</p>
              </div>
            </div>
          )}

          {result.flags && result.flags.length > 0 && (
            <div className="bg-yellow-950 border border-yellow-600 rounded-lg p-6 mb-8">
              <h3 className="text-yellow-300 font-bold mb-4">⚠️ Issues to Fix:</h3>
              <ul className="space-y-2">
                {result.flags.map((flag, idx) => (
                  <li key={idx} className="text-yellow-200">
                    <span className="font-bold">{idx + 1}.</span> {flag.message}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="bg-slate-800 border border-slate-700 rounded-lg p-8 mb-8">
            <h3 className="text-white font-bold text-lg mb-6">{result.action}</h3>
            <div className="space-y-4">
              {result.steps.map((step) => (
                <div key={step.num} className="flex gap-4">
                  <div className="flex items-center justify-center h-8 w-8 rounded-full bg-blue-600 text-white font-bold flex-shrink-0">
                    {step.num}
                  </div>
                  <div className="flex-1">
                    <p className="text-white font-semibold">{step.task}</p>
                    <p className="text-slate-400 text-sm mt-1">{step.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => {
                setPhase('intro');
                setAnswers({
                  organicSales: null,
                  closingMethod: null,
                  budget: null,
                  priceRange: null,
                  expectedSales: null,
                  repeatBuy: null,
                  competition: null,
                });
                setResult(null);
              }}
              className="flex-1 bg-slate-700 hover:bg-slate-600 text-white font-bold py-3 px-6 rounded-lg transition"
            >
              Start Over
            </button>
            <a
              href="https://paystack.com/pay/beforeyouboost"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition text-center"
            >
              {result.nextButton}
            </a>
          </div>
        </div>
      </div>
    );
  }
}
