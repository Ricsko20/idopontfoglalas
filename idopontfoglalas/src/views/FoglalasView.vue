<template>
    <div>
      <h1>Időpontfoglalás</h1>
      <div class="szolgcontainer">
        <label id="l1" for="szolgaltatasok"><h4>Szolgáltatások: </h4></label>
        <select name="szolgaltatok" id="szolgaltatok" v-model="selectedService" @change="loadAvailableTimes">
          <option value="">Válassz egy szolgáltatást</option>
          <option value="ferfiFodrasz">Férfi fodrász</option>
          <option value="noiFodrasz">Női fodrász</option>
          <option value="orvos">Orvos</option>
          <option value="pszichologus">Pszichológus</option>
          <option value="mukornos">Műkörmös</option>
          <option value="tetovalo">Tetováló</option>
          <option value="hivatal">Hivatali ügyintézés</option>
          <option value="muszakiVizsga">Műszaki vizsga</option>
        </select>
      </div>
  
      <div class="idopontcontainer">
        <label for="idopontok"><h4>Elérhető időpontok</h4></label>
        <div v-if="availableTimes.length > 0">
          <div v-for="time in availableTimes" :key="time" class="time-slot">
            <button 
              :disabled="isTimeSlotBooked(time)" 
              @click="selectTime(time)"
              :class="{ booked: isTimeSlotBooked(time) }">
              {{ time }}
            </button>
          </div>
        </div>
        <div v-else>
          <p>Nincs elérhető időpont.</p>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import { useFoglalasStroe } from '@/stores/foglalas';
  
  const foglalo = useFoglalasStroe();

  const selectedService = ref('');
  const availableTimes = ref([]);
  
  onMounted(() => {
    foglalo.loadAppointments();
  });
  
  const loadAvailableTimes = () => {
    foglalo.selectedService = selectedService.value;
    foglalo.filterAvailableTimes();
    availableTimes.value = foglalo.availableTimes;
  };
  
  const isTimeSlotBooked = (time) => {
    return foglalo.appointments.some(appointment =>
      appointment.service === selectedService.value && appointment.time === time
    );
  };
  
  const selectTime = (time) => {
    alert(`Kiválasztott időpont: ${time}`);
  };
  
  </script>
  
  <style scoped>
  h1 {
    text-align: center;
    margin-top: 20px;
    margin-bottom: 100px;
  }
  
  h4 {
    margin-bottom: 30px;
  }
  
  #l1 {
    font-size: 20px;
  }
  
  .time-slot button {
    margin: 5px;
    padding: 10px;
    background-color: #4CAF50;
    color: white;
    border: none;
    cursor: pointer;
  }
  
  .time-slot button:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
  
  .time-slot button.booked {
    background-color: #f44336;
  }
  </style>
  