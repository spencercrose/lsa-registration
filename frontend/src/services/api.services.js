/*!
 * API services (Vue)
 * File: api.services.js
 * Copyright(c) 2022 BC Gov
 * MIT Licensed
 */

import axios from "axios";

const api = axios.create({
  baseURL: process.env.NODE_ENV === 'production'
    ? "https://premiersawards.gww.gov.bc.ca/registrations/api"
    : "http://localhost/api",
  headers: {
    "Content-Type": "application/json"
  },
  // withCredentials: true
});

/**
 * Authenticate user SAML credentials
 */

const authenticate = async () => {
  const response = await api.get('users/authenticate') || {}
  const { data = {} } = response || {}
  const { user = {} } = data || {}
  return user
}

/**
 * Get registration for requested GUID
 */

const getRegistration = async (guid) => {
  const response = await api.get(`recipients/${guid}`) || {}
  const { data = {} } = response || {}
  const { award=[], personal_address = {}  } = data || {}
  const supervisor_address={}

  console.log(
    'Loaded Registration:', data, 'Milestone:', localStorage.getItem('milestone'))

  // filter recipient awards by selected milestone
  const milestone = localStorage.getItem('milestone')
  const selectedAwards = award.filter(item => String(item.milestone) === String(milestone))
  let selectedAward = { awardId: null, options: {}, type: null }
  if (selectedAwards.length > 0) {
    const { pivot={} } = selectedAwards[0] || {}
    const { award_id=null, options='' } = pivot || {}
    selectedAward = {
      awardId: award_id,
      options: JSON.parse(options)
    }
  }

  return {
    recipientId: data.id || null,
    metadata: {
      createdAt: data.create || null,
      updatedAt: data.updated_at || null,
      adminNotes: data.admin_notes || null,
    },
    identification: {
      guid: data.guid || null,
      idir: data.idir || null,
      employeeNumber: data.employee_number || null,
      fullName: data.full_name || null,
      governmentEmail: data.government_email || null,
      governmentPhoneNumber: data.government_phone_number || null,
      organizationId: data.organization_id || null,
      branchName: data.branch_name || null,
      // officeAddressId: office_address.id || null,
      // officeAddressPrefix: office_address.prefix || null,
      // officeAddressStreetAddress: office_address.street_address || null,
      // officeAddressPostalCode: office_address.postal_code || null,
      // officeAddressCommunity: office_address.community || null
    },
    milestone: {
      selected: milestone,
      milestones: data.milestones || null,
      qualifyingYear: data.qualifying_year || null,
      isBCGEUMember: data.is_bcgeu_member || null,
    },
    awardSelection: selectedAward,
    retirement: {
      retiringThisYear: data.retiring_this_year || 0,
      retirementDate: data.retirement_date || null,
    },
    servicePins: {
      supervisorAddressId: data.supervisor_address_id || null,
      supervisorPOBox: supervisor_address.pobox || null,
      supervisorAddressPrefix: supervisor_address.prefix || null,
      supervisorAddressStreetAddress: supervisor_address.street_address || null,
      supervisorAddressPostalCode: supervisor_address.postal_code || null,
      supervisorAddressCommunity: supervisor_address.community || null,
      supervisorEmail: data.supervisor_email || null,
      supervisorFullName: data.supervisor_full_name || null,
    },
    contact: {
      personalAddressId: personal_address.id || null,
      personalAddressPrefix: personal_address.prefix || null,
      personalAddressStreetAddress: personal_address.street_address || null,
      personalAddressPostalCode: personal_address.postal_code || null,
      personalAddressCommunity: personal_address.community || null,
      personalEmail: data.personal_email || null,
      personalPhoneNumber: data.personal_phone_number || null
    },
    declarations: {
      isDeclared: data.is_declared || 0,
      ceremonyOptOut: data.ceremony_opt_out || 0,
      surveyParticipation: data.survey_participation || 1
    }
  }
}

/**
 * Update identification data for recipient
 */

const updateIdentification = async (data) => {
  const { identification={} } = data || {}
  return await api.post('/recipients/identification', {
    guid: identification.guid || null,
    idir: identification.idir || null,
    employee_number: identification.employeeNumber || null,
    full_name: identification.fullName || null,
    government_email: identification.governmentEmail || null,
    organization_id: identification.organizationId || null,
    branch_name: identification.branchName || null,
  })
}

