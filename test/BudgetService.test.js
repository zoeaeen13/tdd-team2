import { BudgetService } from "../src/BudgetService";
import dayJS from "dayjs";
import { BudgetRepo, Budget } from "../src/BudgetRepo";

// jest.mock("../src/BudgetRepo.js");

describe("BudgeService Test", () => {
  let budgetService = new BudgetService();

  const givenBudgetData = (budgetData) => {
    budgetService.getAll = () => [
        new Budget("202301", 3100),
      new Budget("202302", 28),
      new Budget("202303", 310),
    ];
  };

  beforeAll(() => {
    budgetService = new BudgetService();
  });

  beforeEach(() => {
    // BudgetRepo.mockClear();
  });

  it("should be full-month budget", () => {
    givenBudgetData();
    const total = budgetService.query(dayJS("2023-03-01"), dayJS("2023-03-31"));
    expect(total).toBe(310);
  });

  it("should be partial-month budget", () => {
    givenBudgetData();
    const total = budgetService.query(dayJS("2023-02-02"), dayJS("2023-02-28"));
    expect(total).toBe(27);
  });

  it("should be cross-month budget", () => {
    givenBudgetData();
    const total = budgetService.query(dayJS("2023-01-01"), dayJS("2023-03-15"));
    expect(total).toBe(3278);
  });

  it("should be cross-month budget with missing month", () => {
    givenBudgetData();
    const total = budgetService.query(dayJS("2023-01-01"), dayJS("2023-04-15"));
    expect(total).toBe(3438);
  });

  it("should be wrong duration", () => {
    givenBudgetData();
    const total = budgetService.query(dayJS("2023-02-01"), dayJS("2023-01-15"));
    expect(total).toBe(0);
  });
});
