const axios = require('axios');
const _ = require('lodash');
const fs = require('fs');

// https://api.feedback.eu.pendo.io for EU datacenter
// https://api.feedback.us.pendo.io for US datacenter
const feedbackUrl = 'https://api.feedback.eu.pendo.io';

// Get your token from https://feedback.us.pendo.io/app/#/vendor/settings?section=api_access
const feedbackApiToken = 'your-api-token-here';

/**
 * Return a list of all Feature Requests in your Feedback instance.
 */
async function getFeatureRequests() {
  const endpoint = `${feedbackUrl}/features?auth-token=${feedbackApiToken}`;

  // Promise resolves to object whose `data` property is an array of following objects:
  // {
  //   id: 4310,
  //   title: 'Add Column for Role',
  //   description: 'I can’t be the first person to have suggested this.   I really need Role on this Contacts table.  Pleaaaase!  I’ll buy the team some drinks when it goes live if you build it.',
  //   resolution: 'Released now. Thanks for all your interest in this request, your feedback helps us to build a better product.',
  //   status: 'released',
  //   vendor_id: 6,
  //   created_by_user_id: 60131,
  //   updated_by_user_id: null,
  //   resolved_by_user_id: 77288,
  //   app_url: 'https://feedback.us.pendo.io/app/#/case/4310',
  //   form_entry: '{"fields":[{"title":"What is your problem or request?","type":"string","content":"Add Column for Role","required":true},{"title":"What are you trying to achieve?","type":"text","content":"I can’t be the first person to have suggested this.   I really need Role on this Contacts table.  Pleaaaase!  I’ll buy the team some drinks when it goes live if you build it.","required":true},{"title":"What is your current work around?","type":"text","content":"to export the data from Acme CRM and match it with role data on excel","required":false}]}',
  //   created_at: '2019-08-28T20:48:26.000Z',
  //   updated_at: '2020-03-09T19:12:12.000Z',
  //   declined_at: null,
  //   developing_at: '2019-08-28T20:48:55.000Z',
  //   planned_at: null,
  //   released_at: '2019-09-16T18:37:50.000Z',
  //   waiting_at: null,
  //   status_changed_at: '2019-09-16T18:37:50.000Z',
  //   seen_case: false,
  //   is_private: false,
  //   effort: 10,
  //   products: [ 'PendoExperience' ],
  //   groups: [],
  //   uploads: []
  // }
  return axios.get(endpoint);
}

/**
 * Return a list of all comments for a given Feature Request.
 */
async function getCommentsByFeatureRequestId(featureRequestId) {
  const endpoint = `${feedbackUrl}/comments?case=${featureRequestId}&auth-token=${feedbackApiToken}`;

  // Promise resolves to object whose `data` property is an array of following objects:
  // {
  //   id: 8620,
  //   case_id: 22411,
  //   user_id: 79164,
  //   text: 'testing private comment',
  //   is_private: true,
  //   created_at: '2020-04-09T15:19:07.000Z',
  //   updated_at: '2020-04-09T15:19:07.000Z',
  //   from_email: false,
  //   user: {
  //     name: 'Evan Hellmuth',
  //     id: 79164,
  //     url: 'https://feedback.us.pendo.io/app/#/user/79164'
  //   }
  // }
  return axios.get(endpoint);
}

function writeJsonData(data, filepath) {
  try {
    fs.writeFileSync(filepath, JSON.stringify(data));
  } catch (err) {
    console.error(err);
  }
}

function loadJsonData(filepath) {
  try {
    return JSON.parse(fs.readFileSync(filepath, 'utf8'));
  } catch (err) {
    console.error(err);
    return false;
  }
}

async function getFeatureRequestsWithComments() {
  const { data: featureRequests } = await getFeatureRequests();

  for (let i = 0; i < featureRequests.length; i++) {
    const featureRequest = featureRequests[i];

    console.log(`Getting comments for FR ${featureRequest.id}`);

    const { data: comments } = await getCommentsByFeatureRequestId(featureRequest.id);

    featureRequest.comments = comments;
  }

  writeJsonData(featureRequests, './featureRequestsAndComments.json');
}

getFeatureRequestsWithComments();
