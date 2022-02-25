<template>
  <div v-if="isSuperAdmin">
    <pageheader header="Manage Users" lead="" />
    <b-container>
      <b-row v-if="loading" class="vh-50 text-center" align-v="center">
        <b-col id="spinner"><b-spinner label="Loading..."></b-spinner></b-col>
      </b-row>
    </b-container>

    <b-container>
      <b-row>
        <b-col class="mb-2" align="right">
          <b-button
            class="m-1"
            size="sm"
            @click="reroute('/admin/user/register')">
            Register User
          </b-button>
        </b-col>
      </b-row>
    </b-container>

    <b-table
      ref="user-list"
      primary-key="id"
      :items="items"
      :fields="fields"
      striped
      :sort-by="sortBy"
      :sort-desc="sortDesc"
      responsive="sm"
      :busy.sync="loading"
    >

      <template #cell(created)="row">
        {{ row.item.created.toLocaleString() }}
      </template>

      <template #cell(updated)="row">
        {{ row.item.updated.toLocaleString() }}
      </template>

      <template #cell(details)="row">
        <UserEditMenu
          :disabled="row.item.submitted"
          :guid="row.item.guid"
          :category="row.item.category"
          :show="['view', 'edit', 'delete']"
        />
      </template>

    </b-table>

  </div>
</template>

<script>

import formServices from '@/services/settings.services'
import pageheader from '@/components/common/PageHeader'
import UserEditMenu from '@/components/common/UserEditMenu'

export default {
  name: 'user-list',
  components: {
    pageheader, UserEditMenu
  },
  data () {
    return {
      loading: false,
      error: false,
      message: '',
      sortBy: 'username',
      sortDesc: true,
      items: [],
      fields: [
        {key: 'role', sortable: true},
        {key: 'username', sortable: true},
        {key: 'firstname', sortable: true},
        {key: 'lastname', sortable: true},
        {key: 'email', sortable: true},
        {key: 'created', sortable: true},
        {key: 'details', sortable: false}
      ]
    }
  },
  computed: {
    settings () {
      return this.$store.getters.getSettings
    },
    isSuperAdmin () {
      return this.$store.getters.isSuperAdmin
    }
  },
  methods: {
    async load () {
      try {
        this.loading = true
        this.items = await this.$store.dispatch('getUsers')
        this.loading = false
      }
      catch (err) {
        this.loading = false
        console.warn(err)
        await this.$store.dispatch('setMessage', {
          text: 'An error occurred. Registrations could not be retrieved',
          type: 'danger'
        })
      }
    },
    lookup(key, value) {
      return formServices.lookup(key, value)
    },
    async reroute(uri) {
      await this.$router.push(uri)
    }
  },
  beforeMount () {
    this.load()
  }
}
</script>
