const axios = require('axios').default

async function shopgetByIdRes(ids, token) {
  try {
    const getShopDetail = await axios({
      method: 'get',
      url: `http://localhost:4000/api/v1/shop/detail/${ids}`,
      data: {},
      headers: {
        'Content-Type': 'application/json',
        Authorization: `${token}`
      }
    })
    console.log('getShopDetail', getShopDetail)
    return await getShopDetail.data
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
        Authorization: `${token}`
      }
    })
    console.log('getShopUpdate', getShopUpdate)
    return await getShopUpdate.data
  } catch (error) {
    console.log(error)
  }
}

module.exports = { shopgetByIdRes, shopUpdateRes }
