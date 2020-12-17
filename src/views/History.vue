<template>
  <div>
    <div class="page-title">
      <h3>{{'HistoryTitle'|localize}}</h3>
    </div>

    <div class="history-chart">
      <canvas ref="canvas"></canvas>
    </div>

    <div class="history-chart">
      <canvas></canvas>
    </div>

    <Loader v-if="loading" />

    <p v-else-if="!records.length" class="center">
      {{'NoRecords'|localize}} <router-link to="/record">{{'Add'|localize}}</router-link>
    </p>

    <section v-else>
      <HistoryTable :records="items" />
      <Paginate 
         v-model="page"
        :page-count="pageCount"
        :click-handler="pageChangeHandler"
        :prev-text="'Prev' | localize"
        :next-text="'Next' | localize"
        :container-class="'pagination'"
        :page-class="'waves-effect'"        
      />
    </section>
  </div>
</template>

<script>
import paginationMixin from '@/mixins/pagination.mixin'
import HistoryTable from '@/components/HistoryTable.vue'
import {Pie} from 'vue-chartjs'
import localizeFilter from '../filters/localize.filter'

export default {
  name: 'history',
  mixins: [paginationMixin],
  extends: Pie,
  metaInfo() {
    return {
      title: this.$title('HistoryTitle')
    }
  },
  data: () => ({
    loading: true, 
    records: [],
  }),
  components: {
    HistoryTable
  },
  async mounted() { 
    this.records = await this.$store.dispatch('fetchRecords')
    await this.setup()    
    this.loading = false
  }, 
  methods: {
    async setup() { 
      const categories = await this.$store.dispatch('fetchCategories')
      this.setupPagination(this.records.map(record => {
        return {
          ...record, 
          categoryName: categories.find(c => c.id === record.categoryId).title,
          typeClass: record.type === 'income' ? 'green' : 'red', 
          typeName: localizeFilter(record.type)
        }
      }))

      this.renderChart({
        labels: categories.map(cat => cat.title),
        datasets: [{
          label: 'Расходы по категориям',
          data: categories.map(cat => { 
            return this.records.reduce((total, r) => { 
              if (r.categoryId === cat.id && r.type === 'outcome') {
                total += +r.amount
              }
              return total
            }, 0)
          }), 
          backgroundColor: [
              'rgba(255, 99, 132, 0.2)',
              'rgba(54, 162, 235, 0.2)',
              'rgba(255, 206, 86, 0.2)',
              'rgba(75, 192, 192, 0.2)',
              'rgba(153, 102, 255, 0.2)',
              'rgba(255, 159, 64, 0.2)'
          ],
          borderColor: [
              'rgba(255, 99, 132, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)',
              'rgba(75, 192, 192, 1)',
              'rgba(153, 102, 255, 1)',
              'rgba(255, 159, 64, 1)'
          ],
          borderWidth: 1
        }]
      })
    }
  }
}
</script>
