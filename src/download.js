/*
 * this script SUCKS. it's a very rough hacky thing, I'll
 * work on it more later
 */
import _ from 'lodash'
import request from 'request-promise-native'

async function main(token) {

  async function get(query, params) {
    params = params || '';
    let r = await request(`https://api.groupme.com/v3${query}?token=${token}${params}`);
    return JSON.parse(r);
  }

  let groups = await get(`/groups`);
  let mf = _.find(groups.response, { name: 'Marketing Fang' });

  let messages = await get(`/groups/${mf.id}/messages`, '&limit=100');

  let all = [];

  while (true) {

    let ms = messages.response.messages;

    ms.forEach(m => {
      all.unshift(m);
    });

    if (ms.length < 100)
      break;

    let last = _.last(ms);
    messages = await get(`/groups/${mf.id}/messages`, `&limit=100&before_id=${last.id}`);
  }

  return all;

}

export default main;
