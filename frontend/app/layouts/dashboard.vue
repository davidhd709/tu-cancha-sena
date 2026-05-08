<template>
  <v-app>
    <!-- Fondo con halos de gradiente como en la landing -->
    <div class="tc-bg-halos" aria-hidden="true">
      <div class="tc-halo tc-halo--green" />
      <div class="tc-halo tc-halo--yellow" />
    </div>

    <!-- Navigation Drawer -->
    <v-navigation-drawer
      v-model="drawer"
      :rail="rail"
      permanent
      class="tc-drawer"
      width="260"
    >
      <!-- Brand -->
      <div class="tc-brand">
        <NuxtLink to="/" class="tc-brand-link">
          <img src="/logo.jpeg" alt="TuCancha" class="tc-brand-logo" />
          <div v-if="!rail" class="tc-brand-meta">
            <div class="tc-brand-name">TuCancha</div>
            <div class="tc-brand-role">{{ authStore.roleLabel }}</div>
          </div>
        </NuxtLink>
        <v-btn
          :icon="rail ? 'mdi-chevron-right' : 'mdi-chevron-left'"
          variant="text"
          size="small"
          class="tc-brand-toggle"
          @click="rail = !rail"
        />
      </div>

      <v-divider class="tc-divider" />

      <!-- Navigation Items -->
      <v-list density="comfortable" nav class="tc-nav">
        <v-list-item
          v-for="item in navItems"
          :key="item.to"
          :to="item.to"
          :prepend-icon="item.icon"
          :title="item.title"
          rounded="lg"
          class="tc-nav-item"
        />
      </v-list>

      <template #append>
        <v-divider class="tc-divider" />
        <v-list density="comfortable" nav class="tc-nav my-2">
          <v-list-item
            to="/profile"
            prepend-icon="mdi-account-circle-outline"
            title="Mi Perfil"
            rounded="lg"
            class="tc-nav-item"
          />
          <v-list-item
            prepend-icon="mdi-logout"
            title="Cerrar Sesión"
            rounded="lg"
            class="tc-nav-item tc-nav-item--logout"
            @click="handleLogout"
          />
        </v-list>
      </template>
    </v-navigation-drawer>

    <!-- Top App Bar -->
    <v-app-bar elevation="0" class="tc-appbar" height="64">
      <div class="tc-appbar-title">
        <span class="tc-appbar-section">{{ currentPageTitle }}</span>
      </div>
      <v-spacer />
      <template #append>
        <v-menu>
          <template #activator="{ props }">
            <v-btn
              v-bind="props"
              variant="tonal"
              rounded="lg"
              class="tc-user-btn"
            >
              <v-avatar size="28" class="tc-user-avatar mr-2">
                <span class="tc-user-initials">{{ initials }}</span>
              </v-avatar>
              <span v-if="!$vuetify.display.smAndDown" class="tc-user-name">{{ authStore.fullName }}</span>
              <v-icon end size="18">mdi-chevron-down</v-icon>
            </v-btn>
          </template>
          <v-list density="compact" rounded="lg" min-width="200">
            <v-list-item
              to="/profile"
              prepend-icon="mdi-account"
              title="Mi Perfil"
            />
            <v-divider />
            <v-list-item
              prepend-icon="mdi-logout"
              title="Cerrar Sesión"
              @click="handleLogout"
            />
          </v-list>
        </v-menu>
      </template>
    </v-app-bar>

    <!-- Main Content -->
    <v-main>
      <v-container fluid class="pa-6 pa-md-8 tc-main">
        <slot />
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
const authStore = useAuthStore()
const route = useRoute()

const drawer = ref(true)
const rail = ref(false)

const initials = computed(() => {
  if (!authStore.user) return '?'
  return `${authStore.user.firstName[0]}${authStore.user.lastName[0]}`.toUpperCase()
})

const adminNav = [
  { to: '/dashboard', icon: 'mdi-view-dashboard-outline', title: 'Dashboard' },
  { to: '/admin/users', icon: 'mdi-account-group-outline', title: 'Usuarios' },
  { to: '/admin/businesses', icon: 'mdi-store-outline', title: 'Negocios' },
  { to: '/admin/courts', icon: 'mdi-soccer-field', title: 'Canchas' },
  { to: '/admin/bookings', icon: 'mdi-calendar-check-outline', title: 'Reservas' },
  { to: '/admin/software', icon: 'mdi-application-outline', title: 'Software' },
]

