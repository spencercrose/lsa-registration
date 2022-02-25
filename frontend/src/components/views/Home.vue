<template>
  <div>
    <b-jumbotron header='Welcome' lead="Long Service Awards Registration" />
    <b-container>
      <div>
      <b-card-group deck>
        <b-card title="Celebrating Your Service">
          <b-card-text>
            <p>The Long Service Awards celebrate the dedication and commitment of employees with 25, 30, 35, 40, 45 and 50 year careers in the BC Public Service.</p>
            <p>Long Service Award ceremonies are prestigious and memorable events held at Government House in Victoria, the official residence of B.C.’s Lieutenant Governor and the ceremonial home for all British Columbians.</p>
          </b-card-text>
            <template #footer>
            <b-button
                block
                variant="info"
                @click="reroute(`/recipients/start`)"
              >
                Register for Your Long Service Award
              </b-button>
            </template>
          </b-card>
      </b-card-group>
    </div>
    </b-container>
  </div>
</template>

<script>

export default {
  name: 'Home',
  computed : {
    isLoggedIn () {
      return this.$store.getters.isAuthenticated
    },
    user () {
      return this.$store.getters.getUser
    },
    settings () {
      return this.$store.getters.getSettings
    }
  },
  methods: {
    async reroute(uri) {
      await this.$router.push(uri)
    }
  }
}
</script>
