<template>
  <b-container class="text-center">
    <b-button-group class="w-100">
      <b-button
        v-if="this.status.previous"
        variant="dark"
        @click="previousSection()"
      ><BIconCaretLeft/>Previous Section</b-button>
      <b-button
          variant="info"
          @click="save()"
        >{{submitLabel || "Save Section"}} <b-spinner class="ml-3" small v-if="saving" label="Saving..." /></b-button>
      <b-button
          v-if="this.status.next"
          :disabled="!sectionValidation"
          :variant="sectionValidation ? 'dark' : 'secondary'"
          @click="nextSection()"
        >Next Section<BIconCaretRight/></b-button>
    </b-button-group>
  </b-container>
</template>

<script>

import { BIconCaretLeft, BIconCaretRight } from 'bootstrap-vue'

export default {
  name: "registration-navigation-menu",
  props: ['updater', 'submitLabel'],
  components: {
    BIconCaretLeft, BIconCaretRight
  },
  data() {
    return {
      saving: false
    }
  },
  computed: {
    status () {
      return this.$store.getters.getStatus
    },
    sectionValidation () {
      return this.status.current
        ? this.$store.getters.getValidation[this.status.current]
        : false
    },
    registration () {
      return this.$store.getters.getRegistration || {}
    }
  },
  methods: {
    async save() {
      this.saving = true
      await this.$store.dispatch('saveRegistration', this.$props.updater)
      this.saving = false
    },
    previousSection () {
      this.save()
      this.$store.commit('resetMessage')
      this.$router.push({ name: this.status.previous })
    },
    nextSection () {
      this.save()
      this.$store.commit('resetMessage')
      this.$router.push({name: this.status.next})
    }
  }
}
</script>
