<template>
  <div>
      <RedirectButton
        label="Return to My Registrations"
        :show="this.$store.getters.isError"
        uri="/list"
      />
      <b-card v-if="!this.$store.getters.isError && registration._id">
        <b-container class="p-3">
          <b-row>
            <b-col align="right">
              <EditMenu
                :disabled="registration.submitted"
                :id="registration._id"
                :category="registration.category"
                :show="['edit', 'delete']"
              />
            </b-col>
          </b-row>
          <b-row class="mb-4">
            <b-col>
              <h3 class="text-center">
                Registration Details
                <b-badge :variant="registration.submitted ? 'success' : 'warning'">
                  {{ registration.submitted ? 'Submitted' : 'Draft' }}
                </b-badge>
              </h3>
            </b-col>
          </b-row>
          <b-row class="mb-4">
            <b-col cols="3">
              <h5>Year</h5>
            </b-col>
            <b-col>
              <p>{{ registration.year }}</p>
            </b-col>
          </b-row>
          <b-row class="mb-4">
            <b-col cols="3">
              <h5>Category</h5>
            </b-col>
            <b-col>
              <p>{{ lookup('categories', registration.category) }}</p>
            </b-col>
          </b-row>
          <b-row class="mb-4">
            <b-col cols="3">
              <h5>ID</h5>
            </b-col>
            <b-col>
              {{registration._id}}
            </b-col>
          </b-row>
          <b-row class="mb-4">
            <b-col cols="3">
              <h5>GUID</h5>
            </b-col>
            <b-col>
              <p>{{ registration.guid }}</p>
            </b-col>
          </b-row>
          <b-row class="mb-4">
            <b-col cols="3">
              <h5>Submitted</h5>
            </b-col>
            <b-col>
              <p><b>{{ registration.submitted ? 'Yes' : 'No' }}</b></p>
            </b-col>
          </b-row>
          <b-row class="mb-4">
            <b-col cols="3">
              <h5>Organization</h5>
            </b-col>
            <b-col>
              {{lookup('organizations', registration.organization)}}
            </b-col>
          </b-row>
          <b-row  v-if="!!registration.title" class="mb-4">
            <b-col cols="3">
              <h5>Title</h5>
            </b-col>
            <b-col>{{registration.title}}</b-col>
          </b-row>
          <b-row class="mb-4">
            <b-col cols="3">
              <h5>Acknowledgment</h5>
            </b-col>
            <b-col>
              <p>{{ registration.acknowledgment.toUpperCase() }}</p>
            </b-col>
          </b-row>
          <b-row>
            <b-col cols="3"><h5>Nominees</h5></b-col>
            <b-col>
              <b-table
                stacked
                :items="registration.nominees"
                :fields="['type', 'firstname', 'lastname', 'organization']"
                striped
                responsive="sm"
                primary-key="id"
              >
                <template #cell(type)="nominee">
                  {{ lookup('nomineeTypes', nominee.item.type) }}
                </template>

                <template #cell(organization)="nominee">
                  {{ lookup('organizations', nominee.item.organization) }}
                </template>
              </b-table>
            </b-col>
          </b-row>
          <b-row>
            <b-col cols="3"><h5>Nominators</h5></b-col>
            <b-col>
              <b-table
                stacked
                :items="registration.nominators"
                :fields="['firstname', 'lastname', 'title', 'email']"
                primary-key="id"
              ></b-table>
            </b-col>
          </b-row>
          <b-row>
            <b-col cols="3"><h5>Contacts</h5></b-col>
            <b-col>
              <h5>Primary</h5>
              <b-table
                stacked
                :items="[registration.contacts.primary]"
                :fields="['firstname', 'lastname', 'title', 'email', 'phone']"
                primary-key="id"
              ></b-table>
              <h5>Video</h5>
              <b-table
                stacked
                :items="[registration.contacts.video]"
                :fields="['firstname', 'lastname', 'title', 'email']"
                striped
                responsive="sm"
                primary-key="id"
              >
                <template #cell(locations)="registration">
                  <b-table
                    stacked
                    :items="registration.locations"
                    :fields="['address', 'city']"
                    primary-key="id"
                  ></b-table>
                </template>
              </b-table>

            </b-col>
          </b-row>
          <b-row>
            <b-col><h5>Evaluation</h5></b-col>
          </b-row>
          <b-row>
            <b-col>
              <b-table
                stacked
                :items="[registration.evaluation]"
                primary-key="id"
              >
                <template #cell(type)="nominee">
                  {{ lookup('nomineeTypes', nominee.item.type) }}
                </template>
              </b-table>
            </b-col>
          </b-row>
          <b-row>
            <b-col><h5>Attachments</h5></b-col>
          </b-row>
          <b-row
            v-for="(attachment, index) in attachments"
            v-bind:key="index"
            align-h="between"
            class="m-2"
          >
            <b-col cols="2">
              <b>File {{index + 1}}</b>
                <b-button
                  block
                  size="sm"
                  class="mr-2"
                  variant="outline-primary"
                  @click="downloadAttachment(attachment)"
                >
                  Download
                </b-button>
            </b-col>
            <b-col>
              <b-table
                size="sm"
                responsive="sm"
                stacked
                :items="[{label: attachment.label, description: attachment.description}]"
                :fields="[
                  {key: 'label', label: 'Label'},
                  {key: 'description', label: 'Description'}
                  ]"
              />
                <b-table
                  size="sm"
                  stacked
                  :items="[attachment.file]"
                  :fields="[
                  {key: 'originalname', label: 'Filename'},
                  {key: 'mimetype', label: 'Format'},
                  {key: 'size', label: 'Filesize'},
                  {key: 'download', label:''}
                  ]"
                  responsive="sm"
                  primary-key="id"
                >
                  <template #cell(mimetype)="row">
                    {{lookup('mimeTypes', row.item.mimetype)}} document
                  </template>
                  <template #cell(size)="row">
                    {{Math.floor(row.item.size / 1000)}} kB
                  </template>
                </b-table>
            </b-col>
          </b-row>
        </b-container>
      </b-card>

  </div>
</template>

<script>

import formServices from '@/services/settings.services'
import EditMenu from '@/components/common/EditMenu'
import RedirectButton from '@/components/common/RedirectButton'
import app from '@/services/api.services'
import { saveAs } from 'file-saver';

export default {
  name: 'registration-view',
  components: {
    EditMenu, RedirectButton
  },
  computed: {
    registration () {
      return this.$store.getters.getRegistration
    },
    attachments () {
      return this.$store.getters.getAttachments
    }
  },
  methods: {
    lookup(key, value) {
      return formServices.lookup(key, value)
    },
    downloadAttachment (attachment) {
      const {_id = '', file = null} = attachment || {};
      const {originalname = ''} = file || {};
      this.message = {
        text: 'Downloading file...',
        type: 'info'
      }
      return app.get(
        `attachments/download/${_id}/`,
        {responseType: 'blob'}
      )
        .then(res => {
          saveAs(res.data, originalname);
          this.message = {
            text: 'File downloaded successfully!',
            type: 'success'
          }
        }).catch(err => {
          console.error(err)
          this.message = {
            text: 'Download failed.',
            type: 'danger'
          }
          return []
        })
    }
  },
  async beforeCreate() {
    this.$store.dispatch('loadRegistration', this.$route.params.id)
      .catch(err => {
        console.error(err)
        this.$store.dispatch('handleError',
          {text: 'Registration failed to load.', type: 'danger'}
        )
      })
  }
}
</script>
