<template>
  <div>
    <b-button
      v-if="show.includes('edit')"
      size="sm"
      :disabled="disabled"
      class="m-1"
      @click="reroute(`/admin/user/edit/${guid}`)"
    >
      Edit
    </b-button>
    <b-button
      v-if="show.includes('delete')"
      size="sm"
      :disabled="disabled"
      class="m-1"
      @click="reroute(`/admin/user/delete/${guid}`)"
    >
      Delete
    </b-button>
  </div>
</template>
<script>

export default {
  name: "global-message",
  props: {
    guid: String,
    disabled: Boolean,
    category: String,
    show: Array
  },
  computed : {
    user () {
      return this.$store.getters.getRegistration
    },
    settings () {
      return this.$store.getters.getSettings
    },
    isAdmin () {
      return this.$store.getters.isAdmin
    }
  },
  methods: {
    async reroute(uri) {
      await this.$router.push(uri)
    },
  }
};
</script>
