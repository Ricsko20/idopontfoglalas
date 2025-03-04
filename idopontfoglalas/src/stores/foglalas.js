import { ref } from 'vue';
import axios from 'axios';
import { defineStore } from 'pinia';

export const useFoglalasStroe = defineStore('foglalas', () => {
  const appointments = ref([]);
  const selectedService = ref('');
  const availableTimes = ref([]);

  // Időpontok betöltése
  const loadAppointments = () => {
    axios.get('http://localhost:3000/idopont')
      .then(resp => {
        appointments.value = resp.data;
        filterAvailableTimes();
      })
      .catch(error => {
        console.error('Hiba történt az időpontok betöltésekor:', error);
      });
  };
  const filterAvailableTimes = () => {
    if (!selectedService.value) return;

    const startHour = 8;
    const endHour = 16;
    availableTimes.value = [];

    for (let hour = startHour; hour <= endHour; hour++) {
      const time = `${hour}:00`;

      const isBooked = appointments.value.some(appointment =>
        appointment.service === selectedService.value && appointment.time === time
      );

      if (!isBooked) {
        availableTimes.value.push(time);
      }
    }
  };

  return { appointments, selectedService, availableTimes, loadAppointments, filterAvailableTimes };
});
