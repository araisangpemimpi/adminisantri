<template>
  <UButton
    :icon="settings.mode === 'dark' ? 'i-lucide-sun' : 'i-lucide-moon'"
    color="neutral"
    variant="ghost"
    :size="size"
    :aria-label="settings.mode === 'dark' ? 'Mode terang' : 'Mode gelap'"
    @click="toggleMode"
  />
</template>

<script setup lang="ts">
withDefaults(defineProps<{ size?: 'xs' | 'sm' | 'md' }>(), { size: 'sm' })
const { settings, toggleMode, load } = useSiteSettings()
onMounted(() => load())
</script>
