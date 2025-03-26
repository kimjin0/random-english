// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  devServer: {
    port: 5009,
  },
  nitro: {
    output: { dir: process.argv[4] === '.env' ? './output' : './output-dev' },
  },
});
