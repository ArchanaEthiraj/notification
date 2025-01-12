const axios = require('axios').default

async function usergetByIdRes(ids, token) {
  try {
    const getUserDetail = await axios({
      method: 'get',
      url: `http://localhost:4000/api/v1/user/view/${ids}`,
      data: {},
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    })
    return await getUserDetail.data.data
  } catch (error) {
    console.log(error)
  }
}

module.exports = { usergetByIdRes }
