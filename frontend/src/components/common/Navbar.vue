<template>
  <div>
    <b-sidebar
      v-if="isLoggedIn && isAdmin"
      id="sidebar-profile"
      title="Your Profile"
      backdrop-variant="dark"
      backdrop
      style="z-index: 9999"
      shadow>
      <Profile />
    </b-sidebar>

    <b-navbar fixed="top" toggleable="lg" type="dark" variant="dark" style="z-index: 9990">
      <b-navbar-brand href="/registration">
        Long Service Awards Registration
      </b-navbar-brand>

      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

      <b-collapse id="nav-collapse" is-nav type="dark" variant="info">
        <b-navbar-nav>
          <li>
            <router-link class="nav-link" to="/" exact>Home</router-link>
          </li>
          <b-nav-item href="https://longserviceawards.gww.gov.bc.ca/">About</b-nav-item>
        </b-navbar-nav>
          <!-- Right aligned nav items -->
          <b-navbar-nav class="ml-auto" v-if="isLoggedIn">
            <b-nav-item-dropdown right class="btn btn-info text-light p-0">
              <template #button-content>
                <BIconPerson /> {{user.username}}
              </template>
              <b-dropdown-item v-b-toggle.sidebar-profile v-if="isAdmin">
                My Profile
              </b-dropdown-item>
              <b-dropdown-item>
                <router-link to="/submissions" exact>My Registration</router-link>
              </b-dropdown-item>
            </b-nav-item-dropdown>
          </b-navbar-nav>
      </b-collapse>
    </b-navbar>
  </div>
</template>
<script>

/**
 *
 */

import Profile from './UserProfile'
import { BIconPerson } from 'bootstrap-vue'

export default {
  name: "navbar",
  components: {
    Profile, BIconPerson
  },
  computed : {
    isLoggedIn () {
      return this.$store.getters.isAuthenticated
    },
    isAdmin () {
      return this.$store.getters.isAdmin
    },
    isSuperAdmin () {
      return this.$store.getters.isSuperAdmin
    },
    user () {
      return this.$store.getters.getUser
    },
    settings () {
      return this.$store.getters.getSettings
    }
  }
};
</script>
<style>
.navbar-dark .navbar-nav .nav-link {
  color: white !important;
}
</style>
