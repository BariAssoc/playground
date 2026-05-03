#!/usr/bin/env bash
#
# audit-verify.sh — Pre-flight self-test for BariAccess scaffold integration
#
# Run this first when you pick up the scaffold. It verifies:
#   1. Node.js version (>= 20)
#   2. Dependencies installed
#   3. Source typechecks
#   4. Tests typecheck
#   5. Pre-ship gates pass (G5 HIPAA + G6 safety)
#   6. Full test suite passes
#
# If any step fails, you'll see exactly what to fix.

set -e
set -o pipefail

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo ""
echo "═══════════════════════════════════════════════════════════════════"
echo "  BariAccess Platform — Audit-Verify Pre-Flight"
echo "  Audit revision: 2026-05-03"
echo "═══════════════════════════════════════════════════════════════════"
echo ""

# ─────────────────────────────────────────────────────────────────────────────
# Step 1: Node version
# ─────────────────────────────────────────────────────────────────────────────
echo -e "${YELLOW}[1/6]${NC} Checking Node.js version..."

if ! command -v node &> /dev/null; then
  echo -e "${RED}✗ Node.js is not installed${NC}"
  exit 1
fi

NODE_VERSION=$(node -v | sed 's/v//' | cut -d. -f1)
if [ "$NODE_VERSION" -lt 20 ]; then
  echo -e "${RED}✗ Node.js 20+ required (found: $(node -v))${NC}"
  exit 1
fi
echo -e "${GREEN}✓ Node.js $(node -v) OK${NC}"

# ─────────────────────────────────────────────────────────────────────────────
# Step 2: Dependencies
# ─────────────────────────────────────────────────────────────────────────────
echo ""
echo -e "${YELLOW}[2/6]${NC} Checking dependencies..."

if [ ! -d "node_modules" ]; then
  echo -e "${YELLOW}  node_modules missing — running npm install${NC}"
  npm install --silent
fi

if [ ! -d "node_modules/typescript" ] || [ ! -d "node_modules/jest" ] || [ ! -d "node_modules/ts-jest" ]; then
  echo -e "${RED}✗ Required dependencies missing — run: npm install${NC}"
  exit 1
fi
echo -e "${GREEN}✓ Dependencies installed${NC}"

# ─────────────────────────────────────────────────────────────────────────────
# Step 3: Source typecheck
# ─────────────────────────────────────────────────────────────────────────────
echo ""
echo -e "${YELLOW}[3/6]${NC} Typechecking source..."

if ! npx tsc --noEmit -p tsconfig.json &> /tmp/tsc-source.log; then
  echo -e "${RED}✗ Source typecheck FAILED${NC}"
  cat /tmp/tsc-source.log
  exit 1
fi
echo -e "${GREEN}✓ Source compiles with strict mode${NC}"

# ─────────────────────────────────────────────────────────────────────────────
# Step 4: Test typecheck
# ─────────────────────────────────────────────────────────────────────────────
echo ""
echo -e "${YELLOW}[4/6]${NC} Typechecking tests..."

if ! npx tsc --noEmit -p tsconfig.test.json &> /tmp/tsc-tests.log; then
  echo -e "${RED}✗ Test typecheck FAILED${NC}"
  cat /tmp/tsc-tests.log
  exit 1
fi
echo -e "${GREEN}✓ Tests compile with strict mode${NC}"

# ─────────────────────────────────────────────────────────────────────────────
# Step 5: Pre-ship gates
# ─────────────────────────────────────────────────────────────────────────────
echo ""
echo -e "${YELLOW}[5/6]${NC} Running pre-ship gates..."

echo "  Running G5 HIPAA redaction tests (T1-T12)..."
if ! NODE_OPTIONS='--experimental-vm-modules' npx jest tests/acceptance/g5-hipaa-redaction.test.ts --silent --no-coverage &> /tmp/g5.log; then
  echo -e "${RED}✗ G5 HIPAA gate FAILED — DO NOT SHIP${NC}"
  cat /tmp/g5.log | tail -30
  exit 1
fi
echo -e "${GREEN}  ✓ G5 HIPAA gate green${NC}"

echo "  Running G6 safety escalation tests (MW-T1..MW-T8)..."
if ! NODE_OPTIONS='--experimental-vm-modules' npx jest tests/acceptance/g6-safety-escalation.test.ts --silent --no-coverage &> /tmp/g6.log; then
  echo -e "${RED}✗ G6 safety gate FAILED — DO NOT SHIP${NC}"
  cat /tmp/g6.log | tail -30
  exit 1
fi
echo -e "${GREEN}  ✓ G6 safety gate green${NC}"

# ─────────────────────────────────────────────────────────────────────────────
# Step 6: Full test suite
# ─────────────────────────────────────────────────────────────────────────────
echo ""
echo -e "${YELLOW}[6/6]${NC} Running full test suite..."

if ! NODE_OPTIONS='--experimental-vm-modules' npx jest --silent --no-coverage &> /tmp/full.log; then
  echo -e "${RED}✗ Full test suite has failures${NC}"
  cat /tmp/full.log | tail -40
  exit 1
fi

# Summary line
SUMMARY=$(grep -E "Tests:|Test Suites:" /tmp/full.log | tail -2)
echo -e "${GREEN}✓ Full suite passing${NC}"
echo "$SUMMARY" | sed 's/^/    /'

# ─────────────────────────────────────────────────────────────────────────────
# Done
# ─────────────────────────────────────────────────────────────────────────────
echo ""
echo "═══════════════════════════════════════════════════════════════════"
echo -e "  ${GREEN}✅ ALL CHECKS PASSED${NC}"
echo "═══════════════════════════════════════════════════════════════════"
echo ""
echo "Next steps:"
echo "  1. Read CHANGELOG-AUDIT-2026-05-03.md (the audit revision record)"
echo "  2. Read ZAKIY-START-HERE.md (your onboarding doc)"
echo "  3. Review canon docs in your team archive"
echo "  4. Start integration work"
echo ""
