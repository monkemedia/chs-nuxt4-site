import { describe, expect, it } from "vitest"
import { addressLines, directionsUrl } from "#shared/utils/address"
import { formatHour, parseOpeningHours } from "#shared/utils/hours"

describe("addressLines", () => {
  const address = {
    street: "3 Acer Court",
    locality: "Cross Hands",
    town: "Llanelli",
    postcode: "SA14 6RB",
  }

  it("puts the postcode on the town's line, Royal Mail style", () => {
    expect(addressLines(address)).toEqual([
      "3 Acer Court",
      "Cross Hands",
      "Llanelli SA14 6RB",
    ])
  })

  it("leaves out empty parts", () => {
    expect(addressLines({ ...address, street: "", postcode: "" })).toEqual([
      "Cross Hands",
      "Llanelli",
    ])
  })

  it("builds a directions link", () => {
    expect(directionsUrl(address)).toBe(
      "https://www.google.com/maps/dir/?api=1&destination=3%20Acer%20Court%2C%20Cross%20Hands%2C%20Llanelli%20SA14%206RB",
    )
  })
})

describe("opening hours", () => {
  it("parses schema.org opening hours", () => {
    expect(parseOpeningHours(["Mo-Fr 08:00-17:30", "Sa 09:00-12:00"])).toEqual([
      { from: 0, to: 4, open: 480, close: 1050 },
      { from: 5, to: 5, open: 540, close: 720 },
    ])
  })

  it("formats times UK style in either language", () => {
    expect(formatHour(480, { am: "am", pm: "pm" })).toBe("8am")
    expect(formatHour(1050, { am: "am", pm: "pm" })).toBe("5.30pm")
    expect(formatHour(720, { am: "am", pm: "pm" })).toBe("12pm")
    expect(formatHour(1050, { am: "yb", pm: "yh" })).toBe("5.30yh")
  })
})
