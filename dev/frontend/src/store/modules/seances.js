// initial state
const state = () => ({
    first_seance: 1,
    count: 1,
    ads_list: [], // {ads_number, days}
})

// getters
const getters = {
    getFirstSeance: state => { return state.first_seance },
    getAdsList: state => { return state.ads_list },
    getCount: state => { return state.count },
    getOrderedSeances: state => {
        var ordered_list = []
        state.ads_list.forEach(ads => {
            ads.days.forEach(day => {
                ordered_list.push({
                    day: day,
                    ads: ads.ads_number
                })
            })
        })
        ordered_list = ordered_list.sort((a, b) => a.day.date > b.day.date ? 1 : -1)
        var report_met = false;
        for (let i = 0; i < ordered_list.length; i++) {
            if (ordered_list[i].day.kind == 'REPORT') {
                ordered_list[i].index = -1;
                report_met = true;
                continue
            }
            ordered_list[i].index = (parseInt(state.first_seance) || 0) + i - (report_met ? 1 : 0);
        }
        return ordered_list
    },
    getLastSeance: state => {
        var total = parseInt(state.first_seance);
        state.ads_list.forEach(ads => {
            total += parseInt(ads.days.length)
        });
        return total
    },
    getAdsNumbers: state => {
        return state.ads_list.map(ads => ads.ads_number)
    }
}

// setters
const mutations = {
    setFirstSeance(state, value) { state.first_seance = value; },
    setAdsList(state, value) { state.ads_list = value; },
    incrementCount(state) { state.count++; },
    decrementCount(state) { state.count--; },
    addAds(state, new_dates) {
        state.ads_list.splice(new_dates.index - 1, 1)
        state.ads_list.splice(new_dates.index - 1, 0, new_dates)
    },
}

// actions
const actions = {
    incrementCount: ({ commit }) => commit('incrementCount'),
    decrementCount: ({ commit }) => commit('decrementCount'),
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}
