<template>
  <div class="container mt-5">
    <h1 class="text-center mb-4">Időpontfoglalás</h1>
    
    <div class="row">
      <div class="col-md-6">
        <div class="form-group">
          <label for="szolgaltatok"><h4>Szolgáltatások:</h4></label>
          <select class="form-control" id="szolgaltatok" v-model="selectedService" @change="loadAvailableTimes">
            <option value="">Válassz egy szolgáltatást</option>
            <option value="orvos">Orvos</option>
            <option value="pszichológus">Pszichológus</option>
            <option value="műkörmös">Műkörmös</option>
            <option value="fodrász férfi">Férfi fodrász</option>
            <option value="fodrász női">Női fodrász</option>
            <option value="műszaki vizsga">Műszaki vizsga</option>
            <option value="tetováló">Tetováló</option>
            <option value="hivatali ügyintézés">Hivatali ügyintézés</option>
          </select>
        </div>
      </div>
      
      <div class="col-md-6">
        <div class="form-group">
          <label for="napok"><h4>Napok:</h4></label>
          <select class="form-control" id="napok" v-model="selectedDay" @change="loadAvailableTimes" :disabled="!selectedService">
            <option value="">Válassz egy napot</option>
            <option v-for="day in daysOfWeek" :key="day" :value="day">{{ capitalizeFirstLetter(day) }}</option>
          </select>
        </div>
      </div>
    </div>

    <div class="idopontcontainer">
      <label for="idopontok"><h4>Elérhető időpontok</h4></label>
      <table class="table table-bordered mt-3">
        <thead class="thead-light">
          <tr>
            <th scope="col">Nap</th>
            <th scope="col">Idő</th>
            <th scope="col">Állapot</th>
            <th scope="col">Művelet</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="displayedTimeSlots.length > 0" v-for="(timeSlot, index) in displayedTimeSlots" :key="index">
            <td>{{ capitalizeFirstLetter(timeSlot.day) }}</td>
            <td>{{ timeSlot.time }}</td>
            <td>
              <span v-if="timeSlot.isBooked" class="text-danger">Foglalt</span>
              <span v-else class="text-success">Szabad</span>
            </td>
            <td>
              <button 
                class="btn" 
                :class="{
                  'btn-success': !timeSlot.isBooked,
                  'btn-danger': timeSlot.isBooked,
                  'disabled': timeSlot.isBooked
                }" 
                @click="selectTime(timeSlot)"
                :disabled="timeSlot.isBooked">
                {{ timeSlot.isBooked ? 'Foglalva' : 'Kiválaszt' }}
              </button>
            </td>
          </tr>
          <tr v-else>
            <td colspan="4" class="text-center">
              <span v-if="!selectedService">Válassz egy szolgáltatást</span>
              <span v-else-if="!selectedDay">Válassz egy napot</span>
              <span v-else>Nincs elérhető időpont a kiválasztott napon és szolgáltatásnál.</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useFoglalasStroe } from '@/stores/foglalas';

const foglalo = useFoglalasStroe();
const router = useRouter();

const selectedService = ref('');
const selectedDay = ref('');
const daysOfWeek = ["hétfő", "kedd", "szerda", "csütörtök", "péntek"];
const timeSlots = ref([]);

onMounted(() => {
  foglalo.loadAppointments();
});

const loadAvailableTimes = () => {
  if (!selectedService.value) {
    timeSlots.value = [];
    return;
  }

  foglalo.selectedService = selectedService.value;
  generateAllTimeSlots();
};

const generateAllTimeSlots = () => {
  timeSlots.value = [];
  daysOfWeek.forEach(day => {
    for (let hour = 8; hour <= 16; hour++) {
      const time = `${hour}:00`;
      const isBooked = foglalo.appointments.some(appointment => 
        appointment.szolgaltatas === selectedService.value && 
        appointment.day === day && 
        appointment.ora === hour
      );
      
      timeSlots.value.push({
        id: `${day}-${hour}`,
        day: day,
        time: time,
        isBooked: isBooked
      });
    }
  });
};

const displayedTimeSlots = computed(() => {
  if (!selectedService.value || !timeSlots.value.length) {
    return [];
  }
  
  if (selectedDay.value) {
    return timeSlots.value.filter(slot => slot.day === selectedDay.value);
  }
  
  return timeSlots.value;
});

const selectTime = (timeSlot) => {
  if (!timeSlot.isBooked) {
    foglalo.selectedTimeSlot = timeSlot;
    router.push('/urlap');
  }
};

const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};
</script>

<style scoped>
.idopontcontainer {
  margin-top: 20px;
}

.table td {
  vertical-align: middle;
}

.table .btn {
  width: 100%;
}
</style>