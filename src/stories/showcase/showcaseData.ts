// src/stories/showcase/showcaseData.ts
//
// Mock data for the Showcase demos. Mock only — nothing here touches a network.

export const selectOptions = [
  { value: "1", label: "Option one" },
  { value: "2", label: "Option two" },
  { value: "3", label: "Option three" },
];

export const cascaderOptions = [
  { value: "ua", label: "Ukraine", children: [{ value: "kyiv", label: "Kyiv" }] },
  { value: "pl", label: "Poland", children: [{ value: "waw", label: "Warsaw" }] },
];

// `key` AND `value`: Tree reads `key`, TreeSelect reads `value`. Give both or
// TreeSelect logs "TreeNode value is invalidate: undefined".
export const treeData = [
  {
    title: "Parent",
    key: "0",
    value: "0",
    children: [
      { title: "Child A", key: "0-0", value: "0-0" },
      { title: "Child B", key: "0-1", value: "0-1" },
    ],
  },
];

export const transferData = Array.from({ length: 6 }, (_, i) => ({
  key: String(i),
  title: `Item ${i + 1}`,
}));

export const tableRows = [
  { key: 1, name: "Row one", status: "active", amount: 1200 },
  { key: 2, name: "Row two", status: "paused", amount: 3400 },
  { key: 3, name: "Row three", status: "active", amount: 560 },
];

export const listyItems = Array.from({ length: 5 }, (_, i) => ({ id: i, label: `Listy item ${i + 1}` }));
export const listyManyItems = Array.from({ length: 50 }, (_, i) => ({ id: i, label: `Virtual row ${i + 1}` }));

export const masonryItems = [
  { key: 1, height: 60 },
  { key: 2, height: 100 },
  { key: 3, height: 80 },
  { key: 4, height: 120 },
  { key: 5, height: 70 },
  { key: 6, height: 90 },
];

// Module-level so it is computed once, not on every render (react-hooks/purity
// forbids Date.now() inside a component). One hour ahead of when the story loads.
export const countdownTarget = Date.now() + 1000 * 60 * 60;
