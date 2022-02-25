<template>
  <b-container fluid>
    <pageheader header="Registration" lead="Your Award Milestone" />
    <RegProgress active="milestone" />
    <b-alert v-if="Object.keys(milestone).length === 0" show variant="secondary">
      Please wait while your milestone information is loaded...
    </b-alert>
    <b-form v-else>
      <b-card
        header="Milestone Details"
        header-tag="header"
        bg-variant="light"
        header-class="font-weight-bold"
        class="mb-3"
      >
        <b-form-group>
          <b-form-group
            id="input-group-milestone"
            label="Select Your Milestone"
            label-for="input-milestone"
            label-class="font-weight-bold"
            class="mb-4"
          >
            <b-form-select
              id="input-milestone"
              v-model="milestone.selected"
              :options="options.milestones"
              :state="validate('milestone')"
            >
            </b-form-select>
            <b-form-invalid-feedback :state="validate('milestone')">
              This field is required.
            </b-form-invalid-feedback>
          </b-form-group>

          <b-form-group
            id="fieldset-milestone-qualifying-year"
            label="Qualifying Year"
            label-size="md"
            label-class="font-weight-bold"
            label-for="input-milestone-qualifying-year"
            v-slot="{ ariaDescribedby }"
            class="mb-4"
          >
            <p>During which year did you reach your milestone?</p>
            <b-form-radio
              v-for="(year, counter) in options.qualifyingYears"
              v-bind:key="counter"
              v-model="milestone.qualifyingYear"
              :aria-describedby="ariaDescribedby"
              name="input-milestone-qualifying-year"
              :value="year.value"
              :state="validate('qualifyingYear')"
            >
              {{year.text}}
            </b-form-radio>
            <b-form-invalid-feedback :state="validate('qualifyingYear')">
              This field is required.
            </b-form-invalid-feedback>
          </b-form-group>
        </b-form-group>

        <b-form-group
          id="fieldset-milestone-bcgeu"
          label="Are you a BCGEU Member?"
          label-size="md"
          label-class="font-weight-bold"
          label-for="input-milestone-bcgeu"
          v-slot="{ ariaDescribedby }"
          class="mb-4"
        >
          <b-form-checkbox
            id="input-milestone-bcgeu"
            v-model="milestone.isBCGEUMember"
            :value="1"
            :unchecked-value="0"
            :aria-describedby="ariaDescribedby"
          >Yes, I am a BCGEU Member</b-form-checkbox>
        </b-form-group>

        <b-form-group
          id="fieldset-milestone-retirement"
          label="Retiring This Year?"
          label-size="md"
          label-class="font-weight-bold"
          label-for="input-milestone-retirement"
          v-slot="{ ariaDescribedby }"
          class="mb-4"
        >
          <b-form-checkbox
            id="input-milestone-retirement"
            v-model="retirement.retiringThisYear"
            :value="1"
            :unchecked-value="0"
            :aria-describedby="ariaDescribedby"
            :state="validate('retirement')"
          >Yes, I am retiring in {{new Date().getFullYear()}}</b-form-checkbox>
        </b-form-group>
      </b-card>
      <RegMenu :updater="this.updater" />
    </b-form><!-- end registration form -->
  </b-container>
</template>

<script>

import pageheader from '../common/PageHeader'
import formServices from '../../services/options.services'
import RegProgress from '../common/RegProgress'
import RegMenu from '../common/RegMenu'
import { updateMilestone, updateRetirement } from "../../services/api.services";

export default {
  name: "registration-milestone",
  components: {
    pageheader,
    RegProgress,
    RegMenu
  },
  data() {
    return {
      options: {
        qualifyingYears: formServices.get('qualifying-years'),
        milestones: formServices.get('milestones')
      }
    }
  },
  methods: {
    updater: async (data) => {
      await updateMilestone(data)
      await updateRetirement(data)
    },
    lookup: (key, value) => {
      return formServices.lookup(key, value);
    }
  },
  computed: {
    milestone: {
      get () {
        return this.$store.getters.getRegistration.milestone;
      },
      set (value) {
        this.$store.commit("setMilestone", value )
      }
    },
    retirement: {
      get () {
        return this.$store.getters.getRegistration.retirement;
      },
      set (value) {
        this.$store.dispatch("setRetirement", value )
      }
    },
    validate(){
      return (field) => {
        const fields = {
          qualifyingYear: ()=>{
            return !!this.milestone.qualifyingYear
          },
          milestone: ()=>{
            return !!this.milestone.selected
          },
          retirement: ()=> {
            this.$store.dispatch('setStatus', {
              current: 'reg-step-milestone',
              previous: 'reg-step-identification',
              next: this.retirement.retiringThisYear
                ? 'reg-step-retirement'
                : 'reg-step-award-selection'
            })
            return !!this.retirement.retiringThisYear
          }
        }
        if (fields[field] === 'undefined') return false;
        return !!fields[field]();
      }
    },
    validation() {
      return this.$store.getters.getValidation.milestone
    },
    submitted() {
      return this.$store.getters.getRegistration.submitted
    }
  }
};
</script>
