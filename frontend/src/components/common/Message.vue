<template>
  <div>
    <b-navbar fixed="top" class="p-0 m-0" style="top:60px">
      <b-alert
        class="w-100"
        show="5"
        fade
        v-if="message.text"
        :variant="message.type"
        :dismissible="message.dismissible"
        @dismissed="message={ text:'', type:'' }"
      >
        <b-spinner class="ml-3" small v-if="message.spinner" label="Saving..." /> {{message.text}}
      </b-alert>
    </b-navbar>
  </div>
</template>
<script>

export default {
  name: "global-message",
  computed : {
    message: {
      get () {
        return this.$store.getters.getMessage;
      },
      set (value) {
        this.$store.dispatch("setMessage", value )
      }
    }
  }
};
</script>
