import { ref } from 'vue';
import axios from 'axios';
import { defineStore } from 'pinia';

export const useFoglalasStroe = defineStore('foglalas', () => {
  const appointments = ref([]);
  const selectedService = ref('');
  const selectedDay = ref('');
  const availableTimes = ref([]);
  const selectedTimeSlot = ref(null);

  const loadAppointments = () => {
    axios.get('http://localhost:3000/idopont')
      .then(resp => {
        appointments.value = resp.data;
      })
      .catch(error => {
        console.error('Hiba történt az időpontok betöltésekor:', error);
      });
  };

  const filterAvailableTimes = () => {
    if (!selectedService.value) return;

    availableTimes.value = [];
    
    // Get days to filter by
    const daysToFilter = selectedDay.value ? [selectedDay.value] : ["hétfő", "kedd", "szerda", "csütörtök", "péntek"];

    daysToFilter.forEach(day => {
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

  return { 
    appointments, 
    selectedService, 
    selectedDay,
    availableTimes, 
    selectedTimeSlot,
    loadAppointments, 
    filterAvailableTimes 
  };
});