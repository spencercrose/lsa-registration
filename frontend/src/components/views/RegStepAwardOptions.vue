<template>
  <b-container fluid>
    <pageheader header="Registration" lead="Your Award Options" />
    <RegProgress active="award-options" />

    <b-alert v-if="Object.keys(awardOptions || {}).length===0" show variant="secondary">
      Please wait while your award options are loaded...
    </b-alert>

    <b-alert v-if="!this.$store.getters.isLoading && !awardOptions[0].options" show variant="warning">
      This award does not have any options.
    </b-alert>

    <b-form v-else>
      <b-card
        header="Award Options"
        header-tag="header"
        bg-variant="light"
        header-class="font-weight-bold"
        class="mb-3"
      >
        <b-form-group>
          <b-form-group
            v-for="(awardOption, index) in awardOptions"
            v-bind:key="index"
            :id='`input-group-award-options-${index}`'
            :label="`Select ${awardOption.label}`"
            :label-for='`input-award-options-${index}`'
            label-class="font-weight-bold"
            class="mb-4"
          >
            <b-form-select
              :id='`input-award-options-${index}`'
              v-model="awardOption.selected"
              :options="awardOption.options"
              :state="!!awardOption.selected"
              @change="updateOptions(awardOption)"
            >
            </b-form-select>
            <b-form-invalid-feedback :state="!!awardOption.selected">
              This field is required.
            </b-form-invalid-feedback>
          </b-form-group>

        </b-form-group>
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
  methods: {
    updater: updateAward,
    updateOptions() {
      const updatedOptions = {
        type: this.selectedOptions.type,
        selections: this.awardOptions.map(option => {
          return {
            key: option.key,
            value: option.selected
          }
        })
      }
      this.$store.commit('setAwardOptions', updatedOptions)
      console.log(this.selectedOptions)
    }
  },
  computed: {
    awardOptions() {

      // determine award type based on short name
      // TODO add award type column to awards table

      const pecsfOptions = this.$store.getters.getPecsfOptions
      console.log(pecsfOptions)
      const options = {
        watch: [
          {
            key: 'watch-size',
            label: 'Watch Size',
            options: optionServices.get('award-options-watch-sizes'),
            selected: null
          },
          {
            key: 'watch-face',
            label: 'Watch Face',
            options: optionServices.get('award-options-watch-faces'),
            selected: null},
          {
            key: 'watch-strap',
            label: 'Watch Strap',
            options: optionServices.get('award-options-watch-straps'),
            selected: null
          },
          {
            key: 'watch-engraving',
            label: 'Watch Engraving',
            options: 'text-input',
            selected: ''
          }
        ],
        bracelet: [
          {
            key: 'bracelet-size',
            label: 'Bracelet Size',
            options: optionServices.get('award-options-bracelet-sizes'),
            selected: null
          }
        ],
        pecsf: [
          {
            key: 'pecsf-region-1',
            label: 'Choose a region for your first donation',
            options: pecsfOptions.regions,
            selected: null
          },
          {
            key: 'pecsf-charity-1',
            label: 'Choose a charity for your first donation',
            options: pecsfOptions.charities,
            selected: null
          },
          {
            key: 'pecsf-region-2',
            label: 'Choose a region for your second donation',
            options: pecsfOptions.regions,
            selected: null
          },
          {
            key: 'pecsf-charity-2',
            label: 'Choose a charity for your second donation',
            options: pecsfOptions.charities,
            selected: null
          }
        ]
      }

      // update filtered options with previous selections
      // - only return matching award options
      const awardType = this.selectedOptions.type
      if (!options[awardType]) return [{options: null}]
      const filteredOptions = options[awardType]
      const selections = this.selectedOptions.selections || []
      filteredOptions.map(option => {
          selections.forEach(selectedOption => {
            if (selectedOption.key === option.key) option.selected = selectedOption.value
          })
        return option
      });

      // return mapped options
      return filteredOptions
    },
    selectedOptions() {
      return this.$store.getters.getRegistration.awardSelection.options;
    },
    validate() {
      return true
    },
    validation() {
      return this.$store.getters.getValidation.awardSelection
    }
  },
  async beforeCreate() {
    // set registration workflow status
    this.$store.dispatch('setStatus', {
      current: 'reg-step-award-options',
      previous: 'reg-step-award-selection',
      next: 'reg-step-service-pins'
    })
      .catch(err => {console.warn(err)})
  }
};
</script>
