import Chart from 'chart.js/auto';
import { getRelativePosition } from 'chart.js/helpers';


//rajouter noscript tag ( le message ne s'affichera pas car JavaScript est désactivé)
function noscriptCode() {
    const noscript = `<noscript>
                    JavaScript is disabled 
                      </noscript>`;
}

// couleur aléatoire
function randomRGB() {
    return Math.floor(Math.random() * 256);
}

function getRandomColor() {
    return `rgb(${randomRGB()},${randomRGB()},${randomRGB()})`;
}

//---------------------------------------- Grapgique1 pour tableau 1 --------------------------------------------------

let table1 = document.getElementById("table1");

//je crée un canvas 

const crimesChartCanvas = '<canvas id="crimes-chart" width="800" height="700" class="graph"></canvas>';
table1.insertAdjacentHTML ('beforebegin', crimesChartCanvas);
let canvas1 = document.getElementById("crimes-chart");

// je sélectionne les éléments de tableau1, avec [] je les convertis en tableau javascript

const trElements = [...table1.querySelectorAll("tbody tr")]; 
console.log("trElements",trElements);

const trDatas = trElements.slice(1,trElements.length); //slice pour exclure la ligne1 (th)
console.log("trDatas",trDatas);

//"filter" parcourt le tableau et pour chaque élément, vérifie la valeur. Si vide, il est retiré. 
// "map" parcourt tous les éléments de labels[] et pour chaque élément, elle extrait la propriété "innerText"
const labelsData = [...trElements[0].querySelectorAll("th")].map(v => v.innerText).filter(v => v !== ""); 
console.log("labelsData",labelsData);


//chart 1 
const chartData1 = {
  labels : [],
  datasets : []
}

const config1 = {
  type: 'line',
  data: chartData1,
  options: {
    responsive: true
  }
};

chartData1.labels = labelsData;

trDatas.forEach(
  trData => {
  let tdElements = [...trData.querySelectorAll("td")].map(td => td.innerText);
  //avec "querySelectorAll" je sélectionne tous les éléments td enfants de trData.
  console.log("tdElements",tdElements);
  let color = getRandomColor(); // je génère une couleur pour chaq label

  chartData1.datasets.push({
    label: tdElements[0],
    data : tdElements.slice(1,tdElements.length).map(v => parseFloat(v)),
    fill: false,
    backgroundColor: color,
    borderColor: color,
    borderWidth: 1,
    tension : 0
})
});

let ctx1 = canvas1.getContext('2d');  //pour obtenir un contexte de dessin 2D
let crimesChart = new Chart(ctx1,config1)

//---------------------------------------- Grapgique2 pour tableau 2 --------------------------------------------------

let table2 = document.getElementById("table2");

//je crée un canvas 
const prisonChartCanvas = '<canvas id="prison-chart" width="800" height="700" class="graph"></canvas>';
table2.insertAdjacentHTML ('beforebegin', prisonChartCanvas);
let canvas2 = document.getElementById("prison-chart");

// elements du tableau
let countryColumn = [...table2.querySelectorAll("td")].filter(td => td.cellIndex === 1).map(td => td.innerText);
console.log("countryColumn",countryColumn);

let thirdColumn = [...table2.querySelectorAll("td")].filter(td => td.cellIndex === 2).map(td => td.innerText);
console.log(thirdColumn);

let fourthColumn = [...table2.querySelectorAll("td")].filter(td => td.cellIndex === 3).map(td => td.innerText);
console.log(fourthColumn );

let periode = [...table2.querySelectorAll("thead th")].map(th => th.innerText)
console.log("periode", periode);

// chart 2 
let ctx2 = canvas2.getContext('2d');  
let prisonChart = new Chart(ctx2, {
    type: 'bar',
    data: {
        labels: countryColumn,
        datasets: [{
            label: periode[2],
            data: thirdColumn,
            backgroundColor: "rgba(255, 0, 0, 0.4)",
            borderColor: "rgba(255, 0, 0, 1)",
            borderWidth: 1
        },
        {
            label: periode[3],
            data: fourthColumn,
            backgroundColor: "rgba(0, 255, 0, 0.4)" ,
            borderColor: "rgba(0, 255, 0, 1)",
            borderWidth: 1
        }]
    },
    options: {
        scales: {
            y: {
                beginAtZero: true
            }
        }
    }
});

//---------------------------------------- Grapgique3 API --------------------------------------------------

let firstHeading = document.getElementById("firstHeading");
let liveChartCanvas= '<canvas id="liveChartCanvas" width="800" height="500" class="graph"></canvas>'
firstHeading.insertAdjacentHTML ('afterend', liveChartCanvas);
let canvas3 = document.getElementById("liveChartCanvas");

let dataPoints = [];

// fetch pour récupérer les data

function getDatapoints(xStart, yStart, length) {
    // l'API cible nécessite ces 3 paramètres pour effectuer une requête pour récupérer les données.
    let url = `https://canvasjs.com/services/data/datapoints.php?xstart=${xStart}&ystart=${yStart}&length=${length}&type=json`;
    return fetch(url)
        .then(response => response.json())
        .catch(error => console.log(`Error: ${error}`));
}

// Créer le graphique
function liveDataChart() {
    let dataLive = {
        labels : [],
        datasets : [ { 
            label: "Live Chart", 
            data: [], 
            fill: false, 
            borderColor: getRandomColor() 
        } ]
    }

    const config3 = {
        type: 'line',
        data: dataLive,
        options: {
            responsive: true
        }
    };

    const ctx3 = canvas3.getContext("2d");
    let liveChart = new Chart(ctx3,config3);

    let xStart = 1;
    let yStart = 10;
    let length = 10;

    // mettre à jour le graphique
    function updateChart() {
        getDatapoints(xStart, yStart, length) //"getDatapoints" renvoie une promesse qui se résout en un tableau de points de données.
            .then(dataPoints => {
                dataPoints.forEach( value => {   // parcourt le tableau de points de données et pousse les valeurs dans le graphique en direct.
                    liveChart.data.labels.push(value[0]);
                    liveChart.data.datasets[0].data.push(value[1]);

                    xStart = liveChart.data.labels.length + 1; //xStart est mise à jour pour la longueur du tableau labels + 1
                    yStart = liveChart.data.datasets[0].data[liveChart.data.datasets[0].data.length - 1]; //yStart est mise à jour pour la dernière valeur du tableau data
                    length = 1; //length est réinitialisée à 1.
                });
                liveChart.update(); 
                setTimeout(() => updateChart(), 1000); 
            });
    }

    updateChart();
}

onload = liveDataChart;
