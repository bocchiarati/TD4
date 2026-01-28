import js from '@eslint/js'
import pluginVue from 'eslint-plugin-vue'

export default [
  // Global ignores
  {
    ignores: ['node_modules/**', 'dist/**'],
  },

  // Recommended configs for JS and Vue
  js.configs.recommended,
  ...pluginVue.configs['flat/recommended'], // Using 'recommended' for more thorough linting

  // Custom rules
  {
    rules: {
      // Allows using single-word names for components (e.g., Home.vue, Profile.vue)
      'vue/multi-word-component-names': 'off',
    },
  },
]
