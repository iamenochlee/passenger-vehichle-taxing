const { BigNumber } = require("ethers");
const axios = require("axios");
require("dotenv").config();

async function getConversionRate() {
  var myHeaders = new Headers();
  let Rate;
  myHeaders.append("apikey", process.env.CURRENCY_API_KEY);
  var requestOptions = {
    method: "GET",
    redirect: "follow",
    headers: myHeaders,
  };
  await axios
    .get(
      "https://api.apilayer.com/exchangerates_data/convert?to=USD&from=NGN&amount=1",
      requestOptions
    )
    .then((response) => response.json())
    .then((data) => {
      const rate = data.result * 1000;
      const currentRate = rate.toString().slice(0, 3);
      Rate = BigNumber(currentRate);
    })
    .catch((error) => console.log("error", error));
  console.log(Rate);
  return Rate;
}

getConversionRate();

module.exports = {
  getConversionRate,
};
