import { defineStore } from 'pinia'


export default defineStore('lateralConfig', {
  state: () => {
    return {
      lineColor: '#ffffff',
      pointColor: '#aaa',
      keyPointColor: '#f00',
      targetColor: '#f00'
    }
  },
  getters: {

  },
  actions: {
  },
  /** 持久缓存配置 */
  persist: {
    enabled: true,
    strategies: [
      {
        storage: localStorage,
        paths: ['lineColor', 'pointColor','keyPointColor','targetColor'],
      }
    ]
  }
})