<template>
  <div class="mb-3">
    <b-card bg-variant="light" class="mb-3">
      <b-form-group
        label="Recipient Profile"
        label-size="lg"
        label-class="font-weight-bold"
        class="mb-4 pb-4 pt-4"
      >
        <b-form-group
          id="fieldset-profile-fullname"
          label="First Name"
          :label-for="`input-profile-fullname`"
        >
          <b-form-input
            id="input-profile-fullname"
            v-model="profile.fullname"
            placeholder="Enter the recipient's full name"
            :state="!!profile.fullname"
            :disabled="submitted"
          />
          <b-form-invalid-feedback :state="!!profile.fullname">
            This field is required.
          </b-form-invalid-feedback>
          <b-form-valid-feedback :state="!!profile.fullname">
            Completed correctly.
          </b-form-valid-feedback>
        </b-form-group>

        <b-form-group
          id="fieldset-profile-employee-number"
          label="Last Name"
          label-for="input-profile-employee-number"
        >
          <b-form-input
            id="input-profile-employee-number"
            v-model="profile.employeeNumber"
            placeholder="Enter the recipient's employee number"
            :state="!!profile.employeeNumber"
            :disabled="submitted"
          />
          <b-form-invalid-feedback :state="!!profile.employeeNumber">
            This field is required.
          </b-form-invalid-feedback>
          <b-form-valid-feedback :state="!!profile.employeeNumber">
            Completed correctly.
          </b-form-valid-feedback>
        </b-form-group>

        <b-form-group
          id="`fieldset-profile-organization`"
          label="Organization"
          label-for="input-profile-organization"
        >
          <b-form-select
            :id="`input-profile-organization`"
            v-model="profile.organization"
            :options="options.organization"
            placeholder="Select the recipient's organization"
            :state="!!profile.organization"
            :disabled="submitted"
          >
          </b-form-select>
          <b-form-invalid-feedback :state="!!profile.organization">
            This field is required.
          </b-form-invalid-feedback>
          <b-form-valid-feedback :state="!!profile.organization">
            Completed correctly.
          </b-form-valid-feedback>
        </b-form-group>
      </b-form-group>
    </b-card>
  </div>
</template>

<script>

import formServices from '../../services/settings.services'

export default {
  name: "recipient-profile-input",
  data() {
    return {
      options: {
        organization: formServices.get('organizations')
      }
    }
  },
  computed: {
    profile: {
      get () {
        return this.$store.getters.getRegistration.profile;
      },
      set (value) {
        this.$store.dispatch("setRegistration", { profile: value })
      }
    },
    validation() {
      return this.$store.getters.getValidation.profile
    },
    submitted() {
      return this.$store.getters.getNomination.submitted
    }
  }
};
</script>
