/*!
 * Store services (Vue)
 * File: store.services.js
 * Copyright(c) 2022 BC Gov
 * MIT Licensed
 */

import api from './api.services';

/**
 * Registration data model
 *  1. Recipient Profile
 *  2. Milestone
 *  3. Retirement
 *  4. Award Selection
 *  5. Award Options
 *  6. Service Pins
 *  7. Ceremony/Survey
 *  8. Personal Contact
 *  9. Confirmation
 */

const initSettings = {}
const initUser = {}
const initProfile = {
    firstname       : '',
    lastname        : '',
    organization    : ''
}
const initMilestone = {}
const initRetirement = {}
const initAwardSelection = {}
const initAwardOptions = {}
const initServicePins = {}
const initCeremony = {}
const initContact = {}
const initConfirmation = {}

const initValidation = {
  profile: false,
  milestone: false,
  retirement: false,
  awardSelection: false,
  awardOptions: false,
  servicePins: false,
  ceremony: false,
  contact: false,
  confirmation: false
}

const initMessage = {
  text: '',
  type: '',
  spinner: false
}

/**
 * State storage
 */

const state = {
  user: initUser,
  settings: initSettings,
  registration: {
    profile: initProfile,
    milestone: initMilestone,
    retirement: initRetirement,
    awardSelection: initAwardSelection,
    awardOptions: initAwardOptions,
    servicePins: initServicePins,
    ceremony: initCeremony,
    contact: initContact,
    confirmation: initConfirmation
  },
  progress: 0,
  validation: initValidation,
  message: initMessage,
  error: false,
  loading: false
};

/**
 * State getters
 */

const getters = {
  isAuthenticated: state => {
    return !!state.user && !!state.user.guid && !!state.user.username && !!state.user.role
  },
  isAdmin: state => {
    return state.user.role === 'administrator' || state.user.role === 'super-administrator'
  },
  isSuperAdmin: state => {
    return state.user.role === 'super-administrator'
  },
  getMessage: state => {
    return state.message || initMessage
  },
  isError: state => {
    return state.error
  },
  isLoading: state => {
    return state.loading
  },
  getUser: state => {
    const {
      guid='',
      username='',
      firstname='',
      lastname='',
      email='',
      role='' } = state.user;
    return {
      guid: guid,
      username: username,
      firstname: firstname,
      lastname: lastname,
      email: email,
      role: role
    }
  },
  getSettings: state => {
    return state.settings || initSettings
  },
  getRegistration: state => {
    return state.registration
  },
  validateProfile: state => {
    return !!state.profile.firstname && !!state.profile.firstname && !!state.profile.organization
  },
  validateMilestone: state => {
    return !!state.profile.firstname && !!state.profile.firstname && !!state.profile.organization
  },
  validateRetirement: state => {
    return !!state.profile.firstname && !!state.profile.firstname && !!state.profile.organization
  },
  validateAwardSelection: state => {
    return !!state.profile.firstname && !!state.profile.firstname && !!state.profile.organization
  },
  validateAwardOptions: state => {
    return !!state.profile.firstname && !!state.profile.firstname && !!state.profile.organization
  },
  validateServicePins: state => {
    return !!state.profile.firstname && !!state.profile.firstname && !!state.profile.organization
  },
  validateCeremony: state => {
    return !!state.profile.firstname && !!state.profile.firstname && !!state.profile.organization
  },
  validateContact: state => {
    return !!state.profile.firstname && !!state.profile.firstname && !!state.profile.organization
  },
  validateConfirmation: state => {
    return !!state.profile.firstname && !!state.profile.firstname && !!state.profile.organization
  },
  getValidation: state => {
    // run validation checks on all forms
    state.validation.profile = this.validateProfile(state)
    state.validation.milestone = this.validateMilestone(state)
    state.validation.retirement = this.validateRetirement(state)
    state.validation.awardSelection = this.validateAwardSelection(state)
    state.validation.awardOptions = this.validateAwardOptions(state)
    state.validation.servicePins = this.validateServicePins(state)
    state.validation.ceremony = this.validateCeremony(state)
    state.validation.contact = this.validateContact(state)
    state.validation.confirmation = this.validateConfirmation(state)
    return state.validation
  }
};

