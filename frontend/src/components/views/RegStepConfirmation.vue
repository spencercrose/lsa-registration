<template>
  <b-container fluid>
    <pageheader header="Registration" lead="Confirm Your Registration" />
    <RegProgress active="confirmation" />

    <b-form v-if="!this.$store.getters.isError">

      <b-alert v-if="Object.keys(registration || {}).length===0" show variant="secondary">
        Please wait while your registration is loaded...
      </b-alert>

      <div v-else class="mb-3">
        <b-card>
          <b-container class="p-3">
            <b-row class="mb-4">
              <b-col>
                <h3 class="text-center">
                  Registration Details
                </h3>
              </b-col>
            </b-row>
            <b-row>
              <b-col cols="3"><h5>Identification</h5></b-col>
              <b-col>
                <b-table
                  stacked
                  :items="[registration.identification]"
                  :fields="[
                    {key: 'employeeNumber', label: 'Employee Number'},
                    {key: 'fullName', label: 'Full Name'},
                    {key: 'governmentEmail', label: 'Government Email'},
                    {key: 'governmentPhoneNumber', label: 'Government Phone'},
                    {key: 'organizationId', label: 'Ministry/Organization'},
                    {key: 'branchName', label: 'Branch'}
                    ]"
                  striped
                  responsive="sm"
                  primary-key="id"
                >
                  <template #cell(organizationId)="identity">
                    {{ lookupOrganization(identity.item.organizationId) }}
                  </template>
                </b-table>
              </b-col>
            </b-row>
            <b-row>
              <b-col cols="3"><h5>Milestone</h5></b-col>
              <b-col>
                <b-table
                  stacked
                  :items="[registration.milestone]"
                  :fields="[
                    {key: 'selected', label: 'Your Milestone'},
                    {key: 'qualifyingYear', label: 'Your Qualifying Year'},
                    {key: 'isBCGEUMember', label: 'BCGEUMember'}
                    ]"
                  striped
                  responsive="sm"
                  primary-key="id"
                >
                  <template #cell(isBCGEUMember)="cell">
                    {{ cell.item.isBCGEUMember ? 'Yes' : 'No' }}
                  </template>
                </b-table>
              </b-col>
            </b-row>
            <b-row>
              <b-col cols="3"><h5>Award</h5></b-col>
              <b-col>
                <b-table
                  v-if="lookupAward(registration.awardSelection.awardId)"
                  stacked
                  :items="[lookupAward(registration.awardSelection.awardId)]"
                  :fields="[
                    {key: 'name', label: 'Award Name'},
                    {key: 'description', label: 'Description'},
                    ]"
                  striped
                  responsive="sm"
                  primary-key="id"
                >
                </b-table>
              </b-col>
            </b-row>
            <b-row>
              <b-col cols="3"><h5>Options</h5></b-col>
              <b-col>
                <b-table
                  stacked
                  :items="[registration.awardSelection.options]"
                  striped
                  responsive="sm"
                  primary-key="id"
                >
                </b-table>
              </b-col>
            </b-row>
            <b-row>
              <b-col cols="3"><h5>Supervisor Contact Info (Service Pin)</h5></b-col>
              <b-col>
                <b-table
                  stacked
                  :items="[registration.servicePins]"
                  :fields="[
                    {key:'supervisorFullName', label:'Full Name'},
                    {key:'supervisorPOBox', label:'P.O. Box'},
                    {key:'supervisorAddressPrefix', label:'Prefix'},
                    {key:'supervisorAddressStreetAddress', label:'Street'},
                    {key:'supervisorAddressPostalCode', label:'Postal Code'},
                    {key:'supervisorAddressCommunity', label:'Community'},
                    {key:'supervisorEmail', label:'Email'}
                    ]"
                  striped
                  responsive="sm"
                  primary-key="id"
                >
                </b-table>
              </b-col>
            </b-row>
            <b-row>
              <b-col cols="3"><h5>Personal Contact Info</h5></b-col>
              <b-col>
                <b-table
                  stacked
                  :items="[registration.contact]"
                  :fields="[
                    {key:'personalFullName', label:'Full Name'},
                    {key:'personalAddressPrefix', label:'Prefix'},
                    {key:'personalAddressStreetAddress', label:'Street'},
                    {key:'personalAddressPostalCode', label:'Postal Code'},
                    {key:'personalAddressCommunity', label:'Community'},
                    {key:'personalEmail', label:'Email'},
                    {key:'personalPhoneNumber', label:'Phone'},
                    ]"
                  striped
                  responsive="sm"
                  primary-key="id"
                >
                </b-table>
              </b-col>
            </b-row>
            <b-row>
              <b-col cols="3"><h5>Ceremony</h5></b-col>
              <b-col>
                <b-table
                  stacked
                  :items="[registration.declarations]"
                  :fields="[
                    {key:'ceremonyOptOut', label:'I plan to attend the Awards Ceremony'},
                    ]"
                  striped
                  responsive="sm"
                  primary-key="id"
                >
                  <template #cell(ceremonyOptOut)="cell">
                    {{ cell.item.ceremonyOptOut ? 'Yes' : 'No' }}
                  </template>
                </b-table>
              </b-col>
            </b-row>
          </b-container>
        </b-card>

        <b-card bg-variant="light" class="mb-3">
          <b-form-group
            id="fieldset-declarations-is-declared"
            label="Declaration"
            label-size="md"
            label-class="font-weight-bold"
            label-for="input-declarations-is-declared"
            v-slot="{ ariaDescribedby }"
            class="mb-4"
          >
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus in arcu erat. Fusce turpis nibh, vehicula eget urna accumsan, placerat tincidunt tortor. Vivamus ante ligula, commodo eu nulla a, egestas vehicula erat. Vivamus pharetra tellus ligula, ac euismod neque venenatis nec. Cras blandit est nec convallis ultricies. Nam ut laoreet ante. Integer sed tempus sapien. Phasellus sodales orci ac dui eleifend aliquam.</p>
            <b-form-checkbox
              id="input-declarations-is-declared"
              v-model="declarations.isDeclared"
              :value="1"
              :unchecked-value="0"
              :aria-describedby="ariaDescribedby"
              :state="validate('isDeclared')"
            >I declare the information provided in this registration to be accurate.</b-form-checkbox>
            <b-form-invalid-feedback :state="validate('isDeclared')">
              This field is required.
            </b-form-invalid-feedback>
          </b-form-group>

          <b-form-group
            id="fieldset-declarations-survey-participation"
            label="Would you like to participate in our survey?"
            label-size="md"
            label-class="font-weight-bold"
            label-for="input-declarations-survey-participation"
            v-slot="{ ariaDescribedby }"
            class="mb-4"
          >
            <b-form-checkbox
              id="input-declarations-survey-participation"
              v-model="declarations.surveyParticipation"
              :value="1"
              :unchecked-value="0"
              :aria-describedby="ariaDescribedby"
              :state="validate('surveyParticipation')"
            >Yes, I would like to participate in the LSA survey</b-form-checkbox>
          </b-form-group>

        </b-card>

        <RegMenu :updater="this.updater" submit-label="Submit Registration" />
      </div>
    </b-form>
  </b-container>
