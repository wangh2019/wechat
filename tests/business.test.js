const assert = require("assert");
const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const cache = new Map();

function requireTs(request, baseDir = path.join(root, "miniprogram")) {
  const filename = path.resolve(baseDir, request.endsWith(".ts") ? request : `${request}.ts`);
  if (cache.has(filename)) {
    return cache.get(filename).exports;
  }

  const module = { exports: {} };
  cache.set(filename, module);

  let code = fs.readFileSync(filename, "utf8");
  const exportNames = [];

  code = code.replace(/import\s+type\s+\{[^}]+\}\s+from\s+["'][^"']+["'];?/g, "");
  code = code.replace(/import\s+\{([^}]+)\}\s+from\s+["']([^"']+)["'];?/g, (_match, names, source) => {
    return `const { ${names.trim()} } = requireTs(${JSON.stringify(source)}, ${JSON.stringify(path.dirname(filename))});`;
  });
  code = code.replace(/export\s+function\s+([A-Za-z0-9_]+)/g, (_match, name) => {
    exportNames.push(name);
    return `function ${name}`;
  });
  code = code.replace(/export\s+const\s+([A-Za-z0-9_]+)/g, (_match, name) => {
    exportNames.push(name);
    return `const ${name}`;
  });
  code += `\nmodule.exports = { ${exportNames.join(", ")} };\n`;

  const runner = new Function("module", "exports", "requireTs", code);
  runner(module, module.exports, requireTs);
  return module.exports;
}

const { BUDGET_PRESETS } = requireTs("./constants/budget");
const { yuanToCents, centsToYuan, formatCurrency } = requireTs("./utils/money");
const { calculateAccountBudgets, presetTotalPercent } = requireTs("./utils/budget");
const { summarizeTransactions } = requireTs("./utils/summary");

Object.keys(BUDGET_PRESETS).forEach((mode) => {
  assert.strictEqual(presetTotalPercent(mode), 100, `${mode} should total 100%`);
});

assert.strictEqual(yuanToCents("129.90"), 12990);
assert.strictEqual(yuanToCents("7,000"), 700000);
assert.strictEqual(centsToYuan(12990), "129.90");
assert.strictEqual(formatCurrency(700000), "¥7,000");
assert.strictEqual(formatCurrency(12990), "¥129.90");

const balanced = calculateAccountBudgets(2000000, "balanced");
assert.strictEqual(balanced.find((item) => item.key === "living").budgetCents, 700000);
assert.strictEqual(balanced.find((item) => item.key === "future").budgetCents, 400000);
assert.strictEqual(balanced.reduce((sum, item) => sum + item.budgetCents, 0), 2000000);

const transactions = [
  { id: "1", amountCents: 235000, accountKey: "living", date: "2026-09-01" },
  { id: "2", amountCents: 9900, accountKey: "health", date: "2026-09-02" },
  { id: "3", amountCents: 10000, accountKey: "living", date: "2026-09-03" }
];
const summary = summarizeTransactions(transactions);
assert.strictEqual(summary.totalSpentCents, 254900);
assert.strictEqual(summary.usedByAccount.living, 245000);
assert.strictEqual(summary.usedByAccount.health, 9900);

const afterDelete = summarizeTransactions(transactions.filter((item) => item.id !== "1"));
assert.strictEqual(afterDelete.totalSpentCents, 19900);
assert.strictEqual(afterDelete.usedByAccount.living, 10000);

console.log("business tests passed");
