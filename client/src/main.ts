import { createApp } from 'vue'
import App from './App.vue'
const app = createApp(App)

// @ts-ignore
import PrimeVue from 'primevue/config'
import ToastService from 'primevue/toastservice'
import Card from 'primevue/card'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import Avatar from 'primevue/avatar'
import Fieldset from 'primevue/fieldset'
import FileUpload from 'primevue/fileupload'
import Toast from 'primevue/toast';
import Toolbar from 'primevue/toolbar';
import Tooltip from 'primevue/tooltip';
import BlockUI from 'primevue/blockui';
import ProgressSpinner from 'primevue/progressspinner';

// @ts-ignore
import VueTheMask from 'vue-the-mask'

import 'primevue/resources/themes/saga-blue/theme.css';
import 'primevue/resources/primevue.min.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.min.css'

app.use(PrimeVue, {
  ripple: true
})
app.use(ToastService)
app.use(VueTheMask)

app.component('Toast', Toast)
app.component('Card', Card)
app.component('Button', Button)
app.component('InputText', InputText)
app.component('Avatar', Avatar)
app.component('Fieldset', Fieldset)
app.component('FileUpload', FileUpload)
app.component('Toolbar', Toolbar)
app.component('BlockUI', BlockUI)
app.component('ProgressSpinner', ProgressSpinner)
app.directive('tooltip', Tooltip)

app.mount('#app')