/**
 * Actions
 */

const actions = {
  setMessage({ commit }, newValue) {
    const { text='', type='', spinner=false } = newValue || {}
    commit("setMessage", { text: text, type: type, spinner: spinner });
  },
  resetMessage({ commit }) {
    commit("resetMessage");
  },
  async login({commit}) {
    try {
      const response = await api.get('users/login') || {}
      const { data = {} } = response || {}
      const { user = {} } = data || {}
      await commit('setUser', user)
    } catch (err) {
      console.error(err);
      process.env.NODE_ENV === 'production'
        ? await commit('setMessage', {
          text: 'Please sign in to access this site.',
          type: 'danger'
        })
        : await commit('setUser', {
          guid: 'test_admin_guid',
          username: 'test_admin',
          role: 'super-administrator'
        })
    }
  },
  async logout({commit}){
    await api.post('users/logout')
    await commit('logout')
  },
  async createRegistration({ commit }, init) {

    // initialization
    commit('resetRegistration')
    commit('setError', false)
    commit('setMessage', {
      text: 'Creating new registration...',
      type: 'info',
      spinner: true
    })

    // check if user has an existing registration
    const response = await api.get(`recipient/${init.guid}`) || []
    const { data=[] } = response || {}
    commit("setRegistration", data)
    commit('setMessage', {
      text: 'Created new registration.',
      type: 'success'
    })
  },
  async removeRegistration({ commit }, id) {
    commit('resetRegistration')
    commit('setError', false)
    commit('setMessage', {
      text: 'Deleting registration...',
      type: 'info',
      spinner: true
    })

    await api.get(`data/delete/${id}`)
    commit('resetMessage')
    commit('setMessage', {
      text: 'Registration deleted successfully!',
      type: 'success',
      spinner: false
    })
  },
  async loadRegistration({ commit }, guid) {
    commit('resetRegistration')
    commit('setError', false)
    commit('setLoading', true)
    commit('setMessage', {
      text: 'Loading Registration data...',
      type: 'info',
      spinner: true
    })

    const registration = await api.get(`recipient/${guid}`)
    const { data=null } = registration || {}
    console.log('Loading Registration:', registration.data)

    // does this Registration exist?
    if ( !data ) {
      commit('setMessage', {
        text: 'Registration could not be found.',
        type: 'danger'
      })
      commit('setError', true)
      commit('setLoading', false)
    }
    else {
      // store Registration + attachment data in state
      commit("setRegistration", data || {})
      commit('resetMessage')
      commit('setLoading', false)
    }
  },
  setRegistration({ commit }, newValue) {
    commit("setRegistration", newValue);
  },
  resetRegistration({ commit }) {
    commit("resetRegistration");
  },
  setValidation({ commit }, newValue) {
    commit("setValidation", newValue);
  },
  handleError ({ commit }, message) {
    commit('setMessage', message)
    commit('setError', true)
  }
};

/**
 * State mutations
 */

const mutations = {
  logout(state){
    localStorage.clear()
    state.user = null
  },
  setMessage( state, message ) {
    state.message = message
  },
  resetMessage (state) {
    state.message = initMessage
  },
  setError( state, isError ) {
    state.error = isError
  },
  setLoading( state, isLoading ) {
    state.loading = isLoading
  },
  setUser(state, user){
    state.user = user
  },
  setRegistration(state, data) {
    state.Registration = Object.assign({}, state.Registration, data)
  },
  resetRegistration(state) {
    state.Registration = {}
  },
  setAttachments(state, data) {
    state.attachments = data
  },
  setValidation(state, data) {
    state.validation = Object.assign({}, state.validation, data)
  }
};

export default {
  state,
  getters,
  actions,
  mutations
};
