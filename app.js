const csvUrl =
"https://docs.google.com/spreadsheets/d/e/2PACX-1vR1iFv4TIjSckPSECiJWeS3BF59LWaefQam-qr7j4LoswG0_9g2WzlePEVrBamMQqmN3_Hpoa1g-SQX/pub?gid=1488246594&single=true&output=csv";

fetch(csvUrl)
  .then(response => response.text())
  .then(data => {
      console.log("CSV Loaded");
      console.log(data.substring(0,500));
  })
  .catch(error => console.error(error));
