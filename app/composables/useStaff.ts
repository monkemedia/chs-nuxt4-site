import { staffCopy } from "~/content/staff"

// Staff app state: the signed-in mechanic, and $fetch that sends them to sign in on a 401.
export interface StaffUser {
  email: string
  firstName: string
  fergusUserId: number
}

export function useStaff() {
  const user = useState<StaffUser | null>("staff-user", () => null)
  const router = useRouter()

  async function api<T>(
    url: string,
    options: Parameters<typeof $fetch>[1] = {},
  ) {
    try {
      return (await $fetch(url, options)) as T
    } catch (error) {
      if ((error as { statusCode?: number }).statusCode === 401) {
        user.value = null
        await router.replace("/staff/login")
      }
      throw error
    }
  }

  return { user, api, copy: staffCopy }
}
