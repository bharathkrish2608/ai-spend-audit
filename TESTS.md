# TESTS.md

## Automated Tests

All tests are in `src/audit-engine/auditEngine.test.js`

**Run tests:**
```bash
npm run test
```

## Test Coverage

### Test 1 — Business plan overkill for small team
**File:** `src/audit-engine/auditEngine.test.js`
**What it covers:** Cursor Business plan with 2 users triggers a downgrade recommendation with $40/month savings
**Result:** ✅ Passing

### Test 2 — Enterprise overkill detection
**File:** `src/audit-engine/auditEngine.test.js`
**What it covers:** Claude Enterprise plan with 5 users triggers a downgrade recommendation
**Result:** ✅ Passing

### Test 3 — Optimal plan detection
**File:** `src/audit-engine/auditEngine.test.js`
**What it covers:** Cursor Pro with 1 user returns isOptimal true and zero savings
**Result:** ✅ Passing

### Test 4 — Redundant tool overlap
**File:** `src/audit-engine/auditEngine.test.js`
**What it covers:** Paying for both ChatGPT and Claude for same use case flags redundancy
**Result:** ✅ Passing

### Test 5 — Savings math accuracy
**File:** `src/audit-engine/auditEngine.test.js`
**What it covers:** Total monthly savings of $40 and annual savings of $480 calculated correctly
**Result:** ✅ Passing
