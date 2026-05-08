<template>
  <div>
    <v-btn
      :to="`/client/courts/${route.params.courtId}`"
      variant="text"
      prepend-icon="mdi-arrow-left"
      class="mb-4 px-0"
    >
      Volver
    </v-btn>

    <h1 class="text-h5 font-weight-bold mb-1">Confirmar Reserva</h1>
    <p class="text-body-2 text-medium-emphasis mb-6">Completa los datos para confirmar tu reserva</p>

    <v-row>
      <!-- Booking summary -->
      <v-col cols="12" md="4" order-md="2">
        <v-card rounded="lg" color="primary" variant="tonal" class="mb-4">
          <v-card-text class="pa-5">
            <h3 class="text-subtitle-2 font-weight-bold mb-3">Resumen de Reserva</h3>
            <v-list density="compact" class="bg-transparent pa-0">
              <v-list-item class="px-0">
                <template #prepend><v-icon size="18" class="mr-2">mdi-soccer-field</v-icon></template>
                <v-list-item-title class="text-body-2">{{ court?.name }}</v-list-item-title>
                <v-list-item-subtitle>{{ court?.business?.name }}</v-list-item-subtitle>
              </v-list-item>
              <v-list-item class="px-0">
                <template #prepend><v-icon size="18" class="mr-2">mdi-calendar</v-icon></template>
                <v-list-item-title class="text-body-2">{{ route.query.date }}</v-list-item-title>
              </v-list-item>
              <v-list-item class="px-0">
                <template #prepend><v-icon size="18" class="mr-2">mdi-clock-outline</v-icon></template>
                <v-list-item-title class="text-body-2">{{ route.query.startTime }} – {{ route.query.endTime }}</v-list-item-title>
              </v-list-item>
            </v-list>
            <v-divider class="my-3" />
            <div class="d-flex justify-space-between align-center">
              <span class="text-body-2 font-weight-medium">Total a pagar</span>
              <span class="text-h6 font-weight-bold">${{ totalPrice.toLocaleString('es-CO') }}</span>
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Booking form -->
      <v-col cols="12" md="8" order-md="1">
        <v-card rounded="lg">
          <v-card-text class="pa-5">
            <v-form ref="formRef" @submit.prevent="submitBooking">
              <!-- Payment Method -->
              <h3 class="text-subtitle-2 font-weight-bold mb-3">Método de Pago</h3>
              <v-radio-group v-model="form.paymentMethod" :rules="[r.required]" class="mb-4">
                <v-radio value="nequi" class="mb-1">
                  <template #label>
                    <div class="d-flex align-center gap-2">
                      <v-icon color="pink">mdi-cellphone</v-icon>
                      <div>
                        <div class="text-body-2 font-weight-medium">Nequi</div>
                        <div class="text-caption text-medium-emphasis">Pago por aplicación Nequi</div>
                      </div>
                    </div>
                  </template>
                </v-radio>
                <v-radio value="transferencia">
                  <template #label>
                    <div class="d-flex align-center gap-2">
                      <v-icon color="blue">mdi-bank-transfer</v-icon>
                      <div>
                        <div class="text-body-2 font-weight-medium">Transferencia Bancaria</div>
                        <div class="text-caption text-medium-emphasis">Transferencia a cuenta bancaria</div>
                      </div>
                    </div>
                  </template>
                </v-radio>
              </v-radio-group>

              <!-- Payment Proof -->
              <h3 class="text-subtitle-2 font-weight-bold mb-3">Comprobante de Pago</h3>
              <v-file-input
                v-model="form.paymentProof"
                label="Subir comprobante (imagen)"
                accept="image/*"
                prepend-icon="mdi-image-plus"
                :rules="[r.required]"
                show-size
                class="mb-4"
              />

              <!-- Preview -->
              <div v-if="proofPreview" class="mb-4">
                <p class="text-caption text-medium-emphasis mb-2">Vista previa:</p>
                <v-img :src="proofPreview" max-height="200" cover rounded="lg" />
              </div>

              <!-- Notes -->
              <h3 class="text-subtitle-2 font-weight-bold mb-3">Notas adicionales (opcional)</h3>
              <v-textarea
                v-model="form.notes"
                label="¿Alguna indicación especial?"
                rows="2"
                class="mb-4"
              />

              <!-- Error -->
              <v-alert
                v-if="errorMsg"
                type="error"
                variant="tonal"
                class="mb-4"
                closable
                @click:close="errorMsg = ''"
              >
                {{ errorMsg }}
              </v-alert>

              <v-btn
                type="submit"
                color="primary"
                block
                size="large"
                :loading="loading"
                prepend-icon="mdi-calendar-check"
              >
                Confirmar Reserva
              </v-btn>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Success Dialog -->
    <v-dialog v-model="successDialog" max-width="420" persistent>
      <v-card rounded="lg" class="text-center pa-4">
        <v-card-text>
          <v-icon size="72" color="success" class="mb-4">mdi-check-circle</v-icon>
          <h2 class="text-h6 font-weight-bold mb-2">¡Reserva Enviada!</h2>
          <p class="text-body-2 text-medium-emphasis mb-6">
            Tu reserva está pendiente de confirmación. El negocio verificará tu comprobante de pago.
          </p>
          <v-btn color="success" to="/client/bookings" block>Ver mis reservas</v-btn>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'dashboard', middleware: 'auth' })

const route = useRoute()
const { apiFetch } = useApi()
const config = useRuntimeConfig()
const authStore = useAuthStore()

const court = ref<any>(null)
const formRef = ref()
const loading = ref(false)
const errorMsg = ref('')
const successDialog = ref(false)

const form = reactive({
  paymentMethod: '',
  paymentProof: null as File | null,
  notes: '',
})

const proofPreview = computed(() => {
  if (!form.paymentProof) return null
  return URL.createObjectURL(form.paymentProof as File)
})

const hours = computed(() => {
  if (!route.query.startTime || !route.query.endTime) return 1
  const [sh, sm] = (route.query.startTime as string).split(':').map(Number)
  const [eh, em] = (route.query.endTime as string).split(':').map(Number)
  return Math.max(1, (eh * 60 + em - sh * 60 - sm) / 60)
})

const totalPrice = computed(() => (court.value?.pricePerHour ?? 0) * hours.value)

const r = {
  required: (v: any) => {
    if (Array.isArray(v)) return v.length > 0 || 'Requerido'
    return !!v || 'Requerido'
  },
}

const submitBooking = async () => {
  const { valid } = await formRef.value.validate()
  if (!valid) return

  loading.value = true
  errorMsg.value = ''

  try {
    const formData = new FormData()
    formData.append('courtId', route.params.courtId as string)
    formData.append('date', route.query.date as string)
    formData.append('startTime', route.query.startTime as string)
    formData.append('endTime', route.query.endTime as string)
    formData.append('paymentMethod', form.paymentMethod)
    if (form.notes) formData.append('notes', form.notes)
    if (form.paymentProof) formData.append('paymentProof', form.paymentProof as File)

    await $fetch(`${config.public.apiBase}/bookings`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${authStore.token}` },
      body: formData,
    })

    successDialog.value = true
  } catch (e: any) {
    errorMsg.value = e?.data?.message || 'Error al crear la reserva'
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  try {
    court.value = await apiFetch<any>(`/courts/${route.params.courtId}`)
  } catch (e) { console.error(e) }
})
</script>
