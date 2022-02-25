<template>
  <b-card
    :header="`Registration Progress: Step ${activeIndex + 1} / ${steps.length}`"
    header-tag="header"
    class="mb-3"
  >
    <b-progress class="mt-2" :max="steps.length">
      <b-progress-bar :value="activeIndex" variant="success" :striped="true"></b-progress-bar>
      <b-progress-bar :value="1" variant="dark">{{ activeStep }}</b-progress-bar>
    </b-progress>

  </b-card>
</template>
<script>

import optionServices from "../../services/options.services";

export default {
  name: "registration-progress",
  props: {
    active: String
  },
  computed: {
    steps() {
      const registration = this.$store.getters.getRegistration;
      return optionServices.get('registration-steps').filter(step => {
        return step.value === 'identification'
          || step.value === 'milestone'
          || step.value === 'retirement' && registration.retirement.retiringThisYear
          || step.value === 'award-selection'
          || step.value === 'award-options' && registration.awardSelection.options.type
          || step.value === 'service-pins'
          || step.value === 'ceremony'
          || step.value === 'contact' && registration.declarations.ceremonyOptOut
          || step.value === 'confirmation'
      })
    },
    activeIndex() {
      let activeIndex = 0
      this.steps.forEach((step, index) => {
        if (step.value === this.active) activeIndex = index
      })
      return activeIndex
    },
    activeStep() {
      return optionServices.lookup('registration-steps', this.$props.active) || ''
    },
    registration() {
      return this.$store.getters.getRegistration;
    },
    validation() {
      return this.$store.getters.getValidation;
    }
  }
};
</script>
<style>

.active {
  background-color: #2c3e50 !important;
}

.btn-circle.btn-xl {
  width: 70px;
  height: 70px;
  padding: 10px 16px;
  border-radius: 35px;
  font-size: 24px;
  line-height: 1.33;
}

.btn-circle {
  width: 30px;
  height: 30px;
  padding: 6px 0;
  border-radius: 15px;
  text-align: center;
  font-size: 12px;
  line-height: 1.42857;
}


</style>
