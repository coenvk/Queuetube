<template>
    <div class="switch">
        <input id="switchOption" name="switchOption" type="checkbox" @click="toggleNightMode"/>
        <label for="switchOption" class="label-primary"></label>
    </div>
</template>

<script>
    const ThemeHelper = function () {

        const preloadTheme = (href) => {
            let link = document.createElement('link');
            link.rel = "stylesheet";
            link.href = href;
            document.head.appendChild(link);

            return new Promise((resolve, reject) => {
                link.onload = e => {
                    const sheet = e.target.sheet;
                    sheet.disabled = true;
                    resolve(sheet);
                };
                link.onerror = reject;
            });
        };

        const selectTheme = (themes, name) => {
            if (name && !themes[name]) {
                throw new Error(`"${name}" has not been defined as a theme.`);
            }
            Object.keys(themes).forEach(n => themes[n].disabled = (n !== name));
        }

        let themes = {};

        return {
            add(name, href) {
                return preloadTheme(href).then(s => themes[name] = s)
            },
            set theme(name) {
                selectTheme(themes, name)
            },
            get theme() {
                return Object.keys(themes).find(n => !themes[n].disabled)
            }
        };
    };

    const themes = {
        flatly: "https://bootswatch.com/4/flatly/bootstrap.min.css",
        darkly: "https://bootswatch.com/4/darkly/bootstrap.min.css",
    };

    const themeHelper = new ThemeHelper();

    let added = Object.keys(themes).map(n => themeHelper.add(n, themes[n]));

    Promise.all(added).then(sheets => {
        themeHelper.theme = "flatly";
    });

    export default {
        name: "NightSwitch",
        data() {
            return {
                nightModeOn: false
            }
        },
        methods: {
            toggleNightMode() {
                this.nightModeOn = !this.nightModeOn;
                if (this.nightModeOn) {
                    themeHelper.theme = 'darkly'
                } else {
                    themeHelper.theme = 'flatly'
                }
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
