// Staff app pages: sign in first. Asks the server who's signed in once per visit.
export default defineNuxtRouteMiddleware(async (to) => {
  const { user } = useStaff()
  if (!user.value) {
    try {
      user.value = await $fetch<StaffUser | null>("/api/staff/me")
    } catch (error) {
      // 404: the staff app is switched off.
      if ((error as { statusCode?: number }).statusCode === 404)
        return abortNavigation(
          createError({ statusCode: 404, statusMessage: "Not found" }),
        )
    }
  }
  if (!user.value && to.path !== "/staff/login")
    return navigateTo("/staff/login")
  if (user.value && to.path === "/staff/login") return navigateTo("/staff")
})
