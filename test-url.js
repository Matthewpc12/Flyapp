const baseUrl = "https://api.codetabs.com/v1/proxy?quest=https://movies-api.accel.li/api/v2";
const url = new URL(`${baseUrl}/list_movies.json`);
url.searchParams.append("page", "1");
console.log(url.toString());
