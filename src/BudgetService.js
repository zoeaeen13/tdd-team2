import dayjs from "dayjs";
import isBetween from "dayJS/plugin/isBetween";
import { Budget, BudgetRepo } from "./BudgetRepo";

dayjs.extend(isBetween);

export class BudgetService {
  budgeRepo = new BudgetRepo();

  constructor() {}

  getAll() {
    return [];
  }

  getBudgetDataInDuration(start, end) {
    const startYearMonth = dayjs(start).format("YYYYMM");
    const endYearMonth = dayjs(end).format("YYYYMM");
    const durationByMonth =
      dayjs(endYearMonth).diff(dayjs(startYearMonth), "month", true) + 1;
    const data = this.getAll();
    const budgetDataInDuration = data.filter((item) => {
      const result = dayjs(item.year_month).isBetween(
        dayjs(startYearMonth),
        dayjs(endYearMonth),
        "month", '[]'
      );

      return result;
    });
    // budgetDataInDuration.

    return { durationByMonth, budgetDataInDuration };
  }

  query(start, end) {
    try {
      let total = 0;

      const { durationByMonth, budgetDataInDuration } =
        this.getBudgetDataInDuration(start, end);
      for (let i = 0; i < durationByMonth; i++) {
        const budgetForMonth = budgetDataInDuration[i] ? budgetDataInDuration[i].amount : 0
        const budgetPerDay =
            budgetForMonth /
          dayjs(start).add(i, "month").daysInMonth();
        // 第一個月
        if (i === 0) {
          const lastDate = durationByMonth > 1 ? dayjs(start).daysInMonth() : dayjs(end).date()
          total += (lastDate - dayjs(start).date() + 1) * budgetPerDay
        } else if (i === durationByMonth - 1) {
          // 最後一個月
          total += dayjs(end).date() * budgetPerDay;
        } else {
          // 直接+足月的 budget
          total += budgetDataInDuration[i].amount;
        }
      }
      return total;
    } catch (error) {
      console.log("error: ", error);
    }
  }
}