// Partial copy that replaces parts of a locale's content, e.g. the workshop-only copy used
// while on-site work isn't live (app.config `features.onsite`).
//
// - Objects merge key by key.
// - Arrays of items with a `slug` (services) merge by slug.
// - Other arrays can be patched by index: `{ 1: "new text" }` replaces item 1, `{ 2: null }`
//   removes item 2, and objects inside merge. A full array replaces the original.
export type Overrides<T> = T extends (...args: never[]) => unknown
  ? T
  : T extends readonly (infer U)[]
    ? | (U extends { slug: string } ? (Overrides<U> & { slug: string })[] : T)
      | { [index: number]: Overrides<U> | null }
    : T extends object
      ? { [K in keyof T]?: Overrides<T[K]> }
      : T

const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value)

export function applyOverrides<T>(base: T, overrides: unknown): T {
  if (overrides === undefined) return base

  if (Array.isArray(base)) {
    if (Array.isArray(overrides)) {
      if (!base.every((item) => isObject(item) && "slug" in item))
        return overrides as T
      return base.map((item) => {
        const patch = overrides.find((o) => o.slug === item.slug)
        return patch ? applyOverrides(item, patch) : item
      }) as T
    }
    if (isObject(overrides))
      return base.flatMap((item, i) => {
        if (!(i in overrides)) return [item]
        const patch = overrides[i]
        return patch === null ? [] : [applyOverrides(item, patch)]
      }) as T
  }

  if (isObject(base) && isObject(overrides))
    return Object.fromEntries(
      Object.entries(base).map(([key, value]) => [
        key,
        applyOverrides(value, overrides[key]),
      ]),
    ) as T

  return overrides as T
}
