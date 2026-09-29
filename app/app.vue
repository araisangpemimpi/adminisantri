<template>
  <UApp>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>

<script setup lang="ts">
const { load } = useSiteSettings()
const { load: loadAuthz } = useAuthz()
const { load: loadAuth } = useAuth()

onMounted(() => {
  load()
  loadAuthz()
  loadAuth()
})
</script>
