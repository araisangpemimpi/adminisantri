<!--
  Navigasi sidebar admin — bergaya accordion.
  - Grup yang punya banyak sub-menu dapat dibuka/tutup, sehingga tidak perlu scroll panjang.
  - Grup yang sedang aktif otomatis terbuka.
  - Grup kecil (<= 3 item) selalu terbuka agar tidak perlu klik tambahan.
  - Pada mode ciut (hanya ikon), seluruh grup ditampilkan sebagai ikon grid.
-->
<template>
  <div class="space-y-1.5">
    <div v-for="group in tampil" :key="group.title">
      <!-- ============ Grup accordion (bisa dibuka/tutup) ============ -->
      <template v-if="group.bisaLipat && !collapsed">
        <button
          type="button"
          class="group flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2 text-left transition"
          :class="[
            buka(group.title)
              ? 'bg-[var(--surface-muted)]'
              : 'hover:bg-[var(--surface-muted)]',
            group.adaAktif ? 'font-bold' : '',
          ]"
          :aria-expanded="buka(group.title)"
          @click="toggle(group.title)"
        >
          <span
            class="grid size-7 shrink-0 place-items-center rounded-lg transition"
            :class="group.adaAktif
              ? 'brand-gradient text-white'
              : 'bg-[var(--surface-muted)] text-[var(--ink-muted)] group-hover:bg-[var(--surface)]'"
          >
            <UIcon :name="group.icon || 'i-lucide-folder'" class="size-4" />
          </span>
          <span class="min-w-0 flex-1 truncate text-[13px] font-bold">{{ group.title }}</span>
          <span class="shrink-0 text-[10px] font-semibold text-[var(--ink-muted)]">{{ group.items.length }}</span>
          <UIcon
            name="i-lucide-chevron-down"
            class="size-3.5 shrink-0 text-[var(--ink-muted)] transition-transform duration-200"
            :class="buka(group.title) ? 'rotate-180' : ''"
          />
        </button>

        <!-- Sub-menu -->
        <Transition
          enter-active-class="transition-all duration-200 ease-out overflow-hidden"
          enter-from-class="max-h-0 opacity-0"
          enter-to-class="max-h-[32rem] opacity-100"
          leave-active-class="transition-all duration-150 ease-in overflow-hidden"
          leave-from-class="max-h-[32rem] opacity-100"
          leave-to-class="max-h-0 opacity-0"
        >
          <div v-if="buka(group.title)" class="mt-0.5 space-y-0.5 ps-2.5">
            <NuxtLink
              v-for="item in group.items" :key="item.to" :to="item.to"
              :aria-current="isActive(item.to) ? 'page' : undefined"
              class="flex items-center gap-2.5 rounded-xl px-2.5 py-1.5 text-[13px] font-medium transition"
              :class="isActive(item.to)
                ? 'brand-soft font-bold'
                : 'text-[var(--ink-muted)] hover:bg-[var(--surface-muted)] hover:text-[var(--ink)]'"
            >
              <UIcon :name="item.icon" class="size-4 shrink-0" />
              <span class="truncate">{{ item.label }}</span>
              <span v-if="isActive(item.to)" class="ms-auto size-1.5 shrink-0 rounded-full brand-gradient" />
            </NuxtLink>
          </div>
        </Transition>
      </template>

      <!-- ============ Grup datar (selalu terbuka) ============ -->
      <template v-else>
        <p
          v-if="!collapsed"
          class="mb-1 mt-2 flex items-center gap-1.5 px-2.5 text-[10px] font-extrabold uppercase tracking-[0.12em] text-[var(--ink-muted)]"
        >
          <UIcon v-if="group.icon" :name="group.icon" class="size-3" />
          {{ group.title }}
        </p>
        <div v-else class="mx-auto my-1.5 h-px w-6 bg-[var(--hairline)]" />

        <div class="space-y-0.5">
          <NuxtLink
            v-for="item in group.items" :key="item.to" :to="item.to"
            :title="collapsed ? item.label : undefined"
            :aria-current="isActive(item.to) ? 'page' : undefined"
            class="group flex items-center gap-2.5 rounded-xl text-[13px] font-medium transition"
            :class="[
              collapsed ? 'justify-center px-0 py-2' : 'px-2.5 py-1.5',
              isActive(item.to)
                ? 'brand-soft font-bold'
                : 'text-[var(--ink-muted)] hover:bg-[var(--surface-muted)] hover:text-[var(--ink)]',
            ]"
          >
            <span
              class="grid size-7 shrink-0 place-items-center rounded-lg transition"
              :class="isActive(item.to)
                ? 'brand-gradient text-white'
                : 'bg-[var(--surface-muted)] text-[var(--ink-muted)] group-hover:bg-[var(--surface)]'"
            >
              <UIcon :name="item.icon" class="size-4" />
            </span>
            <span v-if="!collapsed" class="truncate">{{ item.label }}</span>
            <span v-if="!collapsed && isActive(item.to)" class="ms-auto size-1.5 shrink-0 rounded-full brand-gradient" />
          </NuxtLink>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
  groups: Array<{
    title: string
    icon?: string
    items: Array<{ label: string, icon: string, to: string }>
  }>
  collapsed?: boolean
}>(), { collapsed: false })

const route = useRoute()

/** Grup kecil tidak perlu dilipat — hemat satu klik. */
const AMBANG_LIPAT = 3

/**
 * Hanya SATU item yang ditandai aktif: rute terpanjang yang cocok.
 * Mencegah /admin/psb/pendaftar ikut menyalakan menu lain.
 */
const activePath = computed(() => {
  const semua = props.groups.flatMap(g => g.items)
  const cocok = semua
    .filter(i => route.path === i.to || route.path.startsWith(`${i.to}/`))
    .sort((a, b) => b.to.length - a.to.length)[0]
  return cocok?.to ?? ''
})

function isActive(to: string) {
  return activePath.value === to
}

/** Tambahkan metadata accordion ke tiap grup. */
const tampil = computed(() =>
  props.groups.map(g => ({
    ...g,
    bisaLipat: g.items.length > AMBANG_LIPAT,
    adaAktif: g.items.some(i => isActive(i.to)),
  })),
)

/* ---------------- Status buka/tutup ---------------- */
const KEY = 'admin-nav-terbuka'
const terbuka = ref<string[]>([])

function buka(title: string) {
  if (props.collapsed) return false
  return terbuka.value.includes(title)
}

function toggle(title: string) {
  const i = terbuka.value.indexOf(title)
  if (i >= 0) terbuka.value.splice(i, 1)
  else terbuka.value.push(title)
  if (import.meta.client) {
    try { localStorage.setItem(KEY, JSON.stringify(terbuka.value)) } catch { /* abaikan */ }
  }
}

/** Buka grup yang memuat halaman aktif; biarkan grup lain tertutup. */
function sinkronGrupAktif() {
  const aktif = props.groups.find(g =>
    g.items.some(i => i.to === activePath.value),
  )
  if (aktif && !terbuka.value.includes(aktif.title)) {
    terbuka.value.push(aktif.title)
  }
}

onMounted(() => {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) terbuka.value = JSON.parse(raw)
  }
  catch { /* abaikan */ }
  sinkronGrupAktif()
})

// Ikuti perubahan rute (mis. membuka /admin/keuangan/* dari dashboard).
watch(activePath, sinkronGrupAktif)
</script>
