/*
 * this script SUCKS. it's a very rough hacky thing, I'll
 * work on it more later
 */
import _ from 'lodash'
import request from 'request-promise-native'

function getWithToken(token) {
  return async function get(query, params) {
    params = params || '';
    let r = await request(`https://api.groupme.com/v3${query}?token=${token}${params}`);
    return JSON.parse(r);
  }
}

async function getGroups(token) {
  const get = getWithToken(token);

  let all = [];
  let groups = await get('/groups', '&per_page=100');
  let page = 1;

  while (true) {
    all.unshift(...groups.response);

    if (groups.response.length < 100)
      break;

    groups = await get('/groups', `&per_page=100&page=${page}`);
    page++;
  }

  return all;
}

async function main(token, groupId, limit = 0) {

  const get = getWithToken(token);

  let groups = await get(`/groups`);
  let mf = _.find(groups.response, { id: groupId });

  if (!mf) {
    return [];
  }

  let messages = await get(`/groups/${mf.id}/messages`, '&limit=100');

  let all = [];

  while (true) {

    let ms = messages.response.messages;

    ms.forEach(m => {
      all.unshift(m);
    });

    if (ms.length < 100 || (limit && all.length > limit))
      break;

    let last = _.last(ms);
    messages = await get(`/groups/${mf.id}/messages`, `&limit=100&before_id=${last.id}`);
  }

  return all;

}

export default main;
export {
  getGroups
};
