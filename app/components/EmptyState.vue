<template>
  <div class="px-4">
    <div class="card-soft flex flex-col items-center gap-3 p-8 text-center">
      <div class="grid size-14 place-items-center rounded-2xl brand-soft">
        <UIcon :name="icon" class="size-7" />
      </div>
      <div>
        <p class="text-sm font-bold">{{ title }}</p>
        <p v-if="subtitle" class="mt-0.5 text-xs text-[var(--ink-muted)]">{{ subtitle }}</p>
      </div>
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{ title: string, subtitle?: string, icon?: string }>(), { icon: 'i-lucide-inbox' })
</script>
