/*!
 * Store services (Vue)
 * File: store.services.js
 * Copyright(c) 2022 BC Gov
 * MIT Licensed
 */

import {authenticate, getAwards, getOptions, getRegistration, getPecsfOptions } from './api.services';

/**
 * Registration data model
 *  1. Recipient Identification
 *  2. Milestone
 *  3. Retirement
 *  4. Award Selection
 *  5. Award Options
 *  6. Service Pins
 *  7. Ceremony/Survey
 *  8. Personal Contact
 *  9. Confirmation
 */

const initRegFlowStatus = {
  current: null,
  next: null,
  previous: null
}
const initOptions = {
  organizations: []
}
const initUser = {}
const initIdentification = {}
const initMilestone = {}
const initRetirement = {}
const initAwards = []
const initAwardSelection = {
  awardId: null,
  options: {type: null}
}
const initServicePins = {}
const initContact = {}
const initDeclarations = {}

const initValidation = {
  'reg-step-identification': true,
  'reg-step-milestone': true,
  'reg-step-retirement': true,
  'reg-step-award-selection': true,
  'reg-step-award-options': true,
  'reg-step-service-pins': true,
  'reg-step-ceremony': true,
  'reg-step-contact': true,
  'reg-step-confirmation': true
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
  recipientId: null,
  status: initRegFlowStatus,
  user: initUser,
  options: initOptions,
  metadata: {},
  identification: initIdentification,
  milestone: initMilestone,
  retirement: initRetirement,
  awardSelection: initAwardSelection,
  servicePins: initServicePins,
  contact: initContact,
  declarations: initDeclarations,
  awards: initAwards,
  pecsfOptions: {},
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
  isLoading: state => {
    return state.loading
  },
  isError: state => {
    return state.error
  },
  // isLoading: state => {
  //   return state.loading
  // },
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

  /**
   * Get ministries in store as select options
   *
   * @param  state
   * @return {Array}
   */

  getOrganizations: state => {
    // sorting comparison function
    // - puts items in alphabetical order
    function compare( a, b ) {
      if ( a.shortName < b.shortName )return -1;
      if ( a.shortName > b.shortName )return 1;
      return 0;
    }
    const orgs = state.options.organizations
      .sort(compare)
      .map(org => {
      return {
        text: `[${org.shortName}] ${org.name}`,
        value: org.id
      }
    }) || initOptions
    orgs.unshift({ value: null, text: 'Please select a Ministry' })
    return orgs
  },

  /**
   * Get milestone selected for registration
   *
   */

  getMilestone: state => {
    return state.milestone.selected || localStorage.getItem('milestone')
  },

  /**
   * Get awards loaded for given milestone
   *
   * @param  state
   * @return {Array}
   */

  getAwards: state => {
    return state.awards
  },

  /**
   * Get PECSF charities and regions
   *
   * @param  state
   * @return {Array}
   */

  getPecsfOptions: state => {
    return state.pecsfOptions
  },

  /**
   * Get registration workflow status
   *
   * @param  state
   * @return {Object}
   */

  getStatus: state => {
    return state.status
  },

  /**
   * Get registration data from state
   *
   * @param  state
   * @return {{identification: (*|boolean), milestone: (boolean|*), contact: (boolean|*), retirement: (boolean|*), awardSelection: (boolean|*), servicePins: (boolean|*), declarations: (boolean|*)}}
   */

  getRegistration: state => {
    return {
      recipientId: state.recipientId,
      metadata: state.metadata,
      identification: state.identification,
      milestone: state.milestone,
      retirement: state.retirement,
      awardSelection: state.awardSelection,
      servicePins: state.servicePins,
      contact: state.contact,
      declarations: state.declarations
    }
  },

  /**
   * Get registration validation status from state
   *
   * @param  state
   * @return {Array}
   */

  getValidation: state => {
    // run validation checks on all forms (registration steps)
    // TODO complete validators in each form
    return state.validation
  }
};

/**
 * Actions
 */

