/*!
 * Routes (Vue)
 * File: routes.js
 * Copyright(c) 2022 BC Gov
 * MIT Licensed
 */

import Home from  './components/views/Home'
import NotFound from './components/views/404'
import Unauthorized from './components/views/401'
import RegStepIdentification from "./components/views/RegStepIdentification";
import RegStepMilestone from "./components/views/RegStepMilestone";
import RegStepAwardSelection from "./components/views/RegStepAwardSelection";
import RegStepAwardOptions from "./components/views/RegStepAwardOptions";
import RegStepRetirement from "./components/views/RegStepRetirement";
import RegStepServicePins from "./components/views/RegStepServicePins";
import RegStepContact from "./components/views/RegStepContact";
import RegStepCeremony from "./components/views/RegStepCeremony";
import RegStepConfirmation from "./components/views/RegStepConfirmation";

/**
 * Set page title/metadata by route
 *
 * @src public
 * @param title
 */

function getMeta(title) {
  const sitename = 'Long Service Awards Registration\n';
  return {
    title: `${title} - ${sitename}`,
    metaTags: [
      {
        name: 'icon',
        content: 'favicon.ico'
      },
    ]
  }
}

/**
 * Route definitions (Vue)
 *
 * @src public
 */

const routes = [
  {
    path: "/",
    name: "home",
    component: Home,
    meta: getMeta('Start Your Registration')
  },
  { path: '/recipients/start', redirect: '/recipients/identification' },
  {
    path: "/recipients/identification",
    name: "reg-step-identification",
    component: RegStepIdentification,
    props: {
      header: 'Your Profile',
      lead: 'Identification information'
    },
    meta: getMeta('Your Identification')
  },
  {
    path: "/recipients/milestone",
    name: "reg-step-milestone",
    component: RegStepMilestone,
    props: {
      header: 'Your Milestone',
      lead: 'Your milestone information'
    },
    meta: getMeta('Recipient Milestone')
  },
  {
    path: "/recipients/award",
    name: "reg-step-award-selection",
    component: RegStepAwardSelection,
    props: {
      header: 'Your Award',
      lead: 'Your award information'
    },
    meta: getMeta('Recipient Award')
  },
  {
    path: "/recipients/award-options",
    name: "reg-step-award-options",
    component: RegStepAwardOptions,
    meta: getMeta('Recipient Award Options')
  },
  {
    path: "/recipients/retirement",
    name: "reg-step-retirement",
    component: RegStepRetirement,
    meta: getMeta('Recipient Retirement')
  },
  {
    path: "/recipients/service-pins",
    name: "reg-step-service-pins",
    component: RegStepServicePins,
    meta: getMeta('Recipient Service Pin')
  },
  {
    path: "/recipients/ceremony",
    name: "reg-step-ceremony",
    component: RegStepCeremony,
    meta: getMeta('Ceremony')
  },
  {
    path: "/recipients/contact",
    name: "reg-step-contact",
    component: RegStepContact,
    meta: getMeta('Contact Information')
  },
  {
    path: "/recipients/confirmation",
    name: "reg-step-confirmation",
    component: RegStepConfirmation,
    meta: getMeta('Confirmation')
  },
  {
    path: '/401',
    name: 'unauthorized',
    component: Unauthorized,
    meta: getMeta('Unauthorized')
  },
  {
    path: '*',
    name: "page-not-found",
    component: NotFound ,
    meta: getMeta('Page Not Found')
  }
];

export default routes;
