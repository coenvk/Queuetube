<template>
  <b-container class="mt-4">
    <b-row>
      <b-col sm="8" offset-sm="2" md="6" offset-md="3" lg="4" offset-lg="4">
        <h1 class="text-xs-center">Sign up</h1>
        <p class="text-xs-center">
          <router-link :to="{ name: 'login' }">
            Have an account?
          </router-link>
        </p>
        <b-form @submit.prevent="onSubmit">
          <b-form-group>
            <b-input-group>
              <b-input-group-prepend>
                <b-input-group-text>
                  <v-icon name="user"/>
                </b-input-group-text>
              </b-input-group-prepend>
              <b-form-input v-model.trim="username" type="text" placeholder="Name" required></b-form-input>
            </b-input-group>
          </b-form-group>
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
          <b-form-group>
            <b-input-group>
              <b-input-group-prepend>
                <b-input-group-text>
                  <v-icon name="calendar-alt"/>
                </b-input-group-text>
              </b-input-group-prepend>
              <b-form-input v-model="birthday" type="date" placeholder="Birthday"></b-form-input>
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
import { mapState } from 'vuex'
import { REGISTER } from '@/store/actions.type'

export default {
  name: 'Signup',
  data () {
    return {
      username: null,
      email: null,
      password: null,
      birthday: null
    }
  },
  methods: {
    onSubmit () {
      this.$store.dispatch(REGISTER, {
        username: this.username,
        email: this.email,
        password: this.password,
        birthday: this.birthday
      }).then(() => {
        this.$router.push({ name: 'login' })
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
