<template>
    <b-navbar type="light" variant="light" toggleable="md">
        <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
        <b-collapse is-nav id="nav-collapse">
            <b-navbar-brand :to="{name: 'queuetube' }">Queuetube</b-navbar-brand>
        </b-collapse>
    </b-navbar>
</template>

<script>

    export default {
        name: 'Navbar',
    }
</script>

<style scoped>

</style>
