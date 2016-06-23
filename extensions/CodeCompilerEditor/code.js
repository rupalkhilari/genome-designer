// Sends the code to the server to compile
export const sendToCompile = (data) => {
  const payload = {
    'code': data,
  };

  const stringified = JSON.stringify(payload);

  // send a post request to the server and pring out the results in the console.
  return fetch('/compile/fsharp', {
    method: 'POST',
    headers: {
      'Content-type': 'application/json; charset=UTF-8'
    },
    body: stringified,
  })
  .then(resp => resp.json())
  .then(function(data) {
    console.log(data);
    console.log(data.result);
    return data.result;
  });
};
