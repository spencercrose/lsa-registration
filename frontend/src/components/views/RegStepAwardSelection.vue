<template>
  <b-container fluid>
    <pageheader header="Registration" lead="Your Award Selection" />
    <RegProgress active="award-selection" />
    <b-alert v-if="Object.keys(awardSelection || {}).length===0" show variant="secondary">
      Please wait while your award selections are loaded...
    </b-alert>
    <b-form v-else>
      <b-card
        :header="`Awards for Milestone Year ${milestone}`"
        header-tag="header"
        bg-variant="light"
        header-class="font-weight-bold"
        class="mb-3"
      >
        <b-card-group columns>
          <b-card
            v-for="(award, index) in awards"
            v-bind:key="index"
            :title="award.name"
            :img-src="fallbackImg"
            :img-alt="award.shortName"
            img-top
            :disabled="awardSelection.awardId === award.id"
            :bg-variant="awardSelection.awardId === award.id ? 'info' : 'light'"
            :text-variant="awardSelection.awardId === award.id ? 'white' : 'dark'"
          >
            <b-card-text>
              {{award.description}}
            </b-card-text>

            <template #footer>
              <b-button
                block
                type="button"
                :variant="awardSelection.awardId === award.id ? 'info' : 'dark'"
                @load="updateMenu()"
                @click="selectAward(award.id)"
              >
                {{ awardSelection.awardId === award.id ? 'Selected' : 'Select Award' }}
              </b-button>
            </template>
          </b-card>

        </b-card-group>
      </b-card>
      <RegMenu :updater="updater" />
    </b-form><!-- end registration form -->
  </b-container>
</template>

<script>

import pageheader from '../common/PageHeader'
import RegProgress from '../common/RegProgress'
import RegMenu from '../common/RegMenu'
import {updateAward} from "../../services/api.services";
import optionServices from "../../services/options.services";

export default {
  name: "registration-step-awardSelection",
  components: {
    pageheader,
    RegProgress,
    RegMenu
  },
  data() {
    return {
      fallbackImg: 'https://longserviceawards.gww.gov.bc.ca/wp-content/uploads/2022/02/award-stock.jpg'
    }
  },
  methods: {
    updater: updateAward,
    selectAward: function(id) {
      const awardType = optionServices.getAwardType(id, this.awards)
      this.$store.commit("setAwardSelection", { awardId: id, options: {type: awardType} })
      this.updateMenu()
    },
    updateMenu() {}
  },
  computed: {
    awardSelection() {
      // update the registration navigation
      const selectedAward = this.$store.getters.getRegistration.awardSelection
      const { retiringThisYear=false } = this.$store.getters.getRegistration.retirement
      this.$store.commit('setStatus', {
        current: 'reg-step-award-selection',
        previous: retiringThisYear ? 'reg-step-retirement' : 'reg-step-milestone',
        next: selectedAward.options.type ? 'reg-step-award-options' : 'reg-step-service-pins'
      })
      return selectedAward
    },
    awards() {
      // load awards for requested milestone
      return this.$store.getters.getAwards
    },
    milestone() {
      // load awards for requested milestone
      return this.$store.getters.getMilestone
    },
    validation() {
      return this.$store.getters.getValidation.awardSelection
    }
  }
};
</script>
