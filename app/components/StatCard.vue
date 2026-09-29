<template>
  <NuxtLink :to="to" class="card-soft card-hover flex items-center gap-3.5 p-4">
    <div class="grid size-11 shrink-0 place-items-center rounded-2xl" :class="toneClass">
      <UIcon :name="icon" class="size-5" />
    </div>
    <div class="min-w-0">
      <p class="tabular text-xl font-extrabold leading-none">{{ value }}</p>
      <p class="mt-1 text-[11px] font-semibold text-[var(--ink-muted)]">{{ label }}</p>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
  label: string
  value: number | string
  icon: string
  to?: string
  tone?: 'primary' | 'cyan' | 'violet' | 'amber' | 'rose'
}>(), { tone: 'primary' })

const TONES: Record<string, string> = {
  primary: 'brand-soft',
  cyan: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-500/15 dark:text-cyan-400',
  violet: 'bg-violet-100 text-violet-700 dark:bg-violet-500/15 dark:text-violet-400',
  amber: 'bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400',
  rose: 'bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-400',
}

const toneClass = computed(() => TONES[props.tone ?? 'primary'])
</script>
