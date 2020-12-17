import localizeFilter from '../filters/localize.filter'

export default {
  bind(el, {value}) {
    window.M.Tooltip.init(el, {html: localizeFilter(value)})
  }, 
  unbind(el) {
    const tooltip = window.M.Tooltip.getInstance(el)
    if (tooltip && tooltip.destroy) {
      tooltip.destroy()
    }
  }
}
