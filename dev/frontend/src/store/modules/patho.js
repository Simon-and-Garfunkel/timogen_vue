import timogenJson from "../../data/tarif_kinesitherapeute.json";

// initial state
const state = () => ({
  locations: [],
  pathos: [],
  kinds: [],
  times: [],
  selected_location: {},
  selected_patho: {},
  selected_time: 0,
  selected_kind: "",
})

// getters
const getters = {
  getLocations: state => {
    var sorted_locations = state.locations
    return sorted_locations.sort(l => l.id)
  },
  getPathos: state => {
    var sorted_pathos = state.pathos
    return sorted_pathos.sort(p => p.id)
  },
  getSelectedLocation: state => { return state.selected_location },
  getSelectedPatho: state => { return state.selected_patho },
  getSelectedKind: state => { return state.selected_kind },
  getSelectedTime: state => { return state.selected_time },
  getKinds: state => {
    if (state.selected_patho.length && state.selected_patho.lines.length) {
      var kinds = state.selected_patho.lines.map((line) => line.kind)
        .filter(item => item !== 'INTAKE')
        .filter(item => item !== 'DOUBLE')
        .filter(item => item !== 'SECOND')
        // .filter(item => item !== 'REPORT')
      kinds = [...new Set(kinds)].sort()
      return kinds
    }
    return []
  },
  getTimes: state => {
    if (state.selected_kind) {
      var times = state.selected_patho.lines.filter((line) => line.kind === state.selected_kind).map((line) => line.duration)
      times = [...new Set(times)].sort()
      return times
    }
    return []
  }
}

// actions
const actions = {
  async getAllLocations({ commit }) {
    const pathos = timogenJson;
    commit('setLocations', pathos.locations)
  },
  getLinesByDay({ commit }, day) {
    commit('getLinesByDay', day)
  }
}

// mutations - setters
const mutations = {
  setLocations(state, locations) {
    state.locations = locations
    this.commit("patho/setSelectedLocation", locations.sort(l => -l.id)[0])
  },
  setSelectedLocation(state, value) {
    state.selected_location = value
    state.pathos = state.selected_location.pathos
    this.commit("patho/setSelectedPatho", state.pathos.sort(l => l.id)[0])
  },
  setSelectedPatho(state, value) {
    state.selected_patho = value
    this.commit("patho/setSelectedKind", "STANDARD")
  },
  setSelectedKind(state, value) {
    state.selected_kind = value
    var lines_of_selected_kind = state.selected_patho.lines.filter((line) => line.kind === value)
    if (!lines_of_selected_kind.length && state.selected_patho.lines.length) {
      // DIRTY
      state.selected_kind = state.selected_patho.lines[0].kind
      lines_of_selected_kind = state.selected_patho.lines.filter((line) => line.kind === state.selected_kind)
    }
    if (lines_of_selected_kind.length) {
      state.times = [...new Set(lines_of_selected_kind.map((line) => line.duration))].sort()
    } else {
      state.times = []
    }
    this.commit("patho/setSelectedTime", state.times[0])
  },
  setSelectedTime(state, value) {
    state.selected_time = value
  },
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
