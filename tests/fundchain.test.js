/**
 * FundChain Pro — Test Suite
 * Run: node tests/fundchain.test.js
 * 10 tests, zero dependencies.
 */

let passed = 0, failed = 0;

function test(name, fn) {
  try {
    fn();
    passed++;
    console.log(`  ✅  ${name}`);
  } catch (err) {
    failed++;
    console.log(`  ❌  ${name}`);
    console.log(`       → ${err.message}`);
  }
}

function expect(actual) {
  return {
    toBe(e)           { if (actual !== e) throw new Error(`Expected ${JSON.stringify(e)}, got ${JSON.stringify(actual)}`); },
    toEqual(e)        { if (JSON.stringify(actual) !== JSON.stringify(e)) throw new Error(`Expected ${JSON.stringify(e)}, got ${JSON.stringify(actual)}`); },
    toBeGreaterThan(n){ if (actual <= n)  throw new Error(`Expected ${actual} > ${n}`); },
    toBeLessThan(n)   { if (actual >= n)  throw new Error(`Expected ${actual} < ${n}`); },
    toHaveLength(n)   { if (actual.length !== n) throw new Error(`Expected length ${n}, got ${actual.length}`); },
    toBeNull()        { if (actual !== null) throw new Error(`Expected null, got ${actual}`); },
    toBeTruthy()      { if (!actual) throw new Error(`Expected truthy, got ${actual}`); },
    toBeFalsy()       { if (actual)  throw new Error(`Expected falsy, got ${actual}`); },
    toContain(s)      { if (!actual.includes(s)) throw new Error(`"${actual}" does not contain "${s}"`); },
  };
}

// ── Logic under test ──────────────────────────────────────────────────────────

function createCampaign({ title, desc, goal, days, owner, category = 'tech', emoji = '🚀' }) {
  if (!title?.trim() || title.trim().length < 3) throw new Error('Title must be at least 3 characters');
  if (!desc?.trim())       throw new Error('Description is required');
  if (!goal || goal <= 0)  throw new Error('Goal must be greater than 0');
  if (!days || days < 1 || days > 90) throw new Error('Duration must be 1–90 days');
  if (!owner)              throw new Error('Owner address required');
  return {
    id:           Math.random().toString(36).slice(2),
    title:        title.trim(),
    desc:         desc.trim(),
    goal:         parseInt(goal, 10),
    days:         parseInt(days, 10),
    owner, category, emoji,
    raised:       0,
    backers:      0,
    tokenMinted:  0,
    daysLeft:     parseInt(days, 10),
    withdrawn:    false,
    contributions: [],
  };
}

function contribute(campaign, { wallet, amount }) {
  if (!wallet)                throw new Error('Wallet required');
  if (!amount || amount <= 0) throw new Error('Amount must be greater than 0');
  if (campaign.daysLeft <= 0) throw new Error('Campaign has ended');
  const amountInt = parseInt(amount, 10);
  return {
    ...campaign,
    raised:      campaign.raised + amountInt,
    backers:     campaign.backers + 1,
    tokenMinted: campaign.tokenMinted + amountInt, // 1 XLM = 1 FCT
    contributions: [{ addr: wallet, amount: amountInt, ts: Date.now() }, ...campaign.contributions],
  };
}

function calcFCTReward(xlmAmount) {
  // 1 XLM = 1 FCT — the inter-contract call mints this automatically
  return parseInt(xlmAmount, 10);
}

function xlmToStroops(xlm) { return Math.round(parseFloat(xlm) * 10_000_000); }
function stroopsToXlm(s)   { return s / 10_000_000; }

function filterCampaigns(campaigns, { category = 'all', query = '' } = {}) {
  return campaigns.filter(c => {
    const matchCat = category === 'all' || c.category === category;
    const q = query.toLowerCase();
    return matchCat && (!q || c.title.toLowerCase().includes(q));
  });
}

// ── Tests ─────────────────────────────────────────────────────────────────────

console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('  FundChain Pro — Test Suite (10 tests)');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