const actions = {

  /**
   * Authenticate SSO credentials
   * @param commit
   * @param state
   */

  async authenticate({commit, state}) {
    try {
      const user = await authenticate()
      await commit('setUser', user)
      return user
    } catch (err) {
      process.env.NODE_ENV === 'production'
        ? await commit('setMessage', {
          text: 'Please sign in to access this site.',
          type: 'danger'
        })
        : await commit('setUser', {
          guid: process.env.VUE_APP_TEST_GUID,
          username: process.env.VUE_APP_TEST_IDIR,
          role: 'super-administrator'
        })
      return state.user
    }
  },

  /**
   * Initialize new registration data for recipient
   * @param commit
   * @param guid
   */

  async initRegistration({ commit, state }) {
    commit('resetRegistration')
    commit('setMessage', {
      text: 'Starting a new registration!',
      type: 'success'
    })
    // initialize identification data using credentials
    const { guid='', username='' } = state.user || {}
    commit('setIdentification', {
      guid: guid,
      idir: username
    })
  },

  /**
   * Load registration data for recipient into store
   * @param commit
   * @param state
   * @param guid
   */

  async loadRegistration({ commit, state }, guid) {
    commit('resetRegistration')
    commit('setMessage', {
      text: 'Loading Registration data...',
      type: 'info',
      spinner: true
    })

    // retrieve registration data by GUID
    state.loading = true
    const registration = await getRegistration(guid, state.milestone.selected, state.awardSelection)
    state.loading = false
    console.log('Loading Destructured Registration:', registration)

    // store registration sections data in state
    commit("setRegId", registration.recipientId)
    commit("setMetadata", registration.metadata)
    commit("setIdentification", registration.identification)
    commit("setMilestone", registration.milestone)
    commit("setRetirement", registration.retirement)
    commit("setAwardSelection", registration.awardSelection)
    commit("setServicePins", registration.servicePins)
    commit("setContact", registration.contact)
    commit("setDeclarations", registration.declarations)

    // load any awards for requested milestone
    if (state.milestone.selected) {
      const awards = await getAwards(state.milestone.selected)
      commit("setAwards", awards)
    }

    // load any options for requested award
    const awardId = localStorage.getItem('award')
    if (awardId) {
      const pecsfOptions = await getPecsfOptions()
      commit("setPecsfOptions", pecsfOptions)
    }

    // load global options
    const options = await getOptions()
    commit("setOptions", options)


    commit('resetMessage')
  },

  /**
   * Save registration data to database
   * @param commit
   * @param state
   * @param updater
   */

  async saveRegistration({ commit, state }, updater) {
    try {
      commit('setError', false)
      commit('setLoading', true)
      commit('setMessage', {
        text: 'Saving Registration data...',
        type: 'info',
        spinner: true
      })

      const registration = {
        recipientId: state.recipientId,
        identification: state.identification,
        milestone: state.milestone,
        retirement: state.retirement,
        awardSelection: state.awardSelection,
        servicePins: state.servicePins,
        contact: state.contact,
        declarations: state.declarations
      }
      console.log('Saving:', registration)

      // update registration data for recipient
      await updater(registration)
      commit('setMessage', {
        text: 'Registration saved.',
        type: 'success',
        spinner: false
      })

    } catch (err) {
      console.error(err);
      console.warn('Error', err.message);
      commit('setMessage', {
        text: 'Registration could not be saved.',
        type: 'danger',
        spinner: false
      })
    } finally {
      commit('setLoading', false)
    }
  },

  /**
   * Load options in store
   * @param commit
   * @param data
   */

  async loadOptions({ commit }) {
    const options = await getOptions()
    commit("setOptions", options);
  },

  /**
   * Set global message
   * @param commit
   * @param msgData
   */

  setMessage({ commit }, msgData) {
    const { text='', type='', spinner=false, dismissible=false } = msgData || {}
    commit("setMessage", {
      text: text,
      type: type,
      spinner: spinner,
      dismissible: dismissible
    });
  },

  /**
   * Reset global message
   * @param commit
   */

  resetMessage({ commit }) {
    commit("resetMessage");
  },

  /**
   * Update registration workflow status
   * @param commit
   * @param regData
   */

  setStatus({ commit }, regData) {
    const { current=null, next=null, previous=null } = regData || {}
    commit("setStatus", {
      current: current,
      previous: previous,
      next: next
    });
  },

  /**
   * Reset registration data in store to initial values
   * @param commit
   * @param data
   */

  resetRegistration({ commit }) {
    commit("resetRegistration");
  },

  /**
   * Load awards for requested milestone
   * @param commit
   * @param milestone
   */

  async loadAwards({ commit }, milestone) {
    commit('setError', false)
    commit('setLoading', true)
    commit('setMessage', {
      text: `Loading Awards for milestone year ${milestone}...`,
      type: 'info',
      spinner: true
    })

    // retrieve and destructure API data

    const awards = await getAwards(milestone)

    // do awards exist?
    if ( !awards ) {
      commit('setMessage', {
        text: 'Awards could not be found for this milestone.',
        type: 'danger'
      })
      commit('setError', true)
      commit('setLoading', false)
    }
    else {
      // store identification in state
      commit("setAwards", awards || [])
      commit('resetMessage')
      commit('setLoading', false)
    }
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
  setOptions(state, data) {
    state.options = data
  },
  setAwardOptions(state, data) {
    state.awardSelection.options = data
  },
  setPecsfOptions(state, data) {
    state.pecsfOptions = data
  },
  setStatus(state, data) {
    state.status = data
  },
  setRegId(state, id) {
    state.recipientId = id
  },
  setMetadata(state, data) {
    state.metadata = Object.assign({}, state.metadata, data)
  },
  setIdentification(state, data) {
    state.identification = Object.assign({}, state.identification, data)
  },
  setMilestone(state, data) {
    const { milestones=null } = data
    localStorage.setItem('milestone', milestones)
    state.milestone = Object.assign({}, state.milestone, data)
  },
  setRetirement(state, data) {
    state.retirement = Object.assign({}, state.retirement, data)
  },
  setAwardSelection(state, data) {
    const { awardId=null } = data
    localStorage.setItem('award', awardId)
    state.awardSelection = Object.assign({}, state.awardSelection, data)
  },
  setServicePins(state, data) {
    state.servicePins = Object.assign({}, state.servicePins, data)
  },
  setDeclarations(state, data) {
    state.declarations = Object.assign({}, state.declarations, data)
  },
  setContact(state, data) {
    state.contact = Object.assign({}, state.contact, data)
  },
  setAwards(state, data) {
    state.awards = Object.assign([], state.awards, data)
  },
  resetRegistration(state) {
    state.identification = initIdentification
    state.milestone = initMilestone
    state.retirement = initRetirement
    state.awardSelection = initAwardSelection
    state.servicePins = initServicePins
    state.contact = initContact
    state.declarations = initDeclarations
  },
  setValidation(state, key, value) {
    state.validation[key] = value
  }
};

export default {
  state,
  getters,
  actions,
  mutations
};
