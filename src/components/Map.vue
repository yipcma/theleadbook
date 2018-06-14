<template>
<mgl-map
    :accessToken="accessToken"
    :mapStyle.sync="mapStyle"
/>
</template>

<script>
import { MglMap } from 'vue-mapbox'

export default {
  components: {
    MglMap
  },
  data () {
    return {
      accessToken: 'pk.eyJ1IjoiYW5kcmV3eWlwIiwiYSI6ImNqaWVvN3dscDBscWoza2xodzVzejdxczkifQ.w3IphSevZgEIA_KJrH7PCg',
      mapStyle: 'mapbox://styles/mapbox/streets-v9'
    }
  }
}
</script>
