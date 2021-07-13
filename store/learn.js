export const state = () => {return {
  currentLesson: null,
}}

export const getters = {
  getterCurrentLesson: state => {
    return state.currentLesson
  }
}

export const mutations = {
  updateCurrentLesson: (state, lesson) => {
    state.currentLesson = lesson
  },
}

export const actions = {
  updateActionCurrentLesson({ commit }, lesson) {
    commit('updateCurrentLesson', lesson)
  }
}