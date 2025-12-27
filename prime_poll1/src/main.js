import { createApp } from 'vue'
import { createPinia } from 'pinia'
import AOS from "aos";
import "aos/dist/aos.css";
import "@/styles/main.css"

import App from './App.vue'
import router from './router'

const app = createApp(App)

// Initialize AOS
AOS.init({
  duration: 1000, 
  once: false, // whether animation should happen only once - while scrolling down
  mirror: true, // whether elements should animate out while scrolling past them
});

app.use(createPinia())
app.use(router)

app.mount('#app')
