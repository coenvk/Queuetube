<template>
    <b-container class="mt-4 text-center">

        <h4 class="my-4">
            Join a remote room or create your own local playlist
        </h4>

        <b-row v-if="!remotePopup">
            <b-col sm="8" offset-sm="2" md="6" offset-md="3" lg="4" offset-lg="4">
                <b-button :disabled="!serverOnline" variant="primary" class="my-2"
                          @click.prevent="remotePopup = !remotePopup">
                    Remote
                </b-button>
            </b-col>
        </b-row>

        <b-row v-else>
            <b-col sm="8" offset-sm="2" md="6" offset-md="3" lg="4" offset-lg="4">
                <b-form>
                    <b-form-group>
                        <b-input-group>
                            <b-form-input v-model.trim="enteredRoomName" placeholder="Enter Room Name"
                                          required></b-form-input>
                            <b-input-group-append>
                                <b-button variant="primary" @click.prevent="toRemoteJoin">
                                    Join
                                </b-button>
                                <b-button variant="primary" @click.prevent="toRemoteHost">
                                    Host
                                </b-button>
                            </b-input-group-append>
                        </b-input-group>
                    </b-form-group>
                </b-form>
            </b-col>
        </b-row>

        <p v-if="!serverOnline" class="text-danger">
            No server online!
        </p>

        <b-row>
            <b-col sm="8" offset-sm="2" md="6" offset-md="3" lg="4" offset-lg="4">
                <b-button variant="primary" class="my-2" @click.prevent="toLocal">
                    Local
                </b-button>
            </b-col>
        </b-row>

    </b-container>
</template>

<script>
    import {ADD_ROOM_IF_HOSTED} from "@/store/actions.type";
    import {mapState} from 'vuex'

    export default {
        name: "HomePage",
        data() {
            return {
                remotePopup: false,
                serverOnline: false,
                enteredRoomName: null,
            }
        },
        computed: {
            ...mapState({
                error: state => state.error.error
            })
        },
        mounted() {
            this.checkServerOnline();
        },
        methods: {
            checkServerOnline() {
                const http = new XMLHttpRequest();
                http.open('GET', 'http://localhost:3000/queuetube', true)
                http.onreadystatechange = () => {
                    if (http.readyState === 4 && http.status === 200) {
                        this.serverOnline = true;
                    } else {
                        this.serverOnline = false;
                    }
                }
                try {
                    http.send();
                } catch (e) {
                    this.serverOnline = false;
                }
            },
            passRemote() {
                if (this.error === undefined || this.error === null) {
                    this.$router.push({name: 'remote'})
                }
            },
            toLocal() {
                this.$router.push({name: 'local'})
            },
            toRemoteHost() {
                return this.$store.dispatch(ADD_ROOM_IF_HOSTED, {
                    roomName: this.enteredRoomName,
                    hosting: true
                }).then(() => {
                    setTimeout(this.passRemote, 300);
                })
            },
            toRemoteJoin() {
                return this.$store.dispatch(ADD_ROOM_IF_HOSTED, {
                    roomName: this.enteredRoomName,
                    hosting: false
                }).then(() => {
                    setTimeout(this.passRemote, 300);
                })
            }
        }
    }
</script>

<style scoped>

</style>
