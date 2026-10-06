import { describe, expect, it } from "vitest"
import { repairStage, samePhone } from "#shared/utils/repair"

describe("repairStage", () => {
  it("maps Fergus statuses to the customer's stages", () => {
    expect(repairStage("Active", ["To Schedule"])).toBe("booked")
    expect(repairStage("Active", ["To Start"])).toBe("booked")
    expect(repairStage("To Price", [])).toBe("assessing")
    expect(repairStage("Quote Sent", ["To Start"])).toBe("assessing")
    expect(repairStage("Estimate Sent", [])).toBe("assessing")
    expect(repairStage("Active", ["In Progress"])).toBe("working")
    expect(repairStage("Active", ["Labour Complete"])).toBe("done")
    expect(repairStage("Active", ["Invoiced"])).toBe("done")
    expect(repairStage("Completed", ["In Progress"])).toBe("done")
  })

  it("isn't done until every phase is", () => {
    expect(repairStage("Active", ["Labour Complete", "In Progress"])).toBe(
      "working",
    )
    expect(repairStage("Active", ["To Invoice", "To Start"])).toBe("booked")
  })

  it("treats unknown phase statuses and no phases as booked", () => {
    expect(repairStage("Active", [])).toBe("booked")
    expect(repairStage("Active", ["Something new"])).toBe("booked")
  })
})

describe("samePhone", () => {
  it("matches however the number is typed", () => {
    expect(samePhone("01269 831491", "01269831491")).toBe(true)
    expect(samePhone("+44 1269 831491", "01269 831491")).toBe(true)
    expect(samePhone("+44 (0)7700 900123", "07700900123")).toBe(false)
    expect(samePhone("447700900123", "07700 900 123")).toBe(true)
  })

  it("rejects different or too-short numbers", () => {
    expect(samePhone("01269 831491", "01269 831492")).toBe(false)
    expect(samePhone("123", "123")).toBe(false)
    expect(samePhone("", "")).toBe(false)
  })
})
