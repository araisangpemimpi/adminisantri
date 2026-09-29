<template>
  <!-- Tombol install PWA yang sopan: muncul hanya jika bisa dipasang -->
  <Transition
    enter-active-class="transition duration-300" enter-from-class="opacity-0 translate-y-3"
    leave-active-class="transition duration-200" leave-to-class="opacity-0 translate-y-3"
  >
    <div
      v-if="visible"
      class="fixed inset-x-0 bottom-[76px] z-40 mx-auto w-full max-w-[440px] px-3"
      style="padding-bottom: env(safe-area-inset-bottom)"
    >
      <div class="flex items-center gap-3 rounded-2xl border border-[var(--hairline)] bg-[var(--surface)] p-3 shadow-xl">
        <div class="grid size-10 shrink-0 place-items-center rounded-xl brand-gradient">
          <UIcon name="i-lucide-download" class="size-5 text-white" />
        </div>
        <div class="min-w-0 flex-1">
          <p class="text-sm font-bold">Pasang aplikasi</p>
          <p class="truncate text-xs text-[var(--ink-muted)]">Akses lebih cepat langsung dari layar utama.</p>
        </div>
        <UButton size="xs" @click="install">Pasang</UButton>
        <UButton size="xs" color="neutral" variant="ghost" icon="i-lucide-x" aria-label="Tutup" @click="dismiss" />
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
const visible = ref(false)
const dismissed = ref(false)
let deferredPrompt: any = null

function onBeforeInstall(e: Event) {
  e.preventDefault()
  deferredPrompt = e
  if (!dismissed.value && localStorage.getItem('pesantren-pwa-dismissed') !== '1') {
    visible.value = true
  }
}

async function install() {
  visible.value = false
  if (!deferredPrompt) return
  deferredPrompt.prompt()
  await deferredPrompt.userChoice
  deferredPrompt = null
}

function dismiss() {
  visible.value = false
  dismissed.value = true
  try { localStorage.setItem('pesantren-pwa-dismissed', '1') } catch { /* abaikan */ }
}

onMounted(() => {
  if (localStorage.getItem('pesantren-pwa-dismissed') === '1') dismissed.value = true
  window.addEventListener('beforeinstallprompt', onBeforeInstall)
})
onBeforeUnmount(() => window.removeEventListener('beforeinstallprompt', onBeforeInstall))
</script>
