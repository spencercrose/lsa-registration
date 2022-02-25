<template>
  <div>

    <RedirectButton
      label="Return to Registrations"
      :show="done"
      :uri="isAdmin ? '/admin/list' : '/list'"
    />

    <b-card id="registration-delete" title="Delete Registration" v-if="validation">
      <p class="my-4">Do you want to delete this registration?</p>
      <b-table stacked :items="[registration]" :fields="[
        {key: 'category'},
        {key: 'title', label: 'Title/Nominee'},
        {key: 'updatedAt', label: 'Last Updated'},
        {key: 'createdAt', label: 'Created'},
      ]">
        <template #cell(category)="row">
          {{ lookup('categories', row.item.category) }}
        </template>

        <template #cell(createdAt)="row">
          {{ !!row.item.createdAt ? row.item.createdAt.toLocaleString() : '' }}
        </template>

        <template #cell(updatedAt)="row">
          {{ !!row.item.updatedAt ? row.item.updatedAt.toLocaleString() : '' }}
        </template>

      </b-table>
      <b-card-footer align="center">
        <b-button
          :disabled="done"
          class="m-2"
          type="button"
          @click="remove()"
        >Delete</b-button>
        <b-button
          :disabled="done"
          class="m-2"
          type="button"
          variant="secondary"
          @click="reroute('/')"
        >Cancel</b-button>
      </b-card-footer>
    </b-card>
  </div>
</template>

<script>

import RedirectButton from '@/components/common/RedirectButton'
import formServices from '@/services/settings.services'

export default {
  name: 'registration-delete',
  components: {
    RedirectButton
  },
  data() {
    return {
      done: false
    }
  },
  computed: {
    registration() {
      return this.$store.getters.getRegistration
    },
    validation() {
      return !!this.registration._id
    },
    isAdmin () {
      return this.$store.getters.isAdmin
    }
  },
  methods: {
    lookup(key, item) {
      return formServices.lookup(key, item)
    },
    async remove () {
      const id = this.$route.params.id || '';
      this.$store.dispatch('removeRegistration', id)
        .catch(err => {
          console.error(err)
          this.$store.dispatch('handleError',
            {text: 'Registration could not be deleted.', type: 'danger'}
          )
      }).finally(()=>{this.done = true})
    },
    async reroute(uri) {
      await this.$router.push(uri)
    }
  },
  async beforeCreate() {
    this.$store.dispatch('loadRegistration', this.$route.params.id)
      .catch(err => {
        console.error(err)
        this.$store.dispatch('handleError',
          {text: 'Registration failed to load.', type: 'danger'}
        )
      })
  }
}
</script>