/**
 * Update milestone data for recipient
 */

const updateMilestone = async (data) => {
  const { recipientId=null, milestone={}, retirement={} } = data || {}
  localStorage.setItem('milestone', milestone.selected )
  return await api.post(`/recipients/${recipientId}/milestone`, {
    milestones: milestone.selected || null,
    qualifying_year: milestone.qualifyingYear || null,
    is_bcgeu_member: milestone.isBCGEUMember || 0,
    retiring_this_year: retirement.retiringThisYear || 0
  })
}

/**
 * Update retirement data for recipient
 */

const updateRetirement = async (data) => {
  const { recipientId=null, retirement={} } = data || {}
  return await api.post(`/recipients/${recipientId}/retirement`, {
    retirement_date: retirement.retirementDate || null,
  })
}

/**
 * Update awards data for recipient
 * - NOTE: Award options are stored as JSON string
 */

const updateAward = async (data) => {
  const { recipientId=null, awardSelection={} } = data || {}
  localStorage.setItem('award', awardSelection.awardId )
  return await api.post(`/recipients/${recipientId}/award`, {
    award_id: awardSelection.awardId || null,
    options: JSON.stringify(awardSelection.options) || null,
    status: 'selected'
  })
}

/**
 * Update service pins data for recipient
 */

const updateServicePins = async (data) => {
  const { recipientId=null, servicePins={} } = data || {}
  return await api.post(`/recipients/${recipientId}/servicepins`, {
    supervisor_address_prefix: servicePins.supervisorAddressPrefix || '',
    supervisor_address_street_address: servicePins.supervisorAddressStreetAddress || '',
    supervisor_address_postal_code: servicePins.supervisorAddressPostalCode || null,
    supervisor_address_community: servicePins.supervisorAddressCommunity || '',
    supervisor_address_id: servicePins.supervisorAddressId || null,
    supervisor_email: servicePins.supervisorEmail || null,
    supervisor_full_name: servicePins.supervisorFullName || null,
  })
}

/**
 * Update contact information for recipient
 */

const updatePersonalContact = async (data) => {
  const { recipientId=null, contact={} } = data || {}
  return await api.post(`/recipients/${recipientId}/contact`, {
    personal_address_id: contact.personalAddressId || '',
    personal_address_prefix: contact.personalAddressPrefix || '',
    personal_address_street_address: contact.personalAddressStreetAddress || '',
    personal_address_postal_code: contact.personalAddressPostalCode || '',
    personal_address_community: contact.personalAddressCommunity || '',
    personal_email: contact.personalEmail || '',
    personal_phone_number: contact.personalPhoneNumber || ''
  })
}

/**
 * Update declarations data for recipient
 */

const updateDeclarations = async (data) => {
  const { recipientId=null, declarations={} } = data || {}
  return await api.post(`/recipients/${recipientId}/declarations`, {
    is_declared: declarations.isDeclared || 0,
    survey_participation: declarations.surveyParticipation || 1,
    ceremony_opt_out: declarations.ceremonyOptOut || 0
  })
}

/**
 * Get awards for requested milestone
 *
 * @param milestone
 */

const getAwards = async (milestone) => {
  const response = await api.get(`milestones/${milestone}/awards`)
  const { data = [] } = response || {}
  return data.map(award => {
    return {
      id: award.id || '',
      name: award.name || '',
      shortName: award.short_name || '',
      description: award.description || '',
      imageUrl: award.image_url || ''
    }
  })
}

/**
 * Get PECSF charity options
 */

const getPecsfOptions = async () => {
  const pecsfCharityOptions = await api.get(`pecsf/charities`)
  const pecsfRegionOptions = await api.get(`pecsf/regions`)
  return {
    charities: pecsfCharityOptions.data,
    regions: pecsfRegionOptions.data
  }
}

/**
 * Get static options
 */

const getOptions = async () => {
  const orgResponse = await api.get(`organizations/`)
  return {
    organizations: (orgResponse.data || []).map(org => {
      return {
        id: org.id || '',
        name: org.name || '',
        shortName: org.short_name || '',
        orgType: org.org_type || ''
      }
    }),
  }
}

export {
  authenticate,
  getRegistration,
  updateIdentification,
  updateMilestone,
  updateRetirement,
  updateAward,
  updatePersonalContact,
  updateServicePins,
  updateDeclarations,
  getAwards,
  getPecsfOptions,
  getOptions
};
