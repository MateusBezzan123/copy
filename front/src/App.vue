<template>
  <div id="app">
    <file-uploader @data-loaded="handleDataLoaded"></file-uploader>
    <mrr-chart v-if="mrrData" :chart-data="mrrData"></mrr-chart>
    <churn-rate-chart v-if="churnData" :chart-data="churnData"></churn-rate-chart>
  </div>
</template>

<script>
import FileUploader from './components/FileUploader.vue';
import ChurnRateChart from './components/ChurnRateChart.vue';

export default {
  components: {
    FileUploader,

    ChurnRateChart
  },
  data() {
    return {
      mrrData: null,
      churnData: null
    };
  },
  methods: {
    handleDataLoaded(data) {
      // Aqui você processaria os dados e atualizaria os gráficos
      // Exemplo: 
      this.mrrData = this.prepareChartData(data.mrr);
      this.churnData = this.prepareChartData(data.churnRate);
    },
    prepareChartData(rawData) {
      // Transforme os dados brutos no formato necessário para o Chart.js
      return {
        labels: rawData.map(item => item.month),
        datasets: [{
          label: 'MRR',
          data: rawData.map(item => item.value),
          // Outras opções de estilização do gráfico
        }]
      };
    }
  }
};
</script>
