<template>
    <div class="container mt-5">
      <div class="row justify-content-center">
        <div class="col-md-8">
          <div class="card">
            <div class="card-header bg-primary text-white">
              <h3 class="mb-0">Foglalás megerősítése</h3>
            </div>
            <div class="card-body">
              <div class="alert alert-info" v-if="selectedTimeSlot">
                <strong>Kiválasztott időpont:</strong> {{ formatTimeSlot() }}
              </div>
  
              <form @submit.prevent="submitForm">
                <div class="form-group mb-3">
                  <label for="name">Név:</label>
                  <input 
                    type="text" 
                    class="form-control" 
                    id="name" 
                    v-model="formData.name" 
                    required
                    :class="{ 'is-invalid': errors.name }"
                  >
                  <div class="invalid-feedback" v-if="errors.name">
                    {{ errors.name }}
                  </div>
                </div>
  
                <div class="form-group mb-3">
                  <label for="phone">Telefonszám:</label>
                  <input 
                    type="tel" 
                    class="form-control" 
                    id="phone" 
                    v-model="formData.phone" 
                    required
                    pattern="[0-9]{6,11}"
                    :class="{ 'is-invalid': errors.phone }"
                  >
                  <div class="invalid-feedback" v-if="errors.phone">
                    {{ errors.phone }}
                  </div>
                  <small class="form-text text-muted">Kérjük, adjon meg egy érvényes magyar telefonszámot.</small>
                </div>
  
                <div class="d-flex justify-content-between">
                  <button type="button" class="btn btn-secondary" @click="goBack">Vissza</button>
                  <button type="submit" class="btn btn-success">Foglalás</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, reactive, computed, onMounted } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import { useFoglalasStroe } from '@/stores/foglalas';
  import { useToast } from 'vue-toastification';
  
  const foglalo = useFoglalasStroe();
  const toast = useToast();
  const route = useRoute();
  const router = useRouter();
  
  const formData = reactive({
    name: '',
    phone: '',
    email: '',
    notes: ''
  });
  
  const errors = reactive({
    name: '',
    phone: '',
    email: ''
  });
  
  const selectedTimeSlot = computed(() => {
    return foglalo.selectedTimeSlot;
  });
  
  onMounted(() => {
    if (!selectedTimeSlot.value) {
      router.push('/');
    }
  });
  
  const formatTimeSlot = () => {
    if (!selectedTimeSlot.value) return '';
    
    const day = selectedTimeSlot.value.day.charAt(0).toUpperCase() + selectedTimeSlot.value.day.slice(1);
    return `${day}, ${selectedTimeSlot.value.time} (${foglalo.selectedService})`;
  };
  
  const validateForm = () => {
    let isValid = true;
    
    errors.name = '';
    errors.phone = '';
    errors.email = '';

    if (!formData.name.trim()) {
      errors.name = 'A név megadása kötelező';
      isValid = false;
    }
    if (!formData.phone.trim()) {
      errors.phone = 'A telefonszám megadása kötelező';
      isValid = false;
    } else if (!/^[0-9]{6,11}$/.test(formData.phone)) {
      errors.phone = 'Érvénytelen telefonszám formátum';
      isValid = false;
    }
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Érvénytelen e-mail cím formátum';
      isValid = false;
    }
    
    return isValid;
  };
  
  const submitForm = () => {
    if (!validateForm()) {
      return;
    }
    const bookingData = {
      ...formData,
      service: foglalo.selectedService,
      day: selectedTimeSlot.value.day,
      time: selectedTimeSlot.value.time,
      timeSlotId: selectedTimeSlot.value.id
    };

    setTimeout(() => {
      toast.success('Sikeres foglalás! Köszönjük, hogy minket választott.', {
        timeout: 5000,
        position: "top-center",
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });

      setTimeout(() => {
        router.push('/');
      }, 2000);
    }, 1000);
  };
  
  const goBack = () => {
    router.push('/');
  };
  </script>
  
  <style scoped>
  .card {
    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
  }
  
  .card-header {
    font-weight: bold;
  }
  </style>