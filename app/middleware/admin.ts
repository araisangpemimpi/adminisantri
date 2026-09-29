// Hanya pengguna yang sudah login boleh masuk /admin (selain /admin/login).
export default defineNuxtRouteMiddleware((to) => {
  if (!import.meta.client) return
  const { user, load } = useAuth()
  load()
  if (!user.value && to.path !== '/admin/login') {
    return navigateTo('/admin/login')
  }
  if (user.value && to.path === '/admin/login') {
    return navigateTo('/admin')
  }
})
