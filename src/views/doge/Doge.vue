<!-- App.vue -->
<template>
  <LineChart v-if="addressData.length > 0" :chart-data="addressData" />
</template>

<script>
import LineChart from '@/components/chart/LineChart.vue'

export default {
  name: 'App',
  components: {
    LineChart
  },
  data() {
    return {
      addressData: []
    }
  },
  created() {
    this.getBalance()
  },
  methods: {
    getBalance() {
      const self = this
      self.$http.post('/doge/getTop100DogeBalanceHistory', {}, 'apiUrl', { body: 'json' })
          .then((res) => {
            if (res) {
              self.addressData = res
            }
          })
    }
  },
}
</script>
