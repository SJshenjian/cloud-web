<!-- LineChart.vue -->
<template>
  <div class="chart-container">
    <div ref="chart" class="chart"></div>
  </div>
</template>

<script>
import * as echarts from 'echarts';

export default {
  name: 'LineChart',
  props: {
    chartData: {
      type: Array,
      required: true,
      default: () => []
    }
  },
  mounted() {
    this.initializeChart();
    window.addEventListener('resize', this.handleResize);
  },
  beforeDestroy() {
    this.cleanupChart();
    window.removeEventListener('resize', this.handleResize);
  },
  data() {
    return {
      chart: null,
      resizeTimeout: null,
      hiddenSeries: new Set() // 跟踪隐藏的系列
    };
  },
  computed: {
    isDataValid() {
      return (
          Array.isArray(this.chartData) &&
          this.chartData.length > 0 &&
          this.chartData[0].history &&
          Array.isArray(this.chartData[0].history) &&
          this.chartData[0].history.length > 0
      );
    }
  },
  methods: {
    initializeChart() {
      if (!this.isDataValid || !this.$refs.chart) return;

      if (!this.chart) {
        this.chart = echarts.init(this.$refs.chart);
        // 监听图例选择变化
        this.chart.on('legendselectchanged', (params) => {
          const name = params.name;
          if (params.selected[name]) {
            this.hiddenSeries.delete(name);
          } else {
            this.hiddenSeries.add(name);
          }
          this.updateChart();
        });
      }
      this.updateChart();
    },
    updateChart() {
      debugger
      if (!this.chart || !this.isDataValid) return;

      const dates = this.chartData[0].history.map(item => item.date || '');
      const series = this.chartData.map((item, index) => {
        const name = item.wallet ? `${item.wallet} (${item.address.slice(0, 6)}...)` : (item.address ? item.address.slice(0, 6) + '...' : `未知地址${index}`);
        return {
          name,
          type: 'line',
          smooth: true,
          data: item.history.map(h => h.balance || 0),
          itemStyle: {
            color: this.getColor(index)
          }
        };
      });

      const option = {
        title: {
          text: '地址余额趋势图',
          left: 'center',
          top: 10
        },
        tooltip: {
          trigger: 'item',
          formatter: (params) => {
            const date = params.dataIndex !== undefined ? dates[params.dataIndex] : '';
            const addressData = this.chartData[params.seriesIndex];
            const historyItem = addressData?.history?.find(h => h.date === date);

            if (!historyItem) return '';

            return `
              <div style="padding:10px">
                <div><strong>${date}</strong></div>
                <div style="margin: 5px 0;">
                  <span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:${params.color};margin-right:5px;"></span>
                  <strong>${params.seriesName}</strong><br/>
                  余额: ${historyItem.balance.toLocaleString()}<br/>
                  排名: ${historyItem.rank}<br/>
                  占比: ${historyItem.percent}%
                </div>
              </div>
            `;
          },
          backgroundColor: 'rgba(50,50,50,0.9)',
          textStyle: {
            color: '#fff'
          },
          borderColor: '#333',
          borderWidth: 1
        },
        grid: {
          left: '3%',
          right: '3%',
          top: 80,
          bottom: 40,
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: dates,
          axisTick: {
            alignWithLabel: true
          }
        },
        yAxis: {
          type: 'value',
          name: '余额',
          axisLabel: {
            formatter: function(value) {
              if (value >= 1000000000) return (value / 1000000000) + 'B';
              if (value >= 1000000) return (value / 1000000) + 'M';
              return value;
            }
          }
        },
        series: series
      };

      this.chart.setOption(option, true);
    },
    handleResize() {
      if (this.resizeTimeout) {
        clearTimeout(this.resizeTimeout);
      }
      this.resizeTimeout = setTimeout(() => {
        if (this.chart && this.isDataValid) {
          this.chart.resize();
        }
      }, 200);
    },
    cleanupChart() {
      if (this.chart) {
        this.chart.dispose();
        this.chart = null;
      }
    },
    getColor(index) {
      const colors = [
        '#409EFF', '#67C23A', '#E6A23C', '#F56C6C',
        '#909399', '#00CED1', '#FF69B4', '#4682B4'
      ];
      return colors[index % colors.length];
    }
  },
  watch: {
    chartData: {
      deep: true,
      handler() {
        this.hiddenSeries.clear(); // 数据变化时重置隐藏状态
        this.initializeChart();
      }
    }
  }
};
</script>

<style scoped>
.chart-container {
  width: 100vw;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  background: #fff;
}

.chart {
  width: 100%;
  height: 100%;
}

.error-message {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #666;
  font-size: 16px;
}
</style>
