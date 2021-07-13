export const state = () => {
  return {
    currentLesson: null,
    currentSection: null,
}}

export const getters = {
  getterCurrentLesson: state => {
    return state.currentLesson
  },
  
  getterCurrentSection: state => {
    return state.currentSection
  },
}

export const mutations = {
  updateCurrentLesson: (state, lesson) => {
    state.currentLesson = lesson
  },
  
  updateCurrentSection: (state, section) => {
    state.currentSection = section
  },
}

// export const actions = {
//   updateActionCurrentLesson({ commit }, lesson) {
//     commit('updateCurrentLesson', lesson)
//   }
// }