<template>
    <b-navbar sticky type="light" variant="light" toggleable="md">
        <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
        <b-navbar-brand :to="{name: 'home' }">Queuetube</b-navbar-brand>
        <b-collapse is-nav id="nav-collapse">
            <b-navbar-nav class="ml-auto">
                <b-nav-text right>
                    <night-switch/>
                </b-nav-text>
            </b-navbar-nav>
        </b-collapse>
    </b-navbar>
</template>

<script>
    import NightSwitch from '@/components/NightSwitch'

    export default {
        name: 'Navbar',
        components: {
            NightSwitch
        }
    }
</script>

<style scoped>

</style>
