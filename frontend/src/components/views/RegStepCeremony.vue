<template>
  <b-container fluid>
    <pageheader header="Registration" lead="Long Service Awards Ceremony" />
    <RegProgress active="ceremony" />

    <b-form v-if="!this.$store.getters.isError">

      <b-alert v-if="Object.keys(declarations).length===0" show variant="secondary">
        Please wait while your registration is loaded...
      </b-alert>

      <b-card v-else bg-variant="light" class="mb-3">

        <b-form-group
          id="fieldset-declarations-ceremony-opt-out"
          label="Will you be attending a Long Service Awards Ceremony?"
          label-size="md"
          label-class="font-weight-bold"
          label-for="input-declarations-declarations-ceremony-opt-out"
          v-slot="{ ariaDescribedby }"
          class="mb-4"
        >
          <b-form-checkbox
            id="input-declarations-declarations-ceremony-opt-out"
            v-model="declarations.ceremonyOptOut"
            :value="0"
            :unchecked-value="1"
            :aria-describedby="ariaDescribedby"
            :state="validate('ceremonyOptOut')"
          >Yes, I will be attending an LSA Ceremony</b-form-checkbox>
        </b-form-group>

      </b-card>
      <RegMenu :updater="this.updater" />
    </b-form><!-- end registration form -->
  </b-container>
</template>

<script>

import pageheader from '../common/PageHeader'
import RegProgress from '../common/RegProgress'
import RegMenu from '../common/RegMenu'
import {updateDeclarations } from "../../services/api.services";

export default {
  name: "registration-ceremony",
  components: {
    pageheader,
    RegProgress,
    RegMenu
  },
  methods: {
    updater: updateDeclarations
  },
  computed: {
    declarations: {
      get () {
        return this.$store.getters.getRegistration.declarations;
      },
      set (value) {
        this.$store.commit("setDeclarations", value )
      }
    },
    validate(){
      return (field) => {
        const fields = {
          ceremonyOptOut: () => {
            const { ceremonyOptOut=false } = this.$store.getters.getRegistration.declarations
            this.$store.dispatch('setStatus', {
              current: 'reg-step-ceremony',
              previous: 'reg-step-service-pins',
              next: ceremonyOptOut ? 'reg-step-contact' : 'reg-step-confirmation'
            })
            return !this.declarations.ceremonyOptOut
          }
        }
        if (fields[field] === 'undefined') return false;
        return !!fields[field]();
      }
    },
    validation() {
      return this.$store.getters.getValidation.declarations
    }
  },
  async beforeCreate() {
    // update the registration navigation
    const { ceremonyOptOut=false } = this.$store.getters.getRegistration.declarations
    this.$store.dispatch('setStatus', {
      current: 'reg-step-ceremony',
      previous: 'reg-step-service-pins',
      next: ceremonyOptOut ? 'reg-step-contact' : 'reg-step-confirmation'
    })
      .catch(err => {console.warn(err)})
  }
};
</script>
