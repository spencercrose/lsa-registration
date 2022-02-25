<template>
  <b-container fluid>
    <pageheader header="Registration" lead="Your Service Pin" />
    <RegProgress active="service-pins" />
    <b-alert v-if="Object.keys(servicePins).length===0" show variant="secondary">
      Please wait while your service pin information is loaded...
    </b-alert>
    <b-form v-else>
      <b-card
        header="Service Pins"
        header-tag="header"
        bg-variant="light"
        header-class="font-weight-bold"
        class="mb-3"
      >
        <p>Your supervisor's contact information will assist us in preparing and
          shipping your award and service pin.</p>
        <p><b>Please note that for Victoria offices, a P.O. box number is required.</b></p>

        <b-form-group
          label-cols-lg="3"
          label="Supervisor Address"
          label-size="md"
          label-class="font-weight-bold"
        >
          <b-form-group
            id="fieldset-supervisor-address-pobox"
            label="P.O. Box"
            label-for="input-supervisor-address-pobox"
          >
            <b-form-input
              id="input-supervisor-address-pobox"
              v-model="servicePins.supervisorPOBox"
              placeholder="Supervisor P.O. Box number"
              disabled
            />
          </b-form-group>

          <b-form-group
            id="fieldset-supervisor-address-prefix"
            label="Address Prefix"
            label-for="input-supervisor-address-prefix"
          >
            <b-form-input
              id="input-supervisor-address-prefix"
              v-model="servicePins.supervisorAddressPrefix"
              placeholder="Supervisor address prefix"
            />
          </b-form-group>

          <b-form-group
            id="fieldset-supervisor-address-street-address"
            label="Street Address"
            label-for="input-supervisor-address-street-address"
          >
            <b-form-input
              id="input-supervisor-address-street-address"
              v-model="servicePins.supervisorAddressStreetAddress"
              placeholder="Supervisor street address"
              :state="validate('supervisorAddressStreetAddress')"
            />
            <b-form-invalid-feedback :state="validate('supervisorAddressStreetAddress')">
              This field is required.
            </b-form-invalid-feedback>
          </b-form-group>

          <b-form-group
            id="fieldset-supervisor-address-postalcode"
            label="Postal Code"
            label-for="input-supervisor-address-postalcode"
          >
            <b-form-input
              id="input-supervisor-address-postalcode"
              v-model="servicePins.supervisorAddressPostalCode"
              placeholder="A0A 0A0"
              :state="validate('supervisorAddressPostalCode')"
            />
            <b-form-invalid-feedback :state="validate('supervisorAddressPostalCode')">
              Enter a valid Canadian postal code. This field is required.
            </b-form-invalid-feedback>
          </b-form-group>

          <b-form-group
            id="fieldset-supervisor-address-community"
            label="City or Community"
            label-for="input-supervisor-address-community"
          >
            <b-form-input
              id="input-supervisor-address-community"
              v-model="servicePins.supervisorAddressCommunity"
              placeholder="Supervisor city or community"
              :state="validate('supervisorAddressCommunity')"
            />
            <b-form-invalid-feedback :state="validate('supervisorAddressCommunity')">
              This field is required.
            </b-form-invalid-feedback>
          </b-form-group>

          <b-form-group
            id="fieldset-supervisor-email"
            label="Personal Email"
            label-for="input-supervisor-email"
          >
            <b-form-input
              id="input-supervisor-email"
              v-model="servicePins.supervisorEmail"
              placeholder="Supervisor email address"
              :state="validate('supervisorEmail')"
            />
            <b-form-invalid-feedback :state="validate('supervisorEmail')">
              Enter a valid email address. This field is required.
            </b-form-invalid-feedback>
          </b-form-group>

        </b-form-group>
      </b-card>
      <RegMenu :updater="this.updater" />
    </b-form><!-- end registration form -->
  </b-container>
</template>

<script>

import pageheader from '../common/PageHeader'
import {validateEmail, validatePostcode} from "../../services/validation.services";
import RegProgress from '../common/RegProgress'
import RegMenu from '../common/RegMenu'
import { updateServicePins } from "../../services/api.services";

export default {
  name: "registration-step-service-pins",
  components: {
    pageheader,
    RegProgress,
    RegMenu
  },
  methods: {
    updater: updateServicePins
  },
  computed: {
    servicePins: {
      get () {
        // set the registration navigation
        const selectedAward = this.$store.getters.getRegistration.awardSelection
        this.$store.dispatch('setStatus', {
          current: 'reg-step-service-pins',
          previous: selectedAward.options.type ? 'reg-step-award-options' : 'reg-step-award-selection',
          next: 'reg-step-ceremony'
        })
        return this.$store.getters.getRegistration.servicePins;
      },
      set (value) {
        this.$store.dispatch("setServicePins", value )
      }
    },
    validate(){
      return (field) => {
        const fields = {
          retirementDate: ()=>{
            return !!this.retirement.retirementDate
          },
          supervisorAddressPrefix: ()=>{
            return true
          },
          supervisorAddressStreetAddress: ()=>{
            return !!this.servicePins.supervisorAddressStreetAddress
          },
          supervisorAddressPostalCode: ()=>{
            return validatePostcode(this.servicePins.supervisorAddressPostalCode)
          },
          supervisorAddressCommunity: ()=>{
            return !!this.servicePins.supervisorAddressCommunity
          },
          supervisorEmail: ()=>{
            return validateEmail(this.servicePins.supervisorEmail)
          }
        }
        if (fields[field] === 'undefined') return false;
        return !!fields[field]();
      }
    },
    validation() {
      return this.$store.getters.getValidation.retirement
    }
  }
};
</script>
