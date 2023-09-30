// This file contains the custom fetching/analysis logic
// Need a file for each analysis/processing script. Each file will be deployed to IPFS and their links will be stored on the consumer/Caller contract
// The script held in the IPFS file will be passed as the script 

// Make request to the Messari subgraph list for avaiable protocols
// Construct the URLs for hosted service subgraph Query links
// Receive the returned data and perform the analysis on each
// Return data set for all protocols, the oracle caller can determine if they want to select the highest yield, or pick from the top 3 etc






// // build HTTP request object
const subgraphsListUrl = "https://raw.githubusercontent.com/messari/subgraphs/master/deployment/deployment.json";

const subgraphslist = await Functions.makeHttpRequest({
    url,
    method: "GET"
})

const subgraphQueryUrlList = Object.values(subgraphslist).map(subgraphSlug => `https://gateway-arbitrum.network.thegraph.com/api/${secrets.GraphApiKey}/subgraphs/id/${subgraphSlug}`)

/// Write the query to be called for all the subgraphs 
const query = `{
	marketDailySnapshots(where: {market_:{inputToken:"${args.assetAddress}"}}) {
        totalDepositBalanceUSD
        dailySupplySideRevenueUSD
  }
}`

// Loop through valid subgraphs and query for each of them
const requests = subgraphQueryUrlList.map(QueryURL => Functions.makeHttpRequest({
    url: QueryURL,
    method: "POST",
    headers: {
        "Content-Type": "application/json",
    },
    data: query
}));

const returnedData = await Promise.all(requests)

// Peform analysis/processing on returned data
// Map through all of the instances on a protocol and exec (dailySupplySideRevenueUSD * 365)


// // Make the HTTP request
// const coinMarketCapResponse = await coinMarketCapRequest;

// if (coinMarketCapResponse.error) {
//     throw new Error("CoinMarketCap Error");
// }

// // fetch the price
// const price =
//     coinMarketCapResponse.data.data[coinMarketCapCoinId]["quote"][currencyCode][
//     "price"
//     ];

// console.log(`Price: ${price.toFixed(2)} ${currencyCode}`);

// // price * 100 to move by 2 decimals (Solidity doesn't support decimals)
// // Math.round() to round to the nearest integer
// // Functions.encodeUint256() helper function to encode the result from uint256 to bytes
// return Functions.encodeUint256(Math.round(price * 100));