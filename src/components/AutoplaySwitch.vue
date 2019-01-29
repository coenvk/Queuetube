<template>
    <b-row class="mx-1">
        <h5>Autoplay</h5>
        <div class="switch mx-3">
            <input id="autoSwitchOption" name="autoSwitchOption" type="checkbox" @click="toggleAutoplay"/>
            <label for="autoSwitchOption" class="label-primary"></label>
        </div>
    </b-row>
</template>

<script>
    export default {
        name: "AutoplaySwitch",
        methods: {
            toggleAutoplay() {
                this.$emit('toggle');
            }
        }
    }
</script>

<style scoped lang="scss">
    .switch > input[type="checkbox"] {
        display: none;
    }

    .switch > label {
        cursor: pointer;
        height: 0px;
        position: relative;
        width: 40px;
    }

    .switch > label::before {
        background: rgb(0, 0, 0);
        box-shadow: inset 0px 0px 10px rgba(0, 0, 0, 0.5);
        border-radius: 8px;
        content: '';
        height: 16px;
        margin-top: -8px;
        position: absolute;
        opacity: 0.3;
        transition: all 0.4s ease-in-out;
        width: 40px;
    }

    .switch > label::after {
        background: rgb(255, 255, 255);
        border-radius: 16px;
        box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.3);
        content: '';
        height: 24px;
        left: -4px;
        margin-top: -8px;
        position: absolute;
        top: -4px;
        transition: all 0.3s ease-in-out;
        width: 24px;
    }

    .switch > input[type="checkbox"]:checked + label::before {
        background: darken(rgb(0, 0, 0), 20);
        opacity: 0.5;
    }

    .switch > input[type="checkbox"]:checked + label::after {
        background: darken(rgb(255, 255, 255), 20);
        left: 20px;
    }
</style>
