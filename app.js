alert("APP LOADED");

const csvUrl =
"https://docs.google.com/spreadsheets/d/e/2PACX-1vR1iFv4TIjSckPSECiJWeS3BF59LWaefQam-qr7j4LoswG0_9g2WzlePEVrBamMQqmN3_Hpoa1g-SQX/pub?gid=1488246594&single=true&output=csv";

fetch(csvUrl)
.then(response => response.text())
.then(csv => {

    console.log("CSV LOADED");

    const rows = csv.split("\n");

    console.log("ROWS:", rows.length);

    rows.slice(0,5).forEach((row,index)=>{
        console.log(index,row);
    });

})
.catch(error => {
    console.error("ERROR:", error);
});