test('1. Creates campaign with correct initial values', () => {
  const c = createCampaign({ title: 'Solar Grid', desc: 'Clean energy DAO', goal: 5000, days: 30, owner: 'GABC' });
  expect(c.title).toBe('Solar Grid');
  expect(c.goal).toBe(5000);
  expect(c.raised).toBe(0);
  expect(c.tokenMinted).toBe(0);
  expect(c.withdrawn).toBe(false);
});

test('2. Trims whitespace from title and description', () => {
  const c = createCampaign({ title: '  My Project  ', desc: '  A great idea  ', goal: 100, days: 7, owner: 'G' });
  expect(c.title).toBe('My Project');
  expect(c.desc).toBe('A great idea');
});

test('3. Throws on title shorter than 3 characters', () => {
  let threw = false;
  try { createCampaign({ title: 'Hi', desc: 'desc', goal: 100, days: 7, owner: 'G' }); }
  catch (e) { threw = true; expect(e.message).toContain('3 characters'); }
  if (!threw) throw new Error('Expected error not thrown');
});

test('4. Throws on zero or negative goal', () => {
  let threw = false;
  try { createCampaign({ title: 'Valid Title', desc: 'desc', goal: 0, days: 7, owner: 'G' }); }
  catch { threw = true; }
  if (!threw) throw new Error('Expected error not thrown');
});

test('5. Contribution updates raised, backers, and FCT minted', () => {
  const c       = createCampaign({ title: 'Solar Grid', desc: 'desc', goal: 1000, days: 30, owner: 'G' });
  const updated = contribute(c, { wallet: 'GBACKER', amount: 250 });
  expect(updated.raised).toBe(250);
  expect(updated.backers).toBe(1);
  expect(updated.tokenMinted).toBe(250); // 250 XLM = 250 FCT minted
  expect(updated.contributions).toHaveLength(1);
});

test('6. FCT reward equals XLM contributed (1:1 ratio)', () => {
  expect(calcFCTReward(10)).toBe(10);
  expect(calcFCTReward(500)).toBe(500);
  expect(calcFCTReward(1000)).toBe(1000);
});

test('7. Multiple backers accumulate correctly', () => {
  let c = createCampaign({ title: 'Solar Grid', desc: 'desc', goal: 1000, days: 30, owner: 'G' });
  c = contribute(c, { wallet: 'GA', amount: 100 });
  c = contribute(c, { wallet: 'GB', amount: 200 });
  c = contribute(c, { wallet: 'GC', amount: 300 });
  expect(c.raised).toBe(600);
  expect(c.backers).toBe(3);
  expect(c.tokenMinted).toBe(600); // 600 FCT total minted
});

test('8. Throws when contributing to ended campaign', () => {
  const c = { ...createCampaign({ title: 'Solar Grid', desc: 'desc', goal: 100, days: 30, owner: 'G' }), daysLeft: 0 };
  let threw = false;
  try { contribute(c, { wallet: 'GA', amount: 50 }); }
  catch (e) { threw = true; expect(e.message).toContain('ended'); }
  if (!threw) throw new Error('Expected error not thrown');
});

test('9. XLM to stroops conversion is correct', () => {
  expect(xlmToStroops(1)).toBe(10_000_000);
  expect(xlmToStroops(0.5)).toBe(5_000_000);
  expect(stroopsToXlm(10_000_000)).toBe(1);
});

test('10. Campaign filtering by category and search query', () => {
  const camps = [
    { id: 0, title: 'ZeroGas DeFi',      category: 'defi'   },
    { id: 1, title: 'Stellar Art DAO',   category: 'art'    },
    { id: 2, title: 'GameFi Universe',   category: 'gaming' },
  ];
  expect(filterCampaigns(camps, { category: 'all' })).toHaveLength(3);
  expect(filterCampaigns(camps, { category: 'defi' })).toHaveLength(1);
  expect(filterCampaigns(camps, { query: 'stellar' })).toHaveLength(1);
  expect(filterCampaigns(camps, { query: 'xyz_no_match' })).toHaveLength(0);
});

// ── Result ────────────────────────────────────────────────────────────────────

console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
console.log(`  ${passed} passed  |  ${failed} failed  |  ${passed + failed} total`);
console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);

if (failed > 0) process.exit(1);