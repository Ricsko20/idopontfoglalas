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

    availableTimes.value = [];

    const daysOfWeek = ["hétfő", "kedd", "szerda", "csütörtök", "péntek"];

    daysOfWeek.forEach(day => {
      for (let hour = 8; hour <= 16; hour++) {
        const timeSlot = `${hour}:00`;

        const isBooked = appointments.value.some(appointment => 
          appointment.szolgaltatas === selectedService.value && 
          appointment.day === day && 
          appointment.ora === hour
        );

        if (!isBooked) {
          availableTimes.value.push({ day, time: timeSlot });
        }
      }
    });
  };

  return { appointments, selectedService, availableTimes, loadAppointments, filterAvailableTimes };
});
