var myHeaders = new Headers();
myHeaders.append("x-api-key", "");
myHeaders.append("Content-Type", "application/json");

var raw = JSON.stringify({
  "model": "Qubico/image-toolkit",
  "task_type": "face-swap",
  "input": {
    "target_image": "https://i.ibb.co/LnLYwhR/66f41e64b1922.jpg",
    "swap_image": "https://i.ibb.co/m9BFL9J/ad61a39afd9079e57a5908c0bd9dd995.jpg"
  }
});

var requestOptions = {
  method: 'POST',
  headers: myHeaders,
  body: raw,
  redirect: 'follow'
};

fetch("https://api.piapi.ai/api/v1/task", requestOptions)
  .then(response => response.text())
  .then(result => console.log(result))
  .catch(error => console.log('error', error));
