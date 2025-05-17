// This file is automatically included by jest
import "@testing-library/jest-dom";

// Mock global properties not available in test environment
global.matchMedia =
  global.matchMedia ||
  function () {
    return {
      matches: false,
      addListener: jest.fn(),
      removeListener: jest.fn(),
    };
  };

// Mock the moment timezone to avoid warnings
jest.mock("moment", () => {
  const moment = jest.requireActual("moment");
  return moment;
});