const businessNav = [
  { to: '/dashboard', icon: 'mdi-view-dashboard-outline', title: 'Dashboard' },
  { to: '/business', icon: 'mdi-store-outline', title: 'Mis Negocios' },
  { to: '/business/courts', icon: 'mdi-soccer-field', title: 'Mis Canchas' },
  { to: '/business/bookings', icon: 'mdi-calendar-check-outline', title: 'Reservas' },
]

const clientNav = [
  { to: '/dashboard', icon: 'mdi-view-dashboard-outline', title: 'Dashboard' },
  { to: '/client/courts', icon: 'mdi-soccer-field', title: 'Explorar Canchas' },
  { to: '/client/bookings', icon: 'mdi-calendar-account-outline', title: 'Mis Reservas' },
]

const navItems = computed(() => {
  if (authStore.isAdmin) return adminNav
  if (authStore.isBusiness) return businessNav
  return clientNav
})

const currentPageTitle = computed(() => {
  const all = [...adminNav, ...businessNav, ...clientNav]
  const found = all.find((item) => item.to === route.path)
  return found?.title ?? 'Dashboard'
})

const handleLogout = () => {
  authStore.logout()
}
</script>

<style scoped>
.tc-bg-halos {
  position: fixed;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
  z-index: 0;
}
.tc-halo {
  position: absolute;
  width: 720px;
  height: 720px;
  border-radius: 50%;
  filter: blur(140px);
  opacity: 0.18;
}
.tc-halo--green {
  background: #22c55e;
  top: -260px;
  left: -180px;
}
.tc-halo--yellow {
  background: #facc15;
  bottom: -300px;
  right: -200px;
  opacity: 0.08;
}

.tc-main {
  position: relative;
  z-index: 1;
  min-height: calc(100vh - 64px);
}

/* Brand block */
.tc-brand {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 18px 16px 16px;
}
.tc-brand-link {
  display: flex;
  align-items: center;
  gap: 12px;
  text-decoration: none;
  color: inherit;
  flex: 1;
  min-width: 0;
}
.tc-brand-logo {
  width: 38px;
  height: 38px;
  object-fit: cover;
  border-radius: 10px;
  border: 1px solid rgba(255,255,255,0.12);
}
.tc-brand-meta {
  min-width: 0;
}
.tc-brand-name {
  font-weight: 800;
  font-size: 0.95rem;
  letter-spacing: -0.01em;
  color: #f1f5f9;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.tc-brand-role {
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.18em;
  color: #22c55e;
  font-weight: 700;
  margin-top: 2px;
}
.tc-brand-toggle {
  flex-shrink: 0;
}

.tc-divider {
  border-color: rgba(255,255,255,0.06) !important;
}

/* Nav items */
.tc-nav {
  padding: 8px 10px;
}
.tc-nav-item {
  margin: 2px 0;
  border-radius: 12px !important;
  font-size: 0.92rem;
  color: #94a3b8;
  transition: color 0.2s, background 0.2s;
}
.tc-nav-item:hover {
  color: #f1f5f9;
  background: rgba(255,255,255,0.04) !important;
}
.tc-nav-item.v-list-item--active {
  background: rgba(34,197,94,0.12) !important;
  color: #22c55e !important;
}
.tc-nav-item.v-list-item--active :deep(.v-list-item-title) {
  font-weight: 700;
}
.tc-nav-item--logout:hover {
  color: #ef4444 !important;
  background: rgba(239,68,68,0.08) !important;
}

/* App bar */
.tc-appbar {
  z-index: 5 !important;
}
.tc-appbar-title {
  padding-left: 12px;
}
.tc-appbar-section {
  font-size: 1.05rem;
  font-weight: 700;
  letter-spacing: -0.01em;
  color: #f1f5f9;
}

/* User button */
.tc-user-btn {
  background: rgba(255,255,255,0.04) !important;
  border: 1px solid rgba(255,255,255,0.08) !important;
}
.tc-user-avatar {
  background: linear-gradient(135deg, #22c55e, #15803d) !important;
}
.tc-user-initials {
  color: #06170d;
  font-weight: 800;
  font-size: 0.78rem;
}
.tc-user-name {
  font-size: 0.85rem;
  font-weight: 600;
  color: #f1f5f9;
}
</style>
