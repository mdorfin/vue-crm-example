<template>
  <div>
    <div class="page-title">
      <h3>{{'CategoriesTitle'|localize}}</h3>
    </div>
    <section>
      <Loader v-if="loading" />
      <div v-else class="row">
        <CategoryCreate @created="addNewCategory"/>
        <CategoryEdit 
          v-if="categories.length"
          @updated="updateCategories" 
          :categories="categories" 
          :key="categories.length + updateCount" />            
      </div>
    </section>
  </div>
</template>

<script>
import CategoryCreate from '@/components/CategoryCreate.vue'
import CategoryEdit from '@/components/CategoryEdit.vue'

export default {
  name: 'categories', 
  data: () => ({
    categories: [], 
    loading: true, 
    updateCount: 0
  }),
  metaInfo() {
    return {
      title: this.$title('CategoriesTitle')
    }
  },
  async mounted() { 
    this.categories = await this.$store.dispatch('fetchCategories')
    this.loading = false
  },
  methods: {
    addNewCategory(category) {
      this.categories.push(category)
    }, 
    updateCategories(category) { 
      const idx = this.categories.findIndex(c => c.id === category.id)
      this.categories[idx].title = category.title
      this.categories[idx].limit = category.limit
      this.updateCount += 1
    }
  },
  components: {
    CategoryCreate, CategoryEdit
  }
}
</script>
