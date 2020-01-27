<template>
  <div class="app__footer">
    <div class="app__footer__container mt-4 d-flex align-items-center">
      <sharing-options class="inline-block" />
      <span>— by <a href="https://pirhoo.com">Pirhoo</a></span>
    </div>
  </div>
</template>

<style lang="scss">
  .app__footer {
    background: black;
    color: white;


    &__container {
      margin: auto;
      max-width: 70vh;

      @media (max-width: 70vh) {
        padding: 0 1rem;
      }

      .sharing-options__link {
        background: white;
        color: black;

        .svg-inline--fa {
          color: inherit;
        }
      }
    }
  }
</style>

<script>
  import {  SharingOptions  } from '@icij/murmur'

  export default {
    components: {
      SharingOptions
    }
  }
</script>
