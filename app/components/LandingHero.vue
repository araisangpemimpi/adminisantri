<template>
  <section v-if="slides.length" class="relative">
    <div
      ref="scroller"
      class="no-scrollbar snap-x-mandatory flex gap-3 overflow-x-auto px-4"
      @scroll="onScroll"
    >
      <article
        v-for="s in slides" :key="s.id"
        class="snap-center-always relative h-56 w-[calc(100%-0px)] shrink-0 overflow-hidden rounded-3xl bg-[var(--surface-muted)]"
      >
        <img :src="s.gambar" :alt="s.judul" class="size-full object-cover">
        <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-transparent" />
        <div class="pattern-islamic absolute inset-0 opacity-40" />
        <div class="absolute inset-x-0 bottom-0 p-4">
          <UBadge size="xs" color="primary" variant="solid" class="mb-2">{{ s.badge }}</UBadge>
          <h2 class="text-lg font-extrabold leading-tight text-white">{{ s.judul }}</h2>
          <p class="mt-1 line-clamp-2 text-xs text-white/80">{{ s.deskripsi }}</p>
          <UButton v-if="s.link" :to="s.link" size="xs" class="mt-3" trailing-icon="i-lucide-arrow-right">Selengkapnya</UButton>
        </div>
      </article>
    </div>

    <!-- Indikator dot -->
    <div class="mt-3 flex justify-center gap-1.5">
      <button
        v-for="(_, i) in slides" :key="i"
        class="h-1.5 rounded-full transition-all"
        :class="i === active ? 'w-5 brand-gradient' : 'w-1.5 bg-[var(--hairline)]'"
        :aria-label="`Slide ${i + 1}`"
        @click="goTo(i)"
      />
    </div>
  </section>
</template>

<script setup lang="ts">
const store = useAdminStore('hero')
const slides = computed(() => store.rows.value.filter(s => s.aktif !== false))

const scroller = ref<HTMLElement | null>(null)
const active = ref(0)

function onScroll() {
  const el = scroller.value
  if (!el) return
  const card = el.scrollWidth / slides.value.length
  active.value = Math.round(el.scrollLeft / card)
}

function goTo(i: number) {
  const el = scroller.value
  if (!el) return
  const card = el.scrollWidth / slides.value.length
  el.scrollTo({ left: i * card, behavior: 'smooth' })
}

onMounted(() => store.fetchAll())
</script>
