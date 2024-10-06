import { TIMEOUT_SEC } from "./config.js";
/* the goal of this file or module is to contain a couple of functions that we reuse over and over in our project so here in this file we have a central place for all those functions */

// this function returns a new promise which will reject after a certain number of seconds
const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

export const AJAX = async function (url, uploadData = undefined) {
  try {
    const fetchPro = uploadData
      ? fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(uploadData),
        })
      : fetch(url);

    /* to make this function more robust by adding some timeout meaning setting a time after which we would make the request fail as it is important in order to prevent for really bad internet connections where the fetch could be runnning forever to get the data from the server so we use promise.race solution/logic that we have used before in one of the async/await lectures */
    const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);
    const data = await res.json();

    // when ok is set to false it means there was some error with the fetch request
    if (!res.ok) throw new Error(`${data.message} (${res.status})`);

    return data;
  } catch (err) {
    /* we want to handle the error in 'model' 'loadrecipe' function where we will use this 'getjson' function, in the usual situation what will happen is that err will be generated from here and not from the function we want to and that function will generate an error which will the consequence of this error here, the point is actual error will be generated from here but we want it there */
    throw err;
  }
};

/* // function that will fetch the API and convert JSON format for us
export const getJSON = async function (url) {
  try {
    const fetchPro = fetch(url);
    const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);
    const data = await res.json();

    if (!res.ok) throw new Error(`${data.message} (${res.status})`);

    return data;
  } catch (err) {
    throw err;
  }
};

export const sendJSON = async function (url, uploadData) {
  try {
    const fetchPro = fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(uploadData),
    });
    const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);
    const data = await res.json();

    if (!res.ok) throw new Error(`${data.message} (${res.status})`);

    return data;
  } catch (err) {
    throw err;
  }
}; */
