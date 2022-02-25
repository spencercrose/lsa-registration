/**
 * Premier's Awards: Registration Application
 * Developer: Spencer Rose (BCGov, PSA/PSECI)
 * Version: 1.0.0
 * Module: main.js
 *
 * **/

import Vue from 'vue'
import Vuex from 'vuex'
import App from './App'
import VueRouter from 'vue-router'
import routes from './routes'
import auth from './services/store.services'
import { BootstrapVue } from 'bootstrap-vue'
import '../node_modules/bootstrap/dist/css/bootstrap.css'
import '../node_modules/bootstrap-vue/dist/bootstrap-vue.css'
import {setTitle} from './services/router.services'

Vue.use(BootstrapVue)
Vue.use(VueRouter)
Vue.use(Vuex)
Vue.config.productionTip = false

const router = new VueRouter({
  base: '/registration',
  mode: 'history',
  routes: routes
})

// define data store
const store = new Vuex.Store(auth)

// This callback runs before every route change, including on page load.
router.beforeEach(setTitle);

// instantiate app
new Vue({
    store,
    el: '#app',
    router,
    render(h) { return h(App) },
    async beforeCreate () {
      try {
        // authenticate user and load registration
        const user = await store.dispatch('authenticate')
        await store.dispatch('loadRegistration', user.guid)
      } catch (err) {
        if (err.response) {
          // GUID not found: start a new registration
          if (err.response.status === 404) {
            await store.dispatch('initRegistration')
          } else {
            // Something happened in setting up the request that triggered an Error
            console.warn('Error', err.message);
            await store.dispatch('handleError',
              {text: 'An error occurred. Your request could not be completed.', type: 'danger'}
            )
          }
        } else if (err.request) {
          // The request was made but no response was received
          // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
          // http.ClientRequest in node.js
          console.warn(err.request);
          await store.dispatch('handleError',
            {text: 'An error occurred. Your request could not be completed.', type: 'danger'}
          )
        } else {
          // Something happened in setting up the request that triggered an Error
          console.warn('Error', err.message);
          await store.dispatch('handleError',
            {text: 'An error occurred. Your request could not be completed.', type: 'danger'}
          )
        }
        // console.warn(error.config);
      }
    }
})


