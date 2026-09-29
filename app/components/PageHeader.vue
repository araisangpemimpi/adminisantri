<template>
  <div class="px-4 pt-5">
    <div class="brand-gradient pattern-islamic relative overflow-hidden rounded-3xl p-5 text-white shadow-lg">
      <div class="relative flex items-center gap-3.5">
        <div class="grid size-12 shrink-0 place-items-center rounded-2xl bg-white/20 backdrop-blur">
          <UIcon :name="icon" class="size-6" />
        </div>
        <div class="min-w-0">
          <h1 class="text-xl font-extrabold leading-tight">{{ title }}</h1>
          <p v-if="subtitle" class="mt-0.5 text-xs text-white/80">{{ subtitle }}</p>
        </div>
      </div>
    </div>
    <slot />
  </div>
</template>

<script setup lang="ts">
defineProps<{ title: string, subtitle?: string, icon: string }>()
</script>
