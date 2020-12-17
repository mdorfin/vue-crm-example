<template>
  <div>
    <div class="page-title">
      <h3>{{'PlanningTitle' | localize}}</h3>
      <h4>{{ info.bill | currency('RUB') }}</h4>
    </div>

    <Loader v-if="loading" />

    <p
      class="center" 
      v-else-if="!categories.length"
    >
      {{'NoRecords'|localize}} <router-link to="/categories">{{'Add'|localize}}</router-link>
    </p>

    <section v-else>
      <div 
        v-for="cat in categories" 
        :key="cat.id"
      >
        <p>
          <strong>{{cat.title}}:</strong>
          {{cat.spend | currency('RUB')}} из {{cat.limit | currency('RUB')}}
        </p>
        <div class="progress">
          <div
              class="determinate" 
              :class="[cat.progressColor]"
              :style="{width: cat.progressPercent + '%'}"
          ></div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'
import currencyFilter from '@/filters/currency.filter.js'

export default {
  name: 'planning', 
  data: () => ({
    loading: true, 
    categories: []
  }), 
  metaInfo() {
    return {
      title: this.$title('PlanningTitle')
    }
  },
  computed: {
    ...mapGetters(['info'])
  },
  async mounted() {
    const records = await this.$store.dispatch('fetchRecords')
    const categories = await this.$store.dispatch('fetchCategories')

    this.categories = categories.map(cat => {
      const spend = records
        .filter(r => r.categoryId === cat.id)
        .filter(r => r.type === 'outcome')
        .reduce((total, r) => { 
          return total += +r.amount
        }, 0)

      const percent = 100 * spend / cat.limit   
      const progressPercent = percent > 100 ? 100 : percent
      const progressColor = percent < 60 
        ? 'green'  
        : percent < 100 
          ? 'yellow'
          : 'red'

      const tooltipValue = cat.limit - spend
      const tooltip = this.$options.filters['localize'](tooltipValue < 0 ? 'Tooltip_Overflow' : 'Tooltip_Remains') 
      const tooltipVal = currencyFilter(Math.abs(tooltipValue))
      // Или так с фильтром console.log(this.$options.filters['currency'](1200.00))
      return {...cat, progressPercent, progressColor, spend, tooltip, tooltipVal}
    })

    this.loading = false
  },
}
</script>
