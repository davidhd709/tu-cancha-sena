import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import { md3 } from 'vuetify/blueprints'

export default defineNuxtPlugin((app) => {
  const vuetify = createVuetify({
    blueprint: md3,
    theme: {
      defaultTheme: 'tucancha',
      themes: {
        tucancha: {
          dark: true,
          colors: {
            primary:    '#22c55e',
            secondary:  '#facc15',
            accent:     '#3b82f6',
            error:      '#ef4444',
            warning:    '#f59e0b',
            info:       '#3b82f6',
            success:    '#22c55e',
            background: '#0a0e1a',
            surface:    '#0f1420',
            'surface-bright': '#151c2e',
            'surface-light': '#1a2238',
            'surface-variant': '#0f1420',
            'on-surface-variant': '#94a3b8',
            'on-background': '#f1f5f9',
            'on-surface': '#f1f5f9',
            'on-primary': '#06170d',
            'on-secondary': '#1f1a02',
          },
          variables: {
            'border-color': 'rgba(255,255,255,0.08)',
            'border-opacity': 1,
            'high-emphasis-opacity': 0.95,
            'medium-emphasis-opacity': 0.7,
            'disabled-opacity': 0.4,
            'theme-on-surface': '241, 245, 249',
          },
        },
      },
    },
    defaults: {
      VApp: { style: 'background: #0a0e1a' },
      VBtn: { rounded: 'lg', class: 'text-none', style: 'letter-spacing: 0.3px;' },
      VCard: { rounded: 'lg', elevation: 0, class: 'tc-card' },
      VTextField: { variant: 'outlined', density: 'comfortable', color: 'primary' },
      VSelect: { variant: 'outlined', density: 'comfortable', color: 'primary' },
      VTextarea: { variant: 'outlined', density: 'comfortable', color: 'primary' },
      VAutocomplete: { variant: 'outlined', density: 'comfortable', color: 'primary' },
      VCombobox: { variant: 'outlined', density: 'comfortable', color: 'primary' },
      VDataTable: { hover: true, density: 'comfortable' },
      VChip: { rounded: 'md' },
      VAlert: { rounded: 'lg', variant: 'tonal' },
      VDialog: { transition: 'dialog-bottom-transition' },
    },
  })
  app.vueApp.use(vuetify)
})
