/*!
 * Routes (Vue)
 * File: routes.js
 * Copyright(c) 2022 BC Gov
 * MIT Licensed
 */

import Home from  './components/views/Home'
import NotFound from './components/views/404'
import Unauthorized from './components/views/401'
import RegStepProfile from "./components/views/RegStepProfile";
import RegStepMilestone from "./components/views/RegStepMilestone";
import RegStepAwardSelection from "./components/views/RegStepAwardSelection";
import RegStepAwardOptions from "./components/views/RegStepAwardOptions";
import RegStepRetirement from "./components/views/RegStepRetirement";
import RegStepServicePins from "./components/views/RegStepServicePins";
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
    meta: getMeta('Home')
  },
  {
    path: "/recipient/profile",
    name: "recipient-profile",
    component: RegStepProfile,
    props: {
      header: 'Recipient Profile',
      lead: 'Your profile information'
    },
    meta: getMeta('Recipient Profile')
  },
  {
    path: "/recipient/milestone",
    name: "recipient-milestone",
    component: RegStepMilestone,
    props: {
      header: 'Your Milestone',
      lead: 'Your milestone information'
    },
    meta: getMeta('Recipient Milestone')
  },
  {
    path: "/recipient/award",
    name: "recipient-award-selection",
    component: RegStepAwardSelection,
    props: {
      header: 'Your Award',
      lead: 'Your award information'
    },
    meta: getMeta('Recipient Award')
  },
  {
    path: "/recipient/award-options",
    name: "recipient-award-options",
    component: RegStepAwardOptions,
    props: {
      header: 'Your Award Options',
      lead: 'Your award options information'
    },
    meta: getMeta('Recipient Award Options')
  },
  {
    path: "/recipient/retirement",
    name: "recipient-retirement",
    component: RegStepRetirement,
    props: {
      header: 'Your Retirement',
      lead: 'Your retirement information'
    },
    meta: getMeta('Recipient Retirement')
  },
  {
    path: "/recipient/service-pins",
    name: "recipient-service-pins",
    component: RegStepServicePins,
    props: {
      header: 'Your Service Pin',
      lead: 'Your service pin information'
    },
    meta: getMeta('Recipient Service Pin')
  },
  {
    path: "/recipient/ceremony",
    name: "recipient-ceremony",
    component: RegStepCeremony,
    props: {
      header: 'LSA Ceremony',
      lead: 'Your ceremony selection'
    },
    meta: getMeta('LSA Ceremony')
  },
  {
    path: "/recipient/confirmation",
    name: "recipient-confirmation",
    component: RegStepConfirmation,
    props: {
      header: 'Confirm Your Registration',
      lead: 'Confirm your award registration'
    },
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
