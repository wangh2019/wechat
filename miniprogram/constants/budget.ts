export const ACCOUNT_DEFINITIONS = [
  { key: "living", name: "基础生活" },
  { key: "career", name: "事业增收" },
  { key: "investment", name: "投资资产" },
  { key: "learning", name: "学习成长" },
  { key: "health", name: "健康身体" },
  { key: "family", name: "家庭关系" },
  { key: "social", name: "社交连接" },
  { key: "giving", name: "助人公益" },
  { key: "future", name: "安全与目标" }
];

export const BUDGET_MODES = [
  { key: "balanced", name: "平衡生活型" },
  { key: "saving", name: "高储蓄型" },
  { key: "career", name: "事业成长型" },
  { key: "family", name: "家庭优先型" }
];

export const BUDGET_PRESETS = {
  balanced: {
    living: 35,
    career: 8,
    investment: 12,
    learning: 6,
    health: 6,
    family: 8,
    social: 4,
    giving: 1,
    future: 20
  },
  saving: {
    living: 30,
    career: 8,
    investment: 10,
    learning: 5,
    health: 5,
    family: 6,
    social: 2,
    giving: 1,
    future: 33
  },
  career: {
    living: 32,
    career: 12,
    investment: 15,
    learning: 8,
    health: 7,
    family: 7,
    social: 4,
    giving: 1,
    future: 14
  },
  family: {
    living: 35,
    career: 6,
    investment: 10,
    learning: 5,
    health: 6,
    family: 15,
    social: 5,
    giving: 1,
    future: 17
  }
};

export function getAccountName(key) {
  const account = ACCOUNT_DEFINITIONS.find((item) => item.key === key);
  return account ? account.name : key;
}

export function getModeName(key) {
  const mode = BUDGET_MODES.find((item) => item.key === key);
  return mode ? mode.name : key;
}
