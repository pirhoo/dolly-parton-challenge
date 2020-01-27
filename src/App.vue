<template>
  <div id="app" class="app d-flex flex-column">
    <app-header class="app__container" />
    <div class="app__container">
      <div class="row no-gutters app__grid px-3 pt-3">
        <label class="col-6 app__grid__placeholder" v-for="{ name, image, labelDataUrl } in networks" :key="name" :class="{ [`app__grid__placeholder--${name}`]: true, 'app__grid__placeholder--valid': !!image }">
          <span class="sr-only">{{ name }}</span>
          <input type="file" :name="name" class="app__grid__placeholder__input" @change="loadImage" />
          <img :src="image.src" class="app__grid__placeholder__image" v-if="image" />
          <img :src="labelDataUrl"  class="app__grid__placeholder__label" />
        </label>
      </div>
    </div>
    <div class="app__actions">
      <div class="p-3 d-flex justify-content-between app__container align-items-center">
        <button class="btn btn-danger rounded-pill" @click="resetImages" v-if="hasImages">
          Clear all
        </button>
        <span v-else class="text-muted">
          Click on the grid to add your picture.
        </span>
        <span class="flex-grow-1"></span>
        <span v-if="!isReady" class="px-2 text-nowrap">
          {{ validNetworks.length }} / 4
        </span>
        <button class="btn btn-primary rounded-pill" @click="downloadCanvas">
          Download
        </button>
      </div>
    </div>
    <canvas class="app__canvas" ref="canvas" height="800" width="800" />
    <app-footer class="flex-grow-1" />
  </div>
</template>

<script>
  import { find, filter } from 'lodash'
  import { drawImageCover, downloadCanvas } from './canvas'
  import AppFooter from './AppFooter'
  import AppHeader from './AppHeader'

  export default {
    name: 'App',
    components: {
      AppFooter,
      AppHeader,
    },
    data () {
      return {
        networks: [
          { name: 'linkedin', image: null, labelDataUrl: require('./assets/networks/linkedin.png') },
          { name: 'facebook', image: null, labelDataUrl: require('./assets/networks/facebook.png') },
          { name: 'instagram', image: null, labelDataUrl: require('./assets/networks/instagram.png') },
          { name: 'tinder', image: null, labelDataUrl: require('./assets/networks/tinder.png') }
        ],
        canvas: {
          // This is the CanvasRenderingContext that children will draw to.
          context: null
        }
      }
    },
    provide () {
      return {
        canvas: this.canvas
      }
    },
    mounted () {
      this.canvas.context = this.$refs['canvas'].getContext('2d')
    },
    computed: {
      validNetworks () {
        return filter(this.networks, network => !!network.image)
      },
      isReady () {
        return this.validNetworks.length === 4
      },
      hasImages () {
        return this.validNetworks.length > 0
      }
    },
    methods: {
      loadImage ({ target }) {
        const reader = new FileReader()
        reader.onload = event => {
            const image = new Image()
            image.onload = () => {
                this.setNetworkImage(target.name, image)
                this.$nextTick()
            }
            image.src = event.target.result
        }
        reader.readAsDataURL(target.files[0])
      },
      setNetworkImage (name, image) {
        const network = find(this.networks, { name })
        network.image = image
        // Re-render the canvas
        this.renderNetworkCanvas()
      },
      resetImages () {
        for (const network of this.networks) {
          network.image = null
        }
        // Re-render the canvas
        this.resetCanvas()
      },
      resetCanvas () {
        const { width, height } = this.$refs['canvas']
        this.canvas.context.clearRect(0, 0, width, height);
      },
      renderNetworkCanvas () {
        // Always clear the canvas before drawing
        this.resetCanvas()
        this.renderNetworkImages()
        this.renderNetworkLabels()
      },
      renderNetworkImages () {
        this.networks.forEach(({ image }, index) => {
          if (image) {
            const imageWith = this.$refs['canvas'].width / 2
            const imageHeight = this.$refs['canvas'].height / 2
            const dx = (index % 2) * imageWith
            const dy = (index > 1) * imageHeight
            drawImageCover(this.canvas.context, image, dx, dy, imageWith, imageHeight)
          }
        })
      },
      renderNetworkLabels () {
        this.networks.forEach(({ labelDataUrl }, index) => {
          const label = this.dataUrlToImage(labelDataUrl)
          const labelWidth = this.$refs['canvas'].width / 2
          const labelHeight = label.height * (labelWidth / label.width)
          const imageHeight = this.$refs['canvas'].height / 2
          const dx = (index % 2) * labelWidth
          const dy = (index > 1) * imageHeight + (imageHeight - labelHeight)
          drawImageCover(this.canvas.context, label, dx, dy, labelWidth, labelHeight)
        })
      },
      downloadCanvas () {
        downloadCanvas(this.$refs['canvas'])
      },
      dataUrlToImage (dataUrl) {
        const img = new Image()
        img.src = dataUrl
        return img
      }
    }
  }
</script>

<style lang="scss">
  .app {
    min-height: 100vh;

    @media (min-width: 70vh) {
      margin-top: 1rem;
    }

    &__container {
      max-width: 70vh;
      width: 100%;
      margin: auto;
      background: white;
      border-left: 4px solid black;
      border-right: 4px solid black;
    }

    &__canvas {
      display: none;
    }

    &__actions {
      background: black;
    }

    &__grid {
      max-width: 80vh;
      margin: auto;

      &__placeholder {
        position: relative;
        overflow: hidden;
        margin: 0;
        padding-top:50%;
        cursor: pointer;
        background: #efefef;
        filter: grayscale(100%);

        &--linkedin { background: #a7d0d6; }
        &--facebook { background: #a7b8d6; }
        &--instagram { background: #ada7d6; }
        &--tinder { background: #d6a7b8; }
        &--valid { background: white; }

        &:hover, &--valid {
          filter: grayscale(0);
        }


        &__input {
          position: absolute;
          left: -99999px;
          top: -99999px;
          opacity: 0;
          text-indent: -99999px;
        }

        &__image {
          z-index: 100;
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);

          display: block;
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        &__label {
          z-index: 150;
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%
        }
      }
    }
  }
</style>
