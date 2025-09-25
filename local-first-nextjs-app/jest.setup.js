import "@testing-library/jest-dom";

const FDBFactory = require("fake-indexeddb/lib/FDBFactory");
const FDBKeyRange = require("fake-indexeddb/lib/FDBKeyRange");

global.indexedDB = new FDBFactory();
global.IDBKeyRange = FDBKeyRange;

Object.defineProperty(navigator, "onLine", {
  writable: true,
  value: true,
});

const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};

global.localStorage = localStorageMock;
