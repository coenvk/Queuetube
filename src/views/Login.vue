<template>
  <b-container class="mt-4">
    <b-row>
      <b-col sm="8" offset-sm="2" md="6" offset-md="3" lg="4" offset-lg="4">
        <h1 class="text-xs-center">Sign in</h1>
        <p class="text-xs-center">
          <router-link :to="{ name: 'signup' }">
            Need an account?
          </router-link>
        </p>
        <b-form @submit.prevent="onSubmit">
          <b-form-group>
            <b-input-group>
              <b-input-group-prepend>
                <b-input-group-text>
                  <v-icon name="at"/>
                </b-input-group-text>
              </b-input-group-prepend>
              <b-form-input v-model.trim="email" type="email" placeholder="Email" required></b-form-input>
            </b-input-group>
          </b-form-group>
          <b-form-group>
            <b-input-group>
              <b-input-group-prepend>
                <b-input-group-text>
                  <v-icon name="key"/>
                </b-input-group-text>
              </b-input-group-prepend>
              <b-form-input v-model.trim="password" type="password" placeholder="Password" required></b-form-input>
            </b-input-group>
          </b-form-group>
          <b-form-group v-if="error" class="text-danger">
            <small>{{ error }}</small>
          </b-form-group>
          <b-button type="submit" variant="primary">Submit</b-button>
        </b-form>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
  import {LOGIN} from '@/store/actions.type'
  import {mapState} from 'vuex'

  export default {
    name: 'Login',
    data() {
      return {
        email: null,
        password: null
      }
    },
    methods: {
      onSubmit() {
        this.$store.dispatch(LOGIN, {email: this.email, password: this.password}).then(() => {
          this.$router.push({name: 'dinner'})
        })
      }
    },
    computed: {
      ...mapState({
        error: state => state.error.error
      })
    }
  }
</script>

<style scoped>

</style>
