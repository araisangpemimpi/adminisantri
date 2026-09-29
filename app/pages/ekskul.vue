<template>
  <div>
    <PageHeader title="Ekstrakurikuler" subtitle="Wadah pengembangan bakat santri" icon="i-lucide-medal" />

    <div class="mt-5 space-y-3 px-4">
      <article v-for="item in store.rows.value.filter(r => r.aktif !== false)" :key="item.id" class="card-soft card-hover p-4">
        <div class="flex items-start gap-3.5">
          <div class="grid size-12 shrink-0 place-items-center rounded-2xl brand-gradient text-white">
            <UIcon :name="item.ikon || 'i-lucide-medal'" class="size-6" />
          </div>
          <div class="min-w-0 flex-1">
            <p class="text-sm font-extrabold">{{ item.nama }}</p>
            <p class="mt-0.5 text-xs leading-relaxed text-[var(--ink-muted)]">{{ item.deskripsi }}</p>
          </div>
        </div>
        <div class="mt-3 grid grid-cols-3 gap-2 border-t border-[var(--hairline)] pt-3">
          <div class="text-center">
            <p class="text-[10px] font-bold uppercase text-[var(--ink-muted)]">Hari</p>
            <p class="text-xs font-semibold">{{ item.hari }}</p>
          </div>
          <div class="text-center">
            <p class="text-[10px] font-bold uppercase text-[var(--ink-muted)]">Waktu</p>
            <p class="text-xs font-semibold">{{ item.jam }}</p>
          </div>
          <div class="text-center">
            <p class="text-[10px] font-bold uppercase text-[var(--ink-muted)]">Lokasi</p>
            <p class="truncate text-xs font-semibold">{{ item.lokasi }}</p>
          </div>
        </div>
        <div v-if="item.pembina" class="mt-2.5 flex items-center gap-1.5 text-[11px] text-[var(--ink-muted)]">
          <UIcon name="i-lucide-user-check" class="size-3" /> Pembina: {{ item.pembina }}
        </div>
      </article>

      <EmptyState v-if="!store.rows.value.length" icon="i-lucide-medal" title="Belum ada ekskul" subtitle="Data ekstrakurikuler akan tampil di sini." />
    </div>
  </div>
</template>

<script setup lang="ts">
const store = useAdminStore('ekskul')
useHead({ title: 'Ekstrakurikuler' })
onMounted(() => store.fetchAll())
</script>