</template>

<script>

import pageheader from '../common/PageHeader'
import RegProgress from '../common/RegProgress'
import RegMenu from '../common/RegMenu'
import optionServices from '../../services/options.services'
import {updateDeclarations} from "../../services/api.services";

export default {
  name: "registration-declarations",
  components: {
    pageheader,
    RegProgress,
    RegMenu
  },
  computed: {
    registration () {
      return this.$store.getters.getRegistration
    },
    declarations: {
      get () {
        // update the registration navigation
        const { ceremonyOptOut=false } = this.$store.getters.getRegistration.declarations
        this.$store.dispatch('setStatus', {
          current: 'reg-step-confirmation',
          previous: ceremonyOptOut ? 'reg-step-contact' : 'reg-step-ceremony',
          next: null
        })
        return this.$store.getters.getRegistration.declarations;
      },
      set (value) {
        this.$store.commit("setDeclarations", value )
      }
    },
    organizations() {
      return this.$store.getters.getOrganizations
    },
    awards() {
      return this.$store.getters.getAwards
    },
    validate(){
      return (field) => {
        const fields = {
          isDeclared: () => {
            return !!this.declarations.isDeclared
          },
          surveyParticipation: () => {
            return !!this.declarations.surveyParticipation
          }
        }
        if (fields[field] === 'undefined') return false;
        return !!fields[field]();
      }
    },
  },
  methods: {
    updater: updateDeclarations,
    lookup(key, value) {
      return optionServices.lookup(key, parseInt(value))
    },
    lookupOrganization(value) {
      return optionServices.lookup('organizations', parseInt(value), {organizations: this.organizations})
    },
    lookupAward(value) {
      return optionServices.getAwardDetails(parseInt(value), this.awards)
    }
  }
}
</script>
