<template>
  <b-button class="to-top-btn" @click="backToTop">
    <v-icon name="angle-up" aria-hidden="true"/>
  </b-button>
</template>

<script>
export default {
  name: 'ScrollToTop',
  props: {
    threshold: {
      type: Number,
      default: 0,
      validator: (value) => {
        return value >= 0
      }
    }
  },
  methods: {
    backToTop: function () {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      })
    },
    showToTopBtn: function () {
      if (document.body.scrollTop > this.threshold || document.documentElement.scrollTop > this.threshold) {
        const button = document.getElementsByClassName('to-top-btn').item(0)
        button.style.display = 'block'
      } else {
        const button = document.getElementsByClassName('to-top-btn').item(0)
        button.style.display = 'none'
      }
    }
  },
  mounted () {
    window.onscroll = () => {
      this.showToTopBtn()
    }
  }
}
</script>

<style scoped lang="scss">
  .to-top-btn {
    border-radius: 5px;
    background-color: rgb(1, 14, 27);
    background-color: rgba(1, 14, 27, .7);
    position: fixed;
    width: 45px;
    height: 45px;
    display: none;
    right: 15px;
    bottom: 15px;
    border: none;
    opacity: 0.8;
    z-index: 99;
    .fa-icon {
      color: white;
      font-size: 22px;
    }
    &:hover {
      opacity: 1;
      background-color: rgb(1, 14, 27);
      background-color: rgba(1, 14, 27, .9);
    }
  }
</style>
