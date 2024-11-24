const axios = require('axios').default

async function shopgetByIdRes(ids, token) {
  try {
    console.log('token---->', token)
    const getShopDetail = await axios({
      method: 'get',
      url: `http://localhost:4000/api/v1/shop/view/${ids}`,
      data: {},
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    })
    console.log('getShopDetail', getShopDetail.data)
    return await getShopDetail.data.data
  } catch (error) {
    console.log(error)
  }
}

async function shopUpdateRes(ids, token, obj) {
  try {
    const getShopUpdate = await axios({
      method: 'get',
      url: `http://localhost:4000/api/v1/shop/update/${ids}`,
      data: obj,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    })
    console.log('getShopUpdate', getShopUpdate)
    return await getShopUpdate.data
  } catch (error) {
    console.log(error)
  }
}

module.exports = { shopgetByIdRes, shopUpdateRes }
