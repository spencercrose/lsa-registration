<template>
  <b-container fluid>
    <pageheader header="Registration" lead="Your Profile Information" />
    <RegProgress active="identification" />
    <b-alert v-if="Object.keys(identification).length === 0" show variant="secondary">
      Please wait while your registration is loaded...
    </b-alert>
    <b-form v-else>
      <b-card
        header="Profile Details"
        header-tag="header"
        header-class="font-weight-bold"
        bg-variant="light"
        class="mb-3 mt-3"
      >
        <b-form-group>
          <b-form-group
            id="fieldset-identification-fullName"
            label="Full Name"
            label-for="input-identification-fullName"
          >
            <b-form-input
              id="input-identification-fullName"
              v-model="identification.fullName"
              placeholder="Your first and last name"
              :state="validate('fullName')"
            />
            <b-form-invalid-feedback :state="validate('fullName')">
              This field is required.
            </b-form-invalid-feedback>
          </b-form-group>

          <b-form-group
            id="fieldset-identification-employee-number"
            label="Employee Number"
            label-for="input-identification-employee-number"
          >
            <b-form-input
              id="input-identification-employee-number"
              v-model="identification.employeeNumber"
              placeholder="Your employee number"
              :state="validate('employeeNumber')"
            />
            <b-form-invalid-feedback :state="validate('employeeNumber')">
              This field is required.
            </b-form-invalid-feedback>
          </b-form-group>

          <b-form-group
            id="fieldset-identification-email"
            label="Government Email"
            label-for="input-identification-email"
          >
            <b-form-input
              id="input-identification-email"
              v-model="identification.governmentEmail"
              placeholder="Your employee email address"
              :state="validate('email')"
            />
            <b-form-invalid-feedback :state="validate('email')">
              Enter a valid email address.
            </b-form-invalid-feedback>
          </b-form-group>

          <b-form-group
            id="fieldset-identification-government-phone"
            label="Government Phone Number"
            label-for="input-identification-government-phone"
          >
            <b-form-input
              id="input-identification-government-phone"
              v-model="identification.governmentPhoneNumber"
              placeholder="###-###-####"
            >
            </b-form-input>
            <b-form-invalid-feedback :state="validate('phone')">
              Enter a valid phone number.
            </b-form-invalid-feedback>
          </b-form-group>

          <b-form-group
            id="input-group-organization"
            label="Government Ministry"
            label-for="input-organization"
          >
            <b-form-select
              id="input-organization"
              v-model="identification.organizationId"
              :options="organizations"
              :state="validate('organization')"
            >
            </b-form-select>
            <b-form-invalid-feedback :state="validate('organization')">
              This field is required.
            </b-form-invalid-feedback>
          </b-form-group>

          <b-form-group
            id="fieldset-identification-branch"
            label="Ministry Branch"
            label-for="input-identification-branch"
          >
            <b-form-input
              id="input-identification-branch"
              v-model="identification.branchName"
              placeholder="Your ministry branch"
            />
          </b-form-group>

        </b-form-group>
      </b-card>
      <RegMenu :updater="this.updater" />
    </b-form><!-- end registration form -->
  </b-container>
</template>

<script>

import pageheader from '../common/PageHeader'
import {validateEmail, validatePhone} from "../../services/validation.services";
import { updateIdentification } from '../../services/api.services'
import RegProgress from '../common/RegProgress'
import RegMenu from '../common/RegMenu'

export default {
  name: "registration-step-identification",
  components: {
    pageheader,
    RegProgress,
    RegMenu
  },
  methods: {
    updater: updateIdentification
  },
  computed: {
    identification: {
      get () {
        return this.$store.getters.getRegistration.identification;
      },
      set (value) {
        this.$store.dispatch("setIdentification", value)
      }
    },
    organizations() {
      return this.$store.getters.getOrganizations
    },
    validate(){
      return (field) => {
        const fields = {
          fullName: ()=>{
            return !!this.identification.fullName && this.identification.fullName.length > 0
          },
          employeeNumber: ()=>{
            return !!this.identification.employeeNumber && this.identification.employeeNumber.length > 0
          },
          email: ()=>{
            return validateEmail(this.identification.governmentEmail)
          },
          phone: ()=>{
            return !this.identification.governmentPhoneNumber || validatePhone(this.identification.governmentPhoneNumber)
          },
          organization: ()=>{
            return !!this.identification.organizationId
          }
        }
        // set global validation
        // TODO implement section validation

        if (fields[field] === 'undefined') return false;
        return !!fields[field]();
      }
    },
    validation() {
      return this.$store.getters.getValidation.identification
    }
  },
  async beforeCreate() {
    // set workflow status
    await this.$store.dispatch('setStatus', {
      current: 'reg-step-identification',
      previous: null,
      next: 'reg-step-milestone'
    })
      .catch(err => {console.warn(err)})
  }
};
</script>
