<template>
  <div class="app__header px-3 pt-3">
    <div class="d-flex">
      <h1 class="app__header__heading p-0 flex-grow-1">
        Dolly Parton Challenge
      </h1>
      <div class="app__header__wtf">
        <a href="https://knowyourmeme.com/memes/dolly-parton-challenge" target="_blank">
          WTF
        </a>
      </div>
    </div>
    <p class="lead">
      Take up the challenge then share your result.
    </p>
  </div>
</template>

<style lang="scss">
  .app__header {
    border-top: 4px solid black;

    &__heading {
      font-size: 1.5rem;
      font-weight: 900;
    }

    &__wtf {

      a {
        text-align: center;
        color: white;
        font-weight: bolder;
        background: black;
        display: block;
        font-size: 0.5rem;
        height: 1.8rem;
        width: 1.8rem;
        line-height: 1.8rem;
        padding: 0;
        border-radius: 50%;
      }
    }
  }
</style>
