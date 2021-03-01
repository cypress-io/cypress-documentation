export default function ({ route }) {
  if (route.hash) {
    // eslint-disable-next-line no-console
    console.log("====> ROUTE", route.fullPath)

    window.$nuxt.$router.replace(route.fullPath.tolowerCase())
  }
  

}