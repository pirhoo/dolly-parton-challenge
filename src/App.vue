<template>
  <div id="app" class="app p-3">
    <div class="row no-gutters app__grid">
      <label class="col-6 app__grid__placeholder" v-for="{ name, image, labelDataUrl } in networks" :key="name" :class="`app__grid__placeholder--${name}`">
        <span class="sr-only">{{ name }}</span>
        <input type="file" :name="name" class="app__grid__placeholder__input" @change="loadImage" />
        <img :src="image.src" class="app__grid__placeholder__image" v-if="image" />
        <img :src="labelDataUrl"  class="app__grid__placeholder__label" />
      </label>
    </div>
    <div class="py-3 d-flex justify-content-between">
      <button class="btn btn-outline-danger " @click="resetImages">
        Clear images
      </button>
      <button class="btn btn-outline-primary" v-if="isReady" @click="downloadCanvas">
        Download
      </button>
    </div>
    <canvas class="app__canvas" ref="canvas" height="800" width="800" />
  </div>
</template>

<script>
  import { every, find } from 'lodash'
  import { drawImageCover } from './canvas'

  export default {
    name: 'App',
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
      isReady () {
        return every(this.networks, network => !!network.image)
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
        // Get the result as base64
        const dataUrl = this.$refs['canvas'].toDataURL()
        // Open the content
        window.open(dataUrl, "_blank")
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
    max-width: 80vh;
    margin: auto;

    &__canvas {
      display: none;
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

        &--linkedin  { background: #2867b2; }
        &--facebook  { background: #3b5998; }
        &--instagram { background: #833ab4; }
        &--tinder    { background: #fe3c72; }

        &:after {
          content:"";
          z-index: 200;
          position: absolute;
          border: .5vh dashed rgba(white, 0.7);
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%) scale(2);
          width: 80%;
          padding-top: 80%;
          transition: transform 100ms;
        }

        &:hover:after {
          transform: translate(-50%, -50%) scale(1);
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
