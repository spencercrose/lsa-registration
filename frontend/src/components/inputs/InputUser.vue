<template>
  <div>
      <b-form>
        <b-card bg-variant="light" class="mb-3">
          <b-form-group
            id="input-group-user-register-role"
            :label="this.$props.init ? 'Edit User Data' : 'Register User'"
            label-for="input-user-register-role"
            label-size="lg"
            label-class="font-weight-bold pt-0"
          >
            <b-form-select
              id="input-user-register-role"
              v-model="user.role"
              :options="options"
              :state="!!user.role"
            >
            </b-form-select>
            <b-form-invalid-feedback :state="!!user.role">
              This field is required.
            </b-form-invalid-feedback>
            <b-form-valid-feedback :state="!!user.role">
              Completed correctly.
            </b-form-valid-feedback>
          </b-form-group>

          <b-form-group
            id="fieldset-user-register-guid"
            label="GUID"
            label-for="input-user-register-guid"
          >
            <b-form-input
              :disabled="init"
              id="input-user-register-guid"
              v-model="user.guid"
              placeholder="Enter user's government GUID"
              :state="!!user.guid"
            >
            </b-form-input>
            <b-form-invalid-feedback v-if="!init" :state="!!user.guid">
              This field is required.
            </b-form-invalid-feedback>
            <b-form-valid-feedback v-if="!init" :state="!!user.guid">
              Completed correctly.
            </b-form-valid-feedback>
          </b-form-group>

          <b-form-group
            id="fieldset-user-register-username"
            label="IDIR username"
            label-for="input-user-register-username"
          >
            <b-form-input
              id="input-user-register-username"
              v-model="user.username"
              placeholder="Enter user's IDIR username"
              :state="!!user.username"
            >
            </b-form-input>
            <b-form-invalid-feedback :state="!!user.username">
              This field is required.
            </b-form-invalid-feedback>
            <b-form-valid-feedback :state="!!user.username">
              Completed correctly.
            </b-form-valid-feedback>
          </b-form-group>

          <b-form-group
            id="fieldset-user-register-firstname"
            label="First Name"
            label-for="input-user-register-firstname"
          >
            <b-form-input
              id="input-user-register-firstname"
              v-model="user.firstname"
              placeholder="Enter user's given name"
            >
            </b-form-input>
          </b-form-group>

          <b-form-group
            id="fieldset-user-register-lastname"
            label="Last Name"
            label-for="input-user-register-lastname"
          >
            <b-form-input
              id="input-user-register-lastname"
              v-model="user.lastname"
              placeholder="Enter user's last name"
            />
          </b-form-group>

          <b-form-group
            id="input-group-user-register-email"
            label="Email"
            label-for="input-user-register-email"
          >
            <b-form-input
              type="email"
              id="input-user-register-email"
              v-model="user.email"
              placeholder="Enter user's email"
            >
            </b-form-input>

            <b-form-invalid-feedback :state="!user.email || isEmail">
              Enter a valid email
            </b-form-invalid-feedback>

          </b-form-group>

          <b-form-group
            id="input-group-user-register-submit"
            label-for="input-user-register-submit"
          >
            <b-button
              v-if="this.$props.init"
              @click="update"
              :disabled="!validation"
              class="m-2"
              type="button"
              variant="info">Update</b-button>
            <b-button
              v-else
              @click="register"
              :disabled="!validation"
              class="m-2"
              type="button"
              variant="info">Register</b-button>
            <b-button
              class="m-2"
              type="button"
              @click="reroute('/admin/user/list')"
            >Return to Manage Users</b-button>
          </b-form-group>

        </b-card>
      </b-form>

    <b-navbar fixed="bottom" align="right">
      <b-alert
        v-if="message.text"
        show="5"
        fade
        dismissible
        :variant="message.type"
        @dismissed="message={text:'', type:''}"
      >
        {{message.text}}
      </b-alert>
    </b-navbar>

  </div>
</template>

<script>

import {validateEmail} from '@/services/validation.services'
import formServices from '@/services/settings.services'
import api from '@/services/api.services';

const initUserData = {
  role: '',
  guid: '',
  username: '',
  firstname: '',
  lastname: '',
  email: '',
}

export default {
  name: "user-input",
  props: {
    init: Boolean
  },
  data () {
    return {
      user: initUserData,
      error: false,
      message: '',
      options: formServices.get('roles')
    }
  },
  computed: {
    isEmail () {
      return validateEmail(this.user.email)
    },
    validation () {
      return !!this.user.role && !!this.user.guid && !!this.user.username
    }
  },
  methods: {
    async reroute(uri) {
      await this.$router.push(uri)
    },
    async register () {
      try {
        await this.$store.dispatch("setMessage", {
          text: 'Registering user...',
          type: 'info',
          spinner: true
        })
        // handle data submission
        const submitResponse = await api.post(`users/register`, this.user)

        console.log(submitResponse)

        await this.$store.dispatch("setMessage", {
          text: 'Successfully registered user!',
          type: 'success'
        })

      } catch (err) {
        console.error(err);
        await this.$store.dispatch('handleError',
          {text: 'User could not be registered.', type: 'danger'}
        )
      }
    },
    async update () {
      try {
        await this.$store.dispatch("setMessage", {
          text: 'Updating user data...',
          type: 'info',
          spinner: true
        })
        // handle data submission
        const submitResponse = await api.post(`users/update/${this.user.guid}`, this.user)

        console.log(submitResponse)

        await this.$store.dispatch("setMessage", {
          text: 'Successfully updated user data!',
          type: 'success'
        })

      } catch (err) {
        console.error(err);
        await this.$store.dispatch('handleError',
          {text: 'User data could not be updated.', type: 'danger'}
        )
      }
    }
  },
  async beforeCreate() {
    if (this.$route.params.guid) {
      await api.get(`users/view/${this.$route.params.guid}`)
        .then(response => {
          const {data = []} = response || {}
          this.user = data
        })
        .catch(err => {
          console.error(err)
          this.$store.dispatch('handleError',
            {text: 'User data failed to load.', type: 'danger'}
          )
        })
    }
  }
};
</script>

