import VuexPersistence from 'vuex-persist'

export default ({ store }) => {
  new VuexPersistence({
  /* your options */
  }).plugin(store);
}