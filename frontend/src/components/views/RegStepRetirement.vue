<template>
  <b-container fluid>
    <pageheader header="Registration" lead="Your Retirement Plans" />
    <RegProgress active="retirement" />
    <b-alert
      v-if="Object.keys(retirement).length===0 || Object.keys(contact).length===0"
      show
      variant="secondary"
    >
      Please wait while your registration is loaded...
    </b-alert>
    <b-form v-else>
      <b-card
        header="Retirement Details"
        header-tag="header"
        bg-variant="light"
        class="mb-3"
      >
        <p>Let us know when you plan to retire and your personal contact information, so we have a way of contacting you.</p>
        <b-form-group
          label-cols-lg="3"
          label="Retirement Date"
          label-size="lg"
          label-class="font-weight-bold"
        >
          <b-form-datepicker
            v-model="retirement.retirementDate"
            :min="currentDate"
            :max="maxDate"
            locale="en"
            :state="validate('retirementDate')"
          />
          <b-form-invalid-feedback :state="validate('retirementDate')">
            This field is required.
          </b-form-invalid-feedback>
        </b-form-group>

        <b-form-group
          label-cols-lg="3"
          label="Personal Address"
          label-size="lg"
          label-class="font-weight-bold"
        >
          <b-form-group
            id="fieldset-personal-address-prefix"
            label="Address Prefix"
            label-for="input-personal-address-prefix"
          >
            <b-form-input
              id="input-personal-address-prefix"
              v-model="contact.personalAddressPrefix"
              placeholder="Your address prefix"
            />
          </b-form-group>

          <b-form-group
            id="fieldset-personal-address-street-address"
            label="Street Address"
            label-for="input-personal-address-street-address"
          >
            <b-form-input
              id="input-personal-address-street-address"
              v-model="contact.personalAddressStreetAddress"
              placeholder="Your street address"
              :state="validate('personalAddressStreetAddress')"
            />
            <b-form-invalid-feedback :state="validate('personalAddressStreetAddress')">
              This field is required.
            </b-form-invalid-feedback>
          </b-form-group>

          <b-form-group
            id="fieldset-personal-address-postalcode"
            label="Postal Code"
            label-for="input-personal-address-postalcode"
          >
            <b-form-input
              id="input-personal-address-postalcode"
              v-model="contact.personalAddressPostalCode"
              placeholder="A0A 0A0"
              :state="validate('personalAddressPostalCode')"
            />
            <b-form-invalid-feedback :state="validate('personalAddressPostalCode')">
              Enter a valid Canadian postal code. This field is required.
            </b-form-invalid-feedback>
          </b-form-group>

          <b-form-group
            id="fieldset-personal-address-community"
            label="City or Community"
            label-for="input-personal-address-community"
          >
            <b-form-input
              id="input-personal-address-community"
              v-model="contact.personalAddressCommunity"
              placeholder="Your city or community"
              :state="validate('personalAddressCommunity')"
            />
            <b-form-invalid-feedback :state="validate('personalAddressCommunity')">
              This field is required.
            </b-form-invalid-feedback>
          </b-form-group>

          <b-form-group
            id="fieldset-personal-email"
            label="Personal Email"
            label-for="input-personal-email"
          >
            <b-form-input
              id="input-personal-email"
              v-model="contact.personalEmail"
              placeholder="Your email address"
              :state="validate('personalEmail')"
            />
            <b-form-invalid-feedback :state="validate('personalEmail')">
              Enter a valid email address. This field is required.
            </b-form-invalid-feedback>
          </b-form-group>

          <b-form-group
            id="fieldset-personal-phone"
            label="Phone"
            label-for="input-personal-phone"
          >
            <b-form-input
              id="input-personal-phone"
              v-model="contact.personalPhoneNumber"
              placeholder="###-###-####"
              :state="validate('personalPhoneNumber')"
            >
            </b-form-input>
            <b-form-invalid-feedback :state="validate('personalPhoneNumber')">
              Enter a valid phone number.
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
import {validateEmail, validatePhone, validatePostcode} from "../../services/validation.services";
import RegProgress from '../common/RegProgress'
import RegMenu from '../common/RegMenu'
import {updateRetirement, updatePersonalContact} from "../../services/api.services";

export default {
  name: "registration-step-retirement",
  components: {
    pageheader,
    RegProgress,
    RegMenu
  },
  methods: {
    updater: async (data) => {
      await updateRetirement(data)
      await updatePersonalContact(data)
    }
  },
  computed: {
    retirement: {
      get () {
        return this.$store.getters.getRegistration.retirement;
      },
      set (value) {
        this.$store.dispatch("setRetirement", value )
      }
    },
    contact: {
      get () {
        return this.$store.getters.getRegistration.contact;
      },
      set (value) {
        this.$store.dispatch("setContact", value)
      }
    },
    validate(){
      return (field) => {
        const fields = {
          retirementDate: ()=>{
            return !!this.retirement.retirementDate
          },
          personalAddressPrefix: ()=>{
            return true
          },
          personalAddressStreetAddress: ()=>{
            return !!this.contact.personalAddressStreetAddress
          },
          personalAddressPostalCode: ()=>{
            return validatePostcode(this.contact.personalAddressPostalCode)
          },
          personalAddressCommunity: ()=>{
            return !!this.contact.personalAddressCommunity
          },
          personalEmail: ()=>{
            return validateEmail(this.contact.personalEmail)
          },
          personalPhoneNumber: ()=>{
            return validatePhone(this.contact.personalPhoneNumber)
          }
        }
        if (fields[field] === 'undefined') return false;
        return !!fields[field]();
      }
    },
    validation() {
      return this.$store.getters.getValidation.retirement
    },
    currentDate() {
      return new Date();
    },
    maxDate() {
      const n = 1
      const thisDate = new Date()
      return new Date(thisDate.setFullYear(thisDate.getFullYear() + n))
    }
  },
  async beforeCreate() {
    // set workflow status
    await this.$store.dispatch('setStatus', {
      current: 'reg-step-retirement',
      previous: 'reg-step-milestone',
      next: 'reg-step-award-selection'
    })
      .catch(err => {console.warn(err)})
  }
};
</script>
