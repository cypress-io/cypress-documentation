export default function ({ route }) {
  if (process.client && route.hash) {
    const newFullPath = route.fullPath.toLowerCase()

    if (newFullPath !== route.fullPath) {
      window.location.replace(newFullPath);
    }
  }
}