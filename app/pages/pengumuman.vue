<template>
  <div>
    <PageHeader title="Pengumuman" subtitle="Informasi resmi pesantren" icon="i-lucide-megaphone" />

    <div class="mt-5 space-y-3 px-4">
      <article
        v-for="item in store.rows.value" :key="item.id"
        class="card-soft overflow-hidden"
      >
        <button class="w-full p-4 text-left" @click="toggle(item.id)">
          <div class="mb-1.5 flex flex-wrap items-center gap-2">
            <UBadge v-if="item.penting" size="xs" color="error" variant="soft" icon="i-lucide-alert-circle">Penting</UBadge>
            <UBadge size="xs" color="neutral" variant="soft">{{ item.kategori }}</UBadge>
            <span class="ml-auto text-[11px] text-[var(--ink-muted)]">{{ tanggal(item.tanggal) }}</span>
          </div>
          <div class="flex items-start gap-2">
            <p class="flex-1 text-sm font-bold leading-snug">{{ item.judul }}</p>
            <UIcon
              name="i-lucide-chevron-down"
              class="mt-0.5 size-4 shrink-0 text-[var(--ink-muted)] transition"
              :class="{ 'rotate-180': open === item.id }"
            />
          </div>
          <p v-if="open !== item.id" class="mt-1 line-clamp-2 text-xs text-[var(--ink-muted)]">{{ item.isi }}</p>
        </button>
        <Transition
          enter-active-class="transition-all duration-300" enter-from-class="opacity-0"
        >
          <div v-if="open === item.id" class="border-t border-[var(--hairline)] px-4 pb-4 pt-3">
            <p class="whitespace-pre-line text-sm leading-relaxed text-[var(--ink-muted)]">{{ item.isi }}</p>
          </div>
        </Transition>
      </article>

      <EmptyState v-if="!store.rows.value.length" icon="i-lucide-megaphone" title="Belum ada pengumuman" subtitle="Pengumuman resmi akan tampil di sini." />
    </div>
  </div>
</template>

<script setup lang="ts">
const store = useAdminStore('pengumuman')
const { tanggal } = useFormat()
const open = ref<string | null>(null)

function toggle(id: string) {
  open.value = open.value === id ? null : id
}

useHead({ title: 'Pengumuman' })
onMounted(() => store.fetchAll())
</script>
