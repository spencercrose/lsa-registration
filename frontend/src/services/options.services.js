/*!
 * Form services/utilities (Vue)
 * File: forms.services.js
 * Copyright(c) 2022 BC Gov
 * MIT Licensed
 */

const schemaData = {
  "status": [
    {value: null, text: 'Please select a registration status'},
    {value: 'draft', text: 'Draft'},
    {value: 'submitted', text: 'Submitted'}
  ],
  "roles": [
    {value: null, text: 'Please select a user role'},
    {value: 'administrator', text: 'Administrator'},
    {value: 'super-administrator', text: 'Super-Administrator'}
  ],
  "registration-steps": [
    {value: 'identification', text: 'Identification'},
    {value: 'milestone', text: 'Milestone'},
    {value: 'retirement', text: 'Retirement'},
    {value: 'award-selection', text: 'Award'},
    {value: 'award-options', text: 'Options'},
    {value: 'service-pins', text: 'Service Pin'},
    {value: 'ceremony', text: 'Ceremony'},
    {value: 'contact', text: 'Contact Info'},
    {value: 'confirmation', text: 'Confirmation'}
  ],
  "milestones": [
    {value: null, text: 'Please select a milestone year'},
    {value: '25', text: '25'},
    {value: '30', text: '30'},
    {value: '35', text: '35'},
    {value: '40', text: '40'},
    {value: '45', text: '45'},
    {value: '50', text: '50'}
  ],
  "qualifying-years": [
    {value: '2022', text: '2022'},
    {value: '2021', text: '2021'},
    {value: '2020', text: '2020'},
    {value: '2019', text: '2019'}
  ],
  "award-options-bracelet-sizes": [
    {value: null, text: 'Please select a bracelet size'},
    {value: '6', text: '6 inches'},
    {value: '7', text: '7 inches'},
    {value: '8', text: '8 inches'},
    {value: '9', text: '9 inches'}
  ],
  "award-options-watch-sizes": [
    {value: null, text: 'Please select a watch size'},
    {value: '26', text: '26mm'},
    {value: '30', text: '30mm'},
    {value: '36', text: '36mm'},
    {value: '48', text: '48mm'}
  ],
  "award-options-watch-faces": [
    {value: null, text: 'Please select a watch face'},
    {value: 'square', text: 'Square'},
    {value: 'Round', text: 'Round'}
  ],
  "award-options-watch-straps": [
    {value: null, text: 'Please select a watch strap'},
    {value: 'leather', text: 'Leather'},
    {value: 'mesh', text: 'Mesh'},
    {value: 'canvas', text: 'Canvas'},
    {value: 'steel', text: 'Stainless Steel'}
  ]
};

export default {

  /**
   * get enumerated data by key
   * **/

  get: function get(key) {
    return schemaData[key] !== 'undefined' ? schemaData[key] : null;
  },

  /**
   * lookup enumerated option value by key
   * **/

  lookup: function lookup(key, value, options=schemaData) {
    if (!options[key]) return null;
    const found = options[key].filter(item => item.value === value);
    return found.length > 0 ? found[0].text : null;
  },

  /**
   * get award type by award ID
   * **/

  getAwardType: function getAwardType(id, awards) {
    let awardType = null
    awards.forEach(award => {
      if (award.id === id) {
        awardType = award.shortName.includes('bracelet')
          ? 'bracelet'
          : award.shortName.includes('watch')
            ? 'watch'
            : award.shortName.includes('pecsf')
              ? 'pecsf'
              : null
      }
    })
    return awardType
  },

  /**
   * get award details by award ID
   * **/

  getAwardDetails: function getAwardType(id, awards) {
    const awardDetails = awards.filter(award => award.id === id)
    return awardDetails.length > 0 ? awardDetails[0] : null
  }

}
