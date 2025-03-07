import '../node_modules/bootstrap/dist/css/bootstrap.min.css'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";

const toastOptions = {
    transition: "Vue-Toastification__bounce",
    maxToasts: 3,
    newestOnTop: true
};

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(Toast, toastOptions)

app.mount('#app')
