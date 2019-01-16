<template>
  <div class="loader">
    <span></span>
    <span></span>
    <span></span>
  </div>
</template>

<script>
export default {
  name: 'Loader'
}
</script>

<style scoped lang="scss">
  .loader {
    padding: 0;
    margin: 0 auto;
    position: relative;
    top: 50vh;
    transform: translateY(-50%);
    width: 100%;
    height: 10px;
    text-align: center;
    span {
      width: 10px;
      height: 10px;
      display: inline-block;
      border-radius: 50%;
      animation: animate 2s linear infinite;
      opacity: 0;

      &:nth-child(1) {
        animation-delay: 0.6s;
        background: #00c2ff;
      }

      &:nth-child(2) {
        animation-delay: 0.3s;
        background: #ffe837;
      }

      &:nth-child(3) {
        animation-delay: 0s;
        background: #ff1b78;
      }
    }
  }

  @keyframes animate {
    0% {
      transform: translateX(-100px);
      opacity: 0;
    }

    10% {
      transform: translateX(-100px);
      opacity: 0;
    }

    25% {
      transform: translateX(0px);
      opacity: 1;
    }

    50% {
      transform: translateX(0px);
      opacity: 1;
    }

    75% {
      transform: translateX(0px);
      opacity: 1;
    }

    90% {
      transform: translateX(100px);
      opacity: 0;
    }

    100% {
      transform: translateX(100px);
      opacity: 0;
    }
  }
</style>
