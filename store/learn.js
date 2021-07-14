export const state = () => {
  return {
    currentLesson: null,
    currentSection: null,
    lessonsData: null,
}}

export const getters = {
  getterCurrentLesson: state => {
    return state.currentLesson
  },

  getterCurrentSection: state => {
    return state.currentSection
  },

  getterLessonsData: state => {
    return state.lessonsData
  },
}

export const mutations = {
  updateCurrentLesson: (state, lesson) => {
    state.currentLesson = lesson
  },

  updateCurrentSection: (state, section) => {
    state.currentSection = section
  },

  updateLessonsData: (state, data) => {
    state.lessonsData = data
  },
}

export const actions = {
  async actionGetLessonsData({ commit, state }) {
    if (state.lessonsData === null) {
      const data = await this.$content('_data/learn').fetch()

      commit('updateLessonsData', data)
    }
  }
}