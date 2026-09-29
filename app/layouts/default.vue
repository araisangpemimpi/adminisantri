<template>
  <div class="mobile-shell flex min-h-dvh flex-col">
    <AppHeader />
    <main class="flex-1 pb-24">
      <slot />
    </main>
    <BottomNav />
    <ClientOnly>
      <PwaInstaller />
    </ClientOnly>
  </div>
</template>
