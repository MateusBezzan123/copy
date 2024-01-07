<template>
  <div>
    <canvas ref="canvas"></canvas>
  </div>
</template>

<script>
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

export default {
  props: ['chartData'],
  mounted() {
    new Chart(this.$refs.canvas.getContext('2d'), {
      type: 'line',
      data: this.chartData
    });
  }
};
</script>
