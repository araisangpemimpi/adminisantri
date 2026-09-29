<template>
  <section class="rise-in">
    <div class="mb-3 flex items-end justify-between gap-3">
      <div class="min-w-0">
        <p v-if="eyebrow" class="eyebrow">{{ eyebrow }}</p>
        <h2 class="text-[17px] font-extrabold leading-tight">{{ title }}</h2>
        <p v-if="subtitle" class="mt-0.5 text-xs text-[var(--ink-muted)]">{{ subtitle }}</p>
      </div>
      <NuxtLink
        v-if="to"
        :to="to"
        class="flex shrink-0 items-center gap-0.5 text-xs font-bold text-[var(--brand-text)]"
      >
        {{ toLabel }}
        <UIcon name="i-lucide-chevron-right" class="size-3.5" />
      </NuxtLink>
    </div>
    <slot />
  </section>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  title: string
  eyebrow?: string
  subtitle?: string
  to?: string
  toLabel?: string
}>(), { toLabel: 'Semua' })
</script>
