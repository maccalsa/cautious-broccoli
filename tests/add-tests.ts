import { add } from "../src/add";
import { expect } from "chai";
import "mocha";

describe("add function", () => {
  it("should return the sum of two positive numbers", () => {
    const result = add(2, 3);
    expect(result).is.equal(5);
  });

  it("should return the sum of two negative numbers", () => {
    const result = add(-2, -3);
    expect(result).is.equal(-5);
  });

  it("should return the sum of a positive and a negative number", () => {
    const result = add(2, -3);
    expect(result).is.equal(-1);
  });

  it("should return the sum of zero and a number", () => {
    const result = add(0, 5);
    expect(result).is.equal(5);
  });
});
