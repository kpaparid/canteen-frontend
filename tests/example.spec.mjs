import { test, expect } from "@playwright/test";
import { parse } from "date-fns";
// const { parse } = require("@date-fns");
import { calcInterval, getDuration } from "../utilities/utils.mjs";

const parser = (date) => parse(date, "HH:mm", new Date());
test("first test", ({}) => {
  expect(0).toBe(0);
  expect(getDuration(new Date(), new Date())).toStrictEqual({
    moment: { value: "now" },
  });
  expect(getDuration(parser("15:00"), parser("15:10"))).toStrictEqual({
    minutes: { value: 10, unit: "min" },
  });
  expect(getDuration(parser("20:30"), parser("15:25"))).toStrictEqual({
    moment: { value: "now" },
  });
  expect(getDuration(parser("14:00"), parser("15:15"))).toStrictEqual({
    minutes: { value: 75, unit: "min" },
  });
  expect(getDuration(parser("14:00"), parser("16:15"))).toStrictEqual({
    hours: { value: 2, unit: "hours" },
    minutes: { value: 15, unit: "min" },
  });
  // expect(getDuration(parser("14:00"), parser("15:15"))).toBe(75);
});
