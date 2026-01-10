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
        message: 'If someone messages you excited about your product, can you actually close them? Right now, the answer is unclear.',
        action: 'Set Up WhatsApp (Free, 30 mins)',
        steps: [
          { num: 1, task: 'Download WhatsApp Business', detail: 'Free app on Android/iPhone. Takes 5 minutes.' },
          { num: 2, task: 'Set up 3 auto-replies', detail: '"Thanks for your interest. What would you like to know?" + product details + payment method.' },
          { num: 3, task: 'Assign someone to reply within 2 hours', detail: 'This is your closer. They need to be fast.' },
          { num: 4, task: 'Come back here', detail: 'Once set up, run the tracker again.' },
        ],
        templates: {
          title: 'Quick WhatsApp Auto-Replies to Copy',
          items: [
            { trigger: 'First message', reply: 'Thanks for reaching out! 👋 I\'m [Your Name]. What would you like to know about [Product]?' },
            { trigger: 'Price question', reply: '[Product] is ₦[PRICE]. It includes [main benefit]. We have [X] customers. Happy to answer more questions.' },
            { trigger: 'How to buy', reply: 'Simple: 1️⃣ Confirm you want it 2️⃣ Send ₦[PRICE] to [payment method] 3️⃣ We send it [same day/next day]. Want to proceed?' },
          ],
        },
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
        message: `Your expected CPS is ₦${Math.round(userCPS).toLocaleString()}, but ₦${Math.round(benchmarkCPS).toLocaleString()} is realistic for your price point. Expectations may be too high.`,
      });
      verdict = 'RISKY';
    }

    if (answers.competition === 'Hot' && budget < 5000) {
      flags.push({
        type: 'market',
        message: 'You\'re in a crowded market (hot competition) with a tight budget. You\'ll need a strong unique angle to stand out.',
      });
      verdict = 'RISKY';
    }

    if (answers.repeatBuy === 'one-time' && budget < 3000) {
      flags.push({
        type: 'model',
        message: 'One-time purchases need larger budgets to break even. Consider selling to existing customers first (repeat sales).',
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
          { num: 1, task: 'Set up your ad (Day 1)', detail: `Go to Meta Ads Manager → Objective: "Messages" → Audience: [City + interest] → Daily budget: ₦${Math.round(budget / 7).toLocaleString()} → Image + headline (use template below)` },
          { num: 2, task: 'Monitor first 24 hours (Day 2)', detail: `Record impressions & messages. If cost-per-message is under ₦${Math.round(benchmarkCPS).toLocaleString()}, you're on track. If higher, pause and rewrite headline.` },
          { num: 3, task: 'Close hard for 72 hours (Day 3–4)', detail: 'Your closer must reply within 2 hours. Use the WhatsApp script below. Track how many become sales.' },
        ],
        templates: {
          title: 'Ad Copy & WhatsApp Script (Copy These)',
          items: [
            { type: 'headline', label: 'Facebook Headline', content: `Get [Main Benefit] in [Time Frame] → ₦${answers.priceRange}` },
            { type: 'whatsapp', label: 'WhatsApp Opener', content: 'Hey! 👋 Thanks for your interest in [Product]. Quick question: what drew you here?' },
            { type: 'whatsapp', label: 'Objection: "How do I know it works?"', content: 'Great question. [Insert one social proof: # of customers / result they got / comparison to alternative]. Also, [insert guarantee or trial offer].' },
            { type: 'whatsapp', label: 'Close', content: 'I can get this to you [same day/next day]. Send ₦[PRICE] to [payment method] and we\'re locked in. Yes?' },
          ],
        },
        monitoring: {
          title: '72-Hour Monitoring Checklist',
          items: [
            { time: '24h', check: `Cost per message < ₦${Math.round(benchmarkCPS).toLocaleString()}?`, action: 'Yes → keep running. No → pause, rewrite headline.' },
            { time: '48h', check: 'Have you gotten at least 3 messages?', action: 'Yes → on track. No → audience might be too narrow. Expand.' },
            { time: '72h', check: 'How many became sales?', action: 'More than expected? Scale budget 20%. Less? Improve script.' },
          ],
        },
        nextButton: 'Launch Today',
      });
    } else {
      setResult({
        verdict: 'RISKY',
        title: '⚠️ Risky — Fix One Thing First',
        message: `You can run ads, but you'll likely overspend. Fix this first:`,
        flags: flags,
        action: 'Your Priority Fix',
        steps: flags.map((flag, idx) => ({
          num: idx + 1,
          task: flag.message,
          detail: flag.type === 'budget' ? 'Lower your expected sales target or increase budget.' : flag.type === 'market' ? 'Rewrite your ad with a unique angle (e.g., "Not like [competitor]")' : 'Sell to 5 existing customers first to prove model before spending on cold ads.',
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

          <div className="mt-8 pt-8 border-t border-slate-700">
            <h2 className="text-white font-bold mb-4">What You'll Get</h2>
            <ul className="text-slate-300 space-y-2 text-sm">
              <li>✅ Clear verdict: Run / Risky / Don't Run</li>
              <li>✅ Realistic cost-per-sale for your product</li>
              <li>✅ Step-by-step launch checklist</li>
              <li>✅ Copy-paste WhatsApp & ad templates</li>
              <li>✅ 72-hour monitoring plan</li>
            </ul>
          </div>
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
            <p className="text-slate-400 text-sm">3 knockout questions. If you fail any, we stop here (and tell you what to fix).</p>
          </div>

          <div className="space-y-6 bg-slate-800 border border-slate-700 rounded-lg p-8">
            {/* Q1 */}
            <div className="border-b border-slate-700 pb-6 last:border-b-0">
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
              disabled={!answers.organicSales}
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
              disabled={!answers.priceRange || !answers.expectedSales || !answers.repeatBuy || !answers.competition}
              className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-slate-600 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-lg transition"
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
          {/* Header */}
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

          {/* Benchmarks */}
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

          {/* Flags */}
          {result.flags && result.flags.length > 0 && (
            <div className="bg-yellow-950 border border-yellow-600 rounded-lg p-6 mb-8">
              <h3 className="text-yellow-300 font-bold mb-4">⚠️ Issues to Fix:</h3>
              <ul className="space-y-2">
                {result.flags.map((flag, idx) => (
                  <li key={idx} className="text-yellow-200 flex gap-2">
                    <span className="font-bold">{idx + 1}.</span>
                    <span>{flag.message}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Action Plan */}
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-8 mb-8">
            <h3 className="text-white font-bold text-lg mb-6">{result.action}</h3>
            <div className="space-y-4">
              {result.steps.map((step) => (
                <div key={step.num} className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-8 w-8 rounded-full bg-blue-600 text-white font-bold">
                      {step.num}
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className="text-white font-semibold">{step.task}</p>
                    <p className="text-slate-400 text-sm mt-1">{step.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Templates */}
          {result.templates && (
            <div className="bg-slate-800 border border-slate-700 rounded-lg p-8 mb-8">
              <h3 className="text-white font-bold text-lg mb-6">{result.templates.title}</h3>
              <div className="space-y-4">
                {result.templates.items.map((item, idx) => (
                  <div key={idx} className="bg-slate-900 rounded-lg p-4 border border-slate-600">
                    <p className="text-slate-400 text-xs font-semibold mb-2">{item.trigger || item.label}</p>
                    <p className="text-white font-mono text-sm bg-slate-950 p-3 rounded border border-slate-700 overflow-auto">
                      {item.reply || item.content}
                    </p>
                    <button
                      onClick={() => navigator.clipboard.writeText(item.reply || item.content)}
                      className="text-blue-400 text-xs mt-2 hover:text-blue-300"
                    >
                      Copy →
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Monitoring */}
          {result.monitoring && (
            <div className="bg-slate-800 border border-slate-700 rounded-lg p-8 mb-8">
              <h3 className="text-white font-bold text-lg mb-6">{result.monitoring.title}</h3>
              <div className="space-y-3">
                {result.monitoring.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-start p-3 bg-slate-900 rounded-lg border border-slate-600">
                    <div>
                      <p className="text-white font-semibold">{item.time}</p>
                      <p className="text-slate-400 text-sm">{item.check}</p>
                    </div>
                    <p className="text-slate-300 text-sm text-right">{item.action}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* CTA */}
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
  href="https://paystack.shop/pay/beforeyouboost-lifetime"
  target="_blank"
  rel="noopener noreferrer"
  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition text-center"
>
  Lifetime Access ₦3500
</a>
<a
  href="https://paystack.shop/pay/beforeyouboost-community"
  target="_blank"
  rel="noopener noreferrer"
  className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition text-center"
>
  Community Membership ₦2k/month
</a>
          </div>
        </div>
      </div>
    );
  }
}
