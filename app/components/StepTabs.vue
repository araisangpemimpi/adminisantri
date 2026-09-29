<!--
  Tab mobile-friendly: bisa diklik, digeser (swipe), dan punya indikator progres.
  Navigasi utama tetap tombol Lanjut/Kembali karena di mobile lebih jelas
  daripada sekadar menyadari bahwa header tab bisa ditekan.
-->
<template>
  <div>
    <!-- Header tab -->
    <div class="sticky top-0 z-30 border-b border-[var(--hairline)] bg-[var(--surface)]/95 backdrop-blur-lg">
      <div class="flex px-2">
        <button
          v-for="(t, i) in tabs" :key="t.key"
          class="relative flex flex-1 flex-col items-center gap-1 px-1 py-3 transition"
          :class="i === modelValue ? 'text-[var(--brand-text)]' : 'text-[var(--ink-muted)]'"
          @click="$emit('update:modelValue', i)"
        >
          <div class="flex items-center gap-1.5">
            <span
              class="grid size-5 shrink-0 place-items-center rounded-full text-[10px] font-bold transition"
              :class="i === modelValue
                ? 'brand-gradient text-white'
                : (t.done ? 'brand-soft' : 'bg-[var(--surface-muted)] text-[var(--ink-muted)]')"
            >
              <UIcon v-if="t.done && i !== modelValue" name="i-lucide-check" class="size-3" />
              <template v-else>{{ i + 1 }}</template>
            </span>
            <span class="text-[11px] font-bold sm:text-xs">{{ t.label }}</span>
          </div>
          <span v-if="i === modelValue" class="absolute inset-x-3 bottom-0 h-0.5 rounded-full brand-gradient" />
        </button>
      </div>
    </div>

    <!-- Isi tab: geser untuk berpindah -->
    <div
      class="relative overflow-hidden"
      @touchstart.passive="onTouchStart"
      @touchend.passive="onTouchEnd"
    >
      <div
        class="flex transition-transform duration-300 ease-out"
        :style="{ transform: `translateX(-${modelValue * 100}%)` }"
      >
        <section v-for="(t, i) in tabs" :key="t.key" class="w-full shrink-0">
          <slot :name="t.key" :index="i" />
        </section>
      </div>
    </div>

    <!-- Navigasi -->
    <div class="mt-5 flex items-center gap-2 px-4">
      <UButton
        v-if="modelValue > 0" color="neutral" variant="soft" icon="i-lucide-arrow-left"
        class="flex-1" @click="$emit('update:modelValue', modelValue - 1)"
      >
        Kembali
      </UButton>
      <UButton
        v-if="modelValue < tabs.length - 1" icon="i-lucide-arrow-right" trailing
        class="flex-[2]" @click="$emit('update:modelValue', modelValue + 1)"
      >
        {{ nextLabel || `Lanjut: ${tabs[modelValue + 1]?.label}` }}
      </UButton>
      <slot v-else name="actions" />
    </div>

    <!-- Titik indikator -->
    <div class="mt-3 flex justify-center gap-1.5">
      <button
        v-for="(t, i) in tabs" :key="t.key"
        class="h-1.5 rounded-full transition-all"
        :class="i === modelValue ? 'w-5 brand-gradient' : 'w-1.5 bg-[var(--hairline)]'"
        :aria-label="t.label" @click="$emit('update:modelValue', i)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
export interface TabItem {
  key: string
  label: string
  /** Sudah dibaca/dikunjungi — hanya penanda, tidak memblokir. */
  done?: boolean
}

const props = defineProps<{
  tabs: TabItem[]
  modelValue: number
  nextLabel?: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: number]
}>()

/* --- Geser untuk berpindah tab --- */
const startX = ref(0)
const startY = ref(0)
const swiping = ref(false)

function onTouchStart(e: TouchEvent) {
  const t = e.touches[0]
  if (!t) return
  startX.value = t.clientX
  startY.value = t.clientY
  swiping.value = true
}

function onTouchEnd(e: TouchEvent) {
  if (!swiping.value) return
  swiping.value = false
  const t = e.changedTouches[0]
  if (!t) return
  const dx = t.clientX - startX.value
  const dy = t.clientY - startY.value

  // Abaikan bila gerakan lebih vertikal (pengguna sedang scroll) atau terlalu kecil.
  if (Math.abs(dx) < 55 || Math.abs(dy) > Math.abs(dx)) return

  if (dx < 0 && props.modelValue < props.tabs.length - 1) {
    emit('update:modelValue', props.modelValue + 1)
  }
  else if (dx > 0 && props.modelValue > 0) {
    emit('update:modelValue', props.modelValue - 1)
  }
}
</script>
