/* read JSON with  Ajax */
// let requestURL = './dataset/garda_stations.json';
// let request = new XMLHttpRequest();
// request.open('GET', requestURL);
// request.responseType = 'json';
// request.send();
// request.onload = function() {
//   const datas = request.response;
//   populateCounty(datas);
// }
// function populateCounty(jsonObj) {
//   let corkResults = resultByCounty(jsonObj, "Cork");
//   console.log(corkResults);
// }


/* ----------------------- Setup the page ------------------ */
window.addEventListener("load", init);
var webWorker;
var visualizationType = "None";
var county = "None";
var crimeType = "None";

var AOTTMAHARO_2010, AOTTMAHARO_2011, AOTTMAHARO_2012, AOTTMAHARO_2013, AOTTMAHARO_2014, AOTTMAHARO_2015;
var BARO_2010, BARO_2011, BARO_2012, BARO_2013, BARO_2014, BARO_2015;
var CDO_2010, CDO_2011, CDO_2012, CDO_2013, CDO_2014, CDO_2015;
var DTPATTE_2010, DTPATTE_2011, DTPATTE_2012, DTPATTE_2013, DTPATTE_2014, DTPATTE_2015;
var DONA_2010, DONA_2011, DONA_2012, DONA_2013, DONA_2014, DONA_2015;
var FDARO_2010, FDARO_2011, FDARO_2012, FDARO_2013, FDARO_2014, FDARO_2015;
var KARO_2010, KARO_2011, KARO_2012, KARO_2013, KARO_2014, KARO_2015;
var OAGJPAOOC_2010, OAGJPAOOC_2011, OAGJPAOOC_2012, OAGJPAOOC_2013, OAGJPAOOC_2014, OAGJPAOOC_2015;
var POAOSCO_2010, POAOSCO_2011, POAOSCO_2012, POAOSCO_2013, POAOSCO_2014, POAOSCO_2015;
var REAHO_2010, REAHO_2011, REAHO_2012, REAHO_2013, REAHO_2014, REAHO_2015;
var TARO_2010, TARO_2011, TARO_2012, TARO_2013, TARO_2014, TARO_2015;
var WAEO_2010, WAEO_2011, WAEO_2012, WAEO_2013, WAEO_2014, WAEO_2015;

var allArray = [];
var AOTTMAHARO_ResultArray = [];
var BARO_ResultArray = [];
var CDO_ResultArray = [];
var DTPATTE_ResultArray = [];
var DONA_ResultArray = [];
var FDARO_ResultArray = [];
var KARO_ResultArray = [];
var OAGJPAOOC_ResultArray = [];
var POAOSCO_ResultArray = [];
var REAHO_ResultArray = [];
var TARO_ResultArray = [];
var WAEO_ResultArray = [];

var yearArray = ['2010', '2011', '2012', '2013', '2014', '2015'];

const allArrayNames = ["AOTTMAHARO_2010", "AOTTMAHARO_2011", "AOTTMAHARO_2012", "AOTTMAHARO_2013", "AOTTMAHARO_2014",
  "AOTTMAHARO_2015", "BARO_2010", "BARO_2011", "BARO_2012", "BARO_2013", "BARO_2014", "BARO_2015", "CDO_2010",
  "CDO_2011", "CDO_2012", "CDO_2013", "CDO_2014", "CDO_2015", "DTPATTE_2010", "DTPATTE_2011", "DTPATTE_2012",
  "DTPATTE_2013", "DTPATTE_2014", "DTPATTE_2015", "DONA_2010", "DONA_2011", "DONA_2012", "DONA_2013", "DONA_2014",
  "DONA_2015", "FDARO_2010", "FDARO_2011", "FDARO_2012", "FDARO_2013", "FDARO_2014", "FDARO_2015", "KARO_2010",
  "KARO_2011", "KARO_2012", "KARO_2013", "KARO_2014", "KARO_2015", "OAGJPAOOC_2010", "OAGJPAOOC_2011",
  "OAGJPAOOC_2012", "OAGJPAOOC_2013", "OAGJPAOOC_2014", "OAGJPAOOC_2015", "POAOSCO_2010", "POAOSCO_2011",
  "POAOSCO_2012", "POAOSCO_2013", "POAOSCO_2014", "POAOSCO_2015", "REAHO_2010", "REAHO_2011", "REAHO_2012",
  "REAHO_2013", "REAHO_2014", "REAHO_2015", "TARO_2010", "TARO_2011", "TARO_2012", "TARO_2013", "TARO_2014",
  "TARO_2015", "WAEO_2010", "WAEO_2011", "WAEO_2012", "WAEO_2013", "WAEO_2014", "WAEO_2015"];

function init() {

  //prefixes for indexedDB
  window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB ||
    window.msIndexedDB;

  window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction ||
    window.msIDBTransaction;
  window.IDBKeyRange = window.IDBKeyRange ||
    window.webkitIDBKeyRange || window.msIDBKeyRange;

  //check indexedDB
  if (!window.indexedDB) {
    console.log("Your browser doesn't support a stable version of IndexedDB. Such and such feature will not be available.");
  } else {
    console.log("Your browser does support a stable version of IndexedDB.");
  }

  //check WebWorker
  if (!window.Worker) {
    console.log("Your browser doesn't support WebWorkers");
  } else {
    console.log("Your browser does support WebWorkers");
  }

  //removeEverythingFromLocalStorage();

  startWorker();

  document.getElementById("visualizationType").disabled = true;
  document.getElementById("countySelector").disabled = true;
  document.getElementById("crimeSelector").disabled = true;

  /*  Read JSON file with D3 into the LocalStorage */
  console.log(" --- JSON read by D3 --- ");
  d3.json('dataset/garda_stations.json').then(function (data) {
    addItemToIndexedDBBYWebWorker("dataSet", JSON.stringify(data));
  }).then(function () {
    //when database is ready we allow to use the page elements
    document.getElementById("visualizationType").disabled = false;
    document.getElementsByTagName('visualizationType').selectedIndex = "0";

  });

}

//Opening and make the Database from the main data
function addItemToIndexedDBBYWebWorker(dataSet, data) {
  webWorker.postMessage({selector: "init", data: data});

  webWorker.onmessage = function (event) {
    //document.getElementById("result").innerHTML = event.data.job + event.data.status;
  };
}

function startWorker() {
  if (typeof (webWorker) == "undefined") {
    webWorker = new Worker("./js/web_worker.js");
  }
}

function stopWorker() {
  webWorker.terminate();
  webWorker = undefined;
}

//VISUALIZATION TYPE SELECTOR ONCHANGE
function selectVisualization(visualization) {

  //get the selected visualization type
  visualizationType = visualization.options[visualization.selectedIndex].text;
  console.log("Visualization type selected: " + visualizationType);
  county = "None";
  crimeType = "None";

  //recolor all the county to the basic color on the map
  d3.select('.republic').selectAll('path').style('fill', 'rgb(199,233,192)');
  //set all selector to the first 'none' option
  document.getElementById("countySelector").selectedIndex = "0";
  document.getElementById("crimeSelector").selectedIndex = "0";

  //hide all review div
  hideReviews();
  //display the currently selected visualization type review
  displayReview();
  //clear earlier results from the 'resultDiv'
  clearResultArea();

  //if visualization type is not 'None'
  if (visualizationType !== "None") {
    //set country selector to able
    document.getElementById("countySelector").disabled = false;
    document.getElementById("crimeSelector").disabled = true;
  }
  //if visualization type is 'None'
  else {
    //disable the country and crime selector
    document.getElementById("countySelector").disabled = true;
    document.getElementById("crimeSelector").disabled = true;
    //recolor all the county to the basic color on the map
    d3.select('.republic').selectAll('path').style('fill', 'rgb(199,233,192)');
    //clear earlier results from the 'resultDiv'
    clearResultArea();
  }
}

//COUNTY SELECTOR ONCHANGE
function selectCounty(countyName) {
  //get the selected county
  county = countyName.options[countyName.selectedIndex].text;
  console.log("County selected: " + county);
  //first recolor all the county to the basic color on the map
  d3.select('.republic').selectAll('path').style('fill', 'rgb(199,233,192)');
  // //set the crime selector to the first 'None'
  document.getElementById("crimeSelector").selectedIndex = "0";
  //if selected county is not 'None'
  if (county !== 'None') {
    //when'All' selected then coloring all the county on the map
    if (county === "All") {
      d3.select('.republic').selectAll('path').style('fill', 'rgba(198, 45, 205, 0.8)');
    }
    //coloring the selected county on the map
    else {
      d3.select("#" + county + " path").style("fill", "rgba(198, 45, 205, 0.8)");
    }
    //console.log("Ask for " + county + " data ...");
    //send request to the web worker for the selected county data
    webWorker.postMessage({selector: "county", data: county});
    //web worker response with the data for the selected county
    webWorker.onmessage = function (event) {
      //populate all the data for the selected county in the summarising function
      summarising(event.data.result);
      //set crime selector to able
      document.getElementById("crimeSelector").disabled = false;
      hideReviews();
      clearResultArea();
    };
  }
  //if selected county is 'None'
  else {
    //disable the crime selector
    document.getElementById("crimeSelector").disabled = true;
    //clear earlier results from the 'resultDiv'
    clearResultArea();
    hideReviews();
  }
}

//CRIME SELECTOR ONCHANGE
function selectCrime(crime) {
  crimeType = crime.options[crime.selectedIndex].text;
  console.log("Crime selected: " + crimeType);

  clearResultArea();
  //if selected crime is not 'None'
  if (crimeType !== 'None') {
    visualizationSelector();
  }
}

function summarising(data) {
  allArray.length = 0;
  allArray.push(AOTTMAHARO_2010, AOTTMAHARO_2011, AOTTMAHARO_2012, AOTTMAHARO_2013, AOTTMAHARO_2014, AOTTMAHARO_2015,
    BARO_2010, BARO_2011, BARO_2012, BARO_2013, BARO_2014, BARO_2015,
    CDO_2010, CDO_2011, CDO_2012, CDO_2013, CDO_2014, CDO_2015,
    DTPATTE_2010, DTPATTE_2011, DTPATTE_2012, DTPATTE_2013, DTPATTE_2014, DTPATTE_2015,
    DONA_2010, DONA_2011, DONA_2012, DONA_2013, DONA_2014, DONA_2015,
    FDARO_2010, FDARO_2011, FDARO_2012, FDARO_2013, FDARO_2014, FDARO_2015,
    KARO_2010, KARO_2011, KARO_2012, KARO_2013, KARO_2014, KARO_2015,
    OAGJPAOOC_2010, OAGJPAOOC_2011, OAGJPAOOC_2012, OAGJPAOOC_2013, OAGJPAOOC_2014, OAGJPAOOC_2015,
    POAOSCO_2010, POAOSCO_2011, POAOSCO_2012, POAOSCO_2013, POAOSCO_2014, POAOSCO_2015,
    REAHO_2010, REAHO_2011, REAHO_2012, REAHO_2013, REAHO_2014, REAHO_2015,
    TARO_2010, TARO_2011, TARO_2012, TARO_2013, TARO_2014, TARO_2015,
    WAEO_2010, WAEO_2011, WAEO_2012, WAEO_2013, WAEO_2014, WAEO_2015);

  for (let i = 0; i < allArray.length; i++) {
    allArray[i] = 0;
  }
  for (let i = 0; i < (data.length); i++) {
    let obj = data[i];
    for (let j = 0; j < allArray.length; j++) {
      allArray[j] = allArray[j] + obj[`${allArrayNames[j]}`];
    }
  }
  //print result to console
  for (let i = 0; i < allArray.length; i++) {
    console.log(allArrayNames[i] + " : " + allArray[i])
  }

  //set all arrays below to 'empty'
  AOTTMAHARO_ResultArray.length = 0;
  BARO_ResultArray.length = 0;
  CDO_ResultArray.length = 0;
  DTPATTE_ResultArray.length = 0;
  DONA_ResultArray.length = 0;
  FDARO_ResultArray.length = 0;
  KARO_ResultArray.length = 0;
  OAGJPAOOC_ResultArray.length = 0;
  POAOSCO_ResultArray.length = 0;
  REAHO_ResultArray.length = 0;
  TARO_ResultArray.length = 0;
  WAEO_ResultArray.length = 0;

  //populate the arrays above by data from 'allArray'
  for (let i = 0; i < allArray.length; i++) {
    if (i >= 0 && i <= 5) {
      AOTTMAHARO_ResultArray.push(allArray[i]);
    } else if (i >= 6 && i <= 11) {
      BARO_ResultArray.push(allArray[i]);
    } else if (i >= 12 && i <= 17) {
      CDO_ResultArray.push(allArray[i]);
    } else if (i >= 18 && i <= 23) {
      DTPATTE_ResultArray.push(allArray[i]);
    } else if (i >= 24 && i <= 29) {
      DONA_ResultArray.push(allArray[i]);
    } else if (i >= 30 && i <= 35) {
      FDARO_ResultArray.push(allArray[i]);
    } else if (i >= 36 && i <= 41) {
      KARO_ResultArray.push(allArray[i]);
    } else if (i >= 42 && i <= 47) {
      OAGJPAOOC_ResultArray.push(allArray[i]);
    } else if (i >= 48 && i <= 53) {
      POAOSCO_ResultArray.push(allArray[i]);
    } else if (i >= 54 && i <= 59) {
      REAHO_ResultArray.push(allArray[i]);
    } else if (i >= 60 && i <= 65) {
      TARO_ResultArray.push(allArray[i]);
    } else {
      WAEO_ResultArray.push(allArray[i]);
    }
  }
  // console.log(AOTTMAHARO_ResultArray);
  // console.log(WAEO_ResultArray);
}


function visualizationSelector() {
  console.log('visualizationSelector called');
  switch (visualizationType) {
    case "Bar Chart": {
      switch (crimeType) {
        case "Attempts or threats to murder, assaults, harassments and related offences": {
          barChart(AOTTMAHARO_ResultArray);
        }
          break;
        case "Burglary and related offences": {
          barChart(BARO_ResultArray);
        }
          break;
        case "Controlled drug offences": {
          barChart(CDO_ResultArray);
        }
          break;
        case "Damage to property and to the environment": {
          barChart(DTPATTE_ResultArray);
        }
          break;
        case "Dangerous or negligent acts": {
          barChart(DONA_ResultArray);
        }
          break;
        case "Fraud, deception and related offences": {
          barChart(FDARO_ResultArray);
        }
          break;
        case "Kidnapping and related offences": {
          barChart(KARO_ResultArray);
        }
          break;
        case "Offences against government, justice procedures and organisation of crime": {
          barChart(OAGJPAOOC_ResultArray);
        }
          break;
        case "Public order and other social code offences": {
          barChart(POAOSCO_ResultArray);
        }
          break;
        case "Robbery, extortion and hijacking offences": {
          barChart(REAHO_ResultArray);
        }
          break;
        case "Theft and related offences": {
          barChart(TARO_ResultArray);
        }
          break;
        case "Weapons and Explosives Offences": {
          barChart(WAEO_ResultArray);
        }
          break;
        default:
          break;
      }
    }
      break;

    case "Tree Map": {
      switch (crimeType) {
        case "Attempts or threats to murder, assaults, harassments and related offences": {
          treeMap(AOTTMAHARO_ResultArray);
        }
          break;
        case "Burglary and related offences": {
          treeMap(BARO_ResultArray);
        }
          break;
        case "Controlled drug offences": {
          treeMap(CDO_ResultArray);
        }
          break;
        case "Damage to property and to the environment": {
          treeMap(DTPATTE_ResultArray);
        }
          break;
        case "Dangerous or negligent acts": {
          treeMap(DONA_ResultArray);
        }
          break;
        case "Fraud, deception and related offences": {
          treeMap(FDARO_ResultArray);
        }
          break;
        case "Kidnapping and related offences": {
          treeMap(KARO_ResultArray);
        }
          break;
        case "Offences against government, justice procedures and organisation of crime": {
          treeMap(OAGJPAOOC_ResultArray);
        }
          break;
        case "Public order and other social code offences": {
          treeMap(POAOSCO_ResultArray);
        }
          break;
        case "Robbery, extortion and hijacking offences": {
          treeMap(REAHO_ResultArray);
        }
          break;
        case "Theft and related offences": {
          treeMap(TARO_ResultArray);
        }
          break;
        case "Weapons and Explosives Offences": {
          treeMap(WAEO_ResultArray);
        }
          break;
        default:
          break;
      }
    }
      break;

    case "Data Table": {
      switch (crimeType) {
        case "Attempts or threats to murder, assaults, harassments and related offences": {
          dataTable(changeArrays(yearArray, AOTTMAHARO_ResultArray));
        }
          break;
        case "Burglary and related offences": {
          dataTable(changeArrays(yearArray, BARO_ResultArray));
        }
          break;
        case "Controlled drug offences": {
          dataTable(changeArrays(yearArray, CDO_ResultArray));
        }
          break;
        case "Damage to property and to the environment": {
          dataTable(changeArrays(yearArray, DTPATTE_ResultArray));
        }
          break;
        case "Dangerous or negligent acts": {
          dataTable(changeArrays(yearArray, DONA_ResultArray));
        }
          break;
        case "Fraud, deception and related offences": {
          dataTable(changeArrays(yearArray, FDARO_ResultArray));
        }
          break;
        case "Kidnapping and related offences": {
          dataTable(changeArrays(yearArray, KARO_ResultArray));
        }
          break;
        case "Offences against government, justice procedures and organisation of crime": {
          dataTable(changeArrays(yearArray, OAGJPAOOC_ResultArray));
        }
          break;
        case "Public order and other social code offences": {
          dataTable(changeArrays(yearArray, POAOSCO_ResultArray));
        }
          break;
        case "Robbery, extortion and hijacking offences": {
          dataTable(changeArrays(yearArray, REAHO_ResultArray));
        }
          break;
        case "Theft and related offences": {
          dataTable(changeArrays(yearArray, TARO_ResultArray));
        }
          break;
        case "Weapons and Explosives Offences": {
          dataTable(changeArrays(yearArray, WAEO_ResultArray));
        }
          break;
        default:
          break;
      }

    }
      break;

    case "Line Chart": {
      switch (crimeType) {
        case "Attempts or threats to murder, assaults, harassments and related offences": {
          lineChart(mergeArraysToObjectKeyandValuePair(yearArray, AOTTMAHARO_ResultArray));
        }
          break;
        case "Burglary and related offences": {
          lineChart(mergeArraysToObjectKeyandValuePair(yearArray, BARO_ResultArray));
        }
          break;
        case "Controlled drug offences": {
          lineChart(mergeArraysToObjectKeyandValuePair(yearArray, CDO_ResultArray));
        }
          break;
        case "Damage to property and to the environment": {
          lineChart(mergeArraysToObjectKeyandValuePair(yearArray, DTPATTE_ResultArray));
        }
          break;
        case "Dangerous or negligent acts": {
          lineChart(mergeArraysToObjectKeyandValuePair(yearArray, DONA_ResultArray));
        }
          break;
        case "Fraud, deception and related offences": {
          lineChart(mergeArraysToObjectKeyandValuePair(yearArray, FDARO_ResultArray));
        }
          break;
        case "Kidnapping and related offences": {
          lineChart(mergeArraysToObjectKeyandValuePair(yearArray, KARO_ResultArray));
        }
          break;
        case "Offences against government, justice procedures and organisation of crime": {
          lineChart(mergeArraysToObjectKeyandValuePair(yearArray, OAGJPAOOC_ResultArray));
        }
          break;
        case "Public order and other social code offences": {
          lineChart(mergeArraysToObjectKeyandValuePair(yearArray, POAOSCO_ResultArray));
        }
          break;
        case "Robbery, extortion and hijacking offences": {
          lineChart(mergeArraysToObjectKeyandValuePair(yearArray, REAHO_ResultArray));
        }
          break;
        case "Theft and related offences": {
          lineChart(mergeArraysToObjectKeyandValuePair(yearArray, TARO_ResultArray));
        }
          break;
        case "Weapons and Explosives Offences": {
          lineChart(mergeArraysToObjectKeyandValuePair(yearArray, WAEO_ResultArray));
        }
          break;
        default:
          break;
      }
    }
      break;

    case "Pie Chart": {
      switch (crimeType) {
        case "Attempts or threats to murder, assaults, harassments and related offences": {
          pieChart(mergeArraysToObjectKeyandValuePair(yearArray, AOTTMAHARO_ResultArray));
        }
          break;
        case "Burglary and related offences": {
          pieChart(mergeArraysToObjectKeyandValuePair(yearArray, BARO_ResultArray));
        }
          break;
        case "Controlled drug offences": {
          pieChart(mergeArraysToObjectKeyandValuePair(yearArray, CDO_ResultArray));
        }
          break;
        case "Damage to property and to the environment": {
          pieChart(mergeArraysToObjectKeyandValuePair(yearArray, DTPATTE_ResultArray));
        }
          break;
        case "Dangerous or negligent acts": {
          pieChart(mergeArraysToObjectKeyandValuePair(yearArray, DONA_ResultArray));
        }
          break;
        case "Fraud, deception and related offences": {
          pieChart(mergeArraysToObjectKeyandValuePair(yearArray, FDARO_ResultArray));
        }
          break;
        case "Kidnapping and related offences": {
          pieChart(mergeArraysToObjectKeyandValuePair(yearArray, KARO_ResultArray));
        }
          break;
        case "Offences against government, justice procedures and organisation of crime": {
          pieChart(mergeArraysToObjectKeyandValuePair(yearArray, OAGJPAOOC_ResultArray));
        }
          break;
        case "Public order and other social code offences": {
          pieChart(mergeArraysToObjectKeyandValuePair(yearArray, POAOSCO_ResultArray));
        }
          break;
        case "Robbery, extortion and hijacking offences": {
          pieChart(mergeArraysToObjectKeyandValuePair(yearArray, REAHO_ResultArray));
        }
          break;
        case "Theft and related offences": {
          pieChart(mergeArraysToObjectKeyandValuePair(yearArray, TARO_ResultArray));
        }
          break;
        case "Weapons and Explosives Offences": {
          pieChart(mergeArraysToObjectKeyandValuePair(yearArray, WAEO_ResultArray));
        }
          break;
        default:
          break;
      }
    }
      break;

    default: {
    }
      break;

  }


}

function clearResultArea() {
  let resultArea = document.getElementById("resultDiv");
  if (resultArea.hasChildNodes()) {
    //remove all the childNodes
    while (resultArea.hasChildNodes()) {
      resultArea.removeChild(resultArea.firstChild);
    }
  }
}

function displayReview(){
  switch (visualizationType) {
    case "None":
      document.getElementById("idvReview").style.display = "block";
      break;
    case "Data Table":
      document.getElementById("dataTableReview").style.display = "block";
      break;
    case "Tree Map":
      document.getElementById("treeMapReview").style.display = "block";
      break;
    case "Line Chart":
      document.getElementById("lineChartReview").style.display = "block";
      break;
    case "Pie Chart":
      document.getElementById("pieChartReview").style.display = "block";
      break;
    case "Bar Chart":
      document.getElementById("barChartReview").style.display = "block";
      break;
  }
}

function hideReviews(){
  let elements = document.getElementsByClassName("reviewAreas");
  //console.log("Hide these: " + elements);
  for (let i = 0; i < elements.length; i++) {
    elements[i].style.display = "none";
  }

}

function changeArrays(arr1, arr2) {
  let a = [...arr1];
  a.splice(0, 0, 'Year :');
  let b = [...arr2];
  b.splice(0, 0, 'Cases:');
  return [a, b];
}

function mergeArraysToObjectKeyandValuePair(arr1, arr2) {
  let result = arr2.reduce(function (result, field, index) {
    result[arr1[index]] = field;
    return result;
  }, {})
  console.log(result);
  return result;

}

function barChart(data) {

  console.log(data);

  let margin = {top: 30, right: 50, bottom: 30, left: 50};

  let height = 350 - margin.top - margin.bottom;
  let width = 400 - margin.left - margin.right;

  let dynamicColor;

  let yScale = d3.scaleLinear().domain([0, d3.max(data)]).range([0, height]);
  let xScale = d3.scaleBand().domain(d3.range(0, data.length)).range([0, width]);

  let colors = d3.scaleLinear().domain([0, data.length * .2, data.length * .4, data.length * .6, data.length * .8, data.length])
    .range(['#7da6ff', '#6293fc', '#437efa', '#286dfc', '#0a5aff', '#0442c2']);

  let svg = d3.select('#resultDiv').append('svg')
    .attr('id', 'barChart_svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .style('background', '#bce8f1')

  svg.append("text")
    .attr("transform", "translate(100,0)")
    .attr("x", -70)
    .attr("y", 15)
    .attr("font-size", "12px")
    .attr("text-decoration", "underline")
    .text(crimeType)

  let group = svg.append('g')
    .attr('class', 'bar_g')
    .attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')')
    .selectAll('rect')
    .data(data)
    .enter();

  let bar = group
    .append('rect')
    .attr("class", "bar")
    .styles({
      'fill': function (d, i) {
        return colors(i);
      },
      'stroke': '#1a1d6e',
      'stroke-width': '2'
    })
    .attr('width', xScale.bandwidth())
    .attr('x', function (d, i) {
      return xScale(i);
    })
    .attr('height', 0)
    .attr('y', height);

  //Add the SVG Text Element to the svgContainer
  let text = bar.select("text")
    .data(data)
    .enter()
    .append("text");

  //Add SVG Text Element Attributes
  let textLabels = text
    .attr('x', function (d, i) {
      return xScale(i) + 10;
    })
    .attr('y', height - 15)
    .text(function (d, i) {
      return data[i];
    })
    .attr("font-family", "sans-serif")
    .attr("font-size", "13px")
    .attr("fill", "#bce8f1");

  bar.transition()
    .attr('height', function (d) {
      return yScale(d);
    })
    .attr('y', function (d) {
      return height - yScale(d);
    })
    .delay(function (d, i) {
      return i * 350;
    })
    .duration(3000)
    .ease(d3.easeElastic);

  bar.on("mouseover", onMouseOver)
  bar.on("mouseout", onMouseOut)

  function onMouseOver(d, i) {
    dynamicColor = this.style.fill;
    d3.select(this)
      .style('fill', '#3c763d');
  }

  function onMouseOut(d, i) {
    d3.select(this)
      .style('fill', dynamicColor);
  }


  let verticalGuideScale = d3.scaleLinear()
    .domain([0, d3.max(data)])
    .range([height, 0]);

  let vAxis = d3.axisLeft(verticalGuideScale)
    .ticks(15);

  let verticalGuide = d3.select('#barChart_svg').append('g').attr('class', 'vert_g');

  vAxis(verticalGuide);

  verticalGuide.attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')');
  verticalGuide.selectAll('path')
    .styles({
      fill: 'none',
      stroke: "#3c763d"
    });
  verticalGuide.selectAll('line')
    .styles({
      stroke: "#3c763d"
    });


  let hAxis = d3.axisBottom(xScale).tickFormat(x => `201${x.toFixed(data.size)}`);
  let horizontalGuide = d3.select('#barChart_svg').append('g');
  hAxis(horizontalGuide);
  horizontalGuide.attr('transform', 'translate(' + margin.left + ', ' + (height + margin.top) + ')');

  horizontalGuide.selectAll('path')
    .styles({
      fill: 'none',
      stroke: "#3c763d"
    });

  horizontalGuide.selectAll('line')
    .styles({
      stroke: "#3c763d"
    });

  /*
  References:
    https://www.tutorialsteacher.com/d3js/animated-bar-chart-d3
    https://vegibit.com/create-a-bar-chart-with-d3-javascript/
  */
}

function dataTable(data) {

  console.log(data);
  // set up the table
  var table = d3.select("#resultDiv").append("table").attr('id', 'tableMain');
  var tbody = table.append("tbody");

  // first create the table rows (3 needed)

  var tr = tbody.selectAll("tr")
    .data(data.filter(function (d, i) {
      if (i >= 0) {
        return d;
      }
    }))
    .enter()
    .append("tr");

  // Now create the table cells

  var td = tr.selectAll("td")
    .data(function (d) {
      return d;
    })
    .enter()
    .append("td")
    .text(function (d) {
      return d;
    });

}

function lineChart(input) {
  console.log("lineChart called");
  console.log(input);

  // set the dimensions and margins of the graph
  let margin = {top: 30, right: 50, bottom: 30, left: 50};

  let height = 400 - margin.top - margin.bottom;
  let width = 400 - margin.left - margin.right;

  // append the svg object to the body of the page
  var svg = d3.select("#resultDiv")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .style('background', '#bce8f1')
    .append("g")
    .attr("transform",
      "translate(" + margin.left + "," + margin.top + ")");

  let message = svg.append('text').attr("transform", "translate(100,0)").attr("x", -90).attr("y", 0).attr("font-size", "10px").attr("text-decoration", "underline").text(crimeType);

  let data = Object.keys(input).map(function (d) {
    //return {year: parseInt(d), value: input[d]};
    return {year: d3.timeParse("%Y-%m-%d")(d + "-01-01"), value: input[d]}
  });
  console.log(data);

  var x = d3.scaleTime()
    .domain(d3.extent(data, function (d) {
      return d.year;
    }))
    .range([0, width]).nice();
  // let x = d3.scaleBand().domain(d3.extent(data, function(d) { return d.year; })).range([0, width]);

  // var x = d3.scaleLinear()
  //   .domain([0, d3.max(data, function(d) { return d.year; })])
  //   .range([ 0, width ]).nice();


  svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x));

  // Add Y axis
  var y = d3.scaleLinear()
    .domain([0, d3.max(data, function (d) {
      return d.value * 1.5;
    })])
    .range([height, 0]);
  svg.append("g")
    .call(d3.axisLeft(y));

  // Max value observed:
  const max = d3.max(data, function (d) {
    return d.value;
  })

  // Set the gradient
  svg.append("linearGradient")
    .attr("id", "line-gradient")
    .attr("gradientUnits", "userSpaceOnUse")
    .attr("x1", 0)
    .attr("y1", y(0))
    .attr("x2", 0)
    .attr("y2", y(max / 2))
    .selectAll("stop")
    .data([
      {offset: "0%", color: "blue"},
      {offset: "100%", color: "red"}
    ])
    .enter().append("stop")
    .attr("offset", function (d) {
      return d.offset;
    })
    .attr("stop-color", function (d) {
      return d.color;
    });

  // Add the line
  svg.append("path")
    .datum(data)
    .attr("fill", "none")
    .attr("stroke", "url(#line-gradient)")
    .attr("stroke-width", 2)
    .attr("d", d3.line().x(function (d) {
        return x(d.year)
      }).y(function (d) {
        return y(d.value)
      })
    )

  // Add the points
  svg
    .append("g")
    .selectAll("dot")
    .data(data)
    .enter()
    .append("circle")
    .attr("cx", function (d) {
      return x(d.year)
    })
    .attr("cy", function (d) {
      return y(d.value)
    })
    .attr("r", 8)
    .attr("fill", "#69b3a2")
    .style("stroke", "black")
    .append('title').text(function (d) {
    return d.value;
  });


//    Reference: https://www.d3-graph-gallery.com/graph/line_basic.html
//                https://www.d3-graph-gallery.com/graph/line_select.html
}

function pieChart(input) {
  console.log(input);

  let margin = {top: 30, right: 20, bottom: 30, left: 20};

  let height = 450 - margin.top - margin.bottom;
  let width = 450 - margin.left - margin.right;

  let svg = d3.select('#resultDiv')
    .append('svg').attr('id', 'pieChart_svg')
    .attr('width', width)
    .attr('height', height)
    .style('background', '#bce8f1');

  let radius = Math.min(width - 40, height - 60) / 2;
  let message = svg.append('text').attr("transform", "translate(100,0)").attr("x", -90).attr("y", 15).attr("font-size", "10px").attr("text-decoration", "underline").text(crimeType);
  let g = svg.append("g").attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

  let color = d3.scaleOrdinal(['#47ACB1', '#F26522', '#004853', '#CDAB05', '#0a5aff', '#4D4D4F']);

  let pie = d3.pie()
    .sort(null)
    .value(function (d) {
      return d.value;
    });

  let path = d3.arc()
    .outerRadius(radius)
    .innerRadius(0);

  let label = d3.arc()
    .outerRadius(radius - 20)
    .innerRadius(radius - 20);

  let labelTwo = d3.arc()
    .outerRadius(radius - 90)
    .innerRadius(radius - 90);

  let data = Object.keys(input).map(function (d) {
    return {name: d, value: input[d]};
  });

  let arc = g.selectAll(".arc")
    .data(pie(data))
    .enter().append("g")
    .attr("class", "arc");

  arc.append("path")
    .attr("d", path)
    .attr("fill", function (d) {
      return color(d.data.name);
    })
    .append('title').text(function (d) {
    if (d.data.value !== 0) {
      return d.data.value + " cases in " + d.data.name;
    }
  });

  arc.append("text")
    .attr("transform", function (d) {
      return "translate(" + label.centroid(d) + ")";
    })
    .attr("dy", "0.35em")
    .attr('font-size', '15px')
    .attr('font-family', 'sans-serif')
    .attr('text-anchor', 'middle')
    .attr('font-weight', 'bold')
    .text(function (d) {
      if (d.data.value !== 0) {
        return d.data.name;
      }

    });

  arc.append("text")
    .attr("transform", function (d) {
      return "translate(" + labelTwo.centroid(d) + ")";
    })
    .attr("dy", "0.35em")
    .attr("font-family", "sans-serif")
    .attr("font-size", "12px")
    .attr('font-weight', 'bold')
    .attr("fill", "#bce8f1")
    .attr('text-anchor', 'middle')
    .text(function (d) {
      if (d.data.value !== 0) {
        return d.data.value;
      }

    });

  //https://stackoverflow.com/questions/52432414/confusion-on-how-to-generate-the-pie-chart-from-the-data-i-have-in-d3
}

function treeMap(input) {
  console.log(input);

  let margin = {top: 30, right: 50, bottom: 30, left: 50};

  let height = 400 - margin.top - margin.bottom;
  let width = 400 - margin.left - margin.right;


  let svg = d3.select('#resultDiv').append('svg')
    .attr('id', 'treeMap_svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .style('background', '#bce8f1')

  let data = Object.keys(input).map(function (d) {
    return {name: yearArray[d], parent: "year", value: input[d]};
  });

  let add_object = {name: "year", parent: "", value: ""};
  data.splice(0, 0, add_object);


  // stratify the array of object data: reformatting for d3.js
  var root = d3.stratify()
    .id(function (d) {
      return d.name;
    })
    .parentId(function (d) {
      return d.parent;
    })
    (data);
  root.sum(function (d) {
    return +d.value
  })

  d3.treemap()
    .size([width, height])
    .padding(5)
    (root)

  console.log(root.leaves())
  // use this information to add rectangles:
  svg
    .selectAll("rect")
    .data(root.leaves())
    .enter()
    .append("rect")
    .attr('x', function (d) {
      return d.x0;
    })
    .attr('y', function (d) {
      return d.y0 +30;
    })
    .attr('width', function (d) {
      return d.x1 - d.x0;
    })
    .attr('height', function (d) {
      return d.y1 - d.y0;
    })
    .style("stroke", "black")

    .style("fill", "#3d5de5");

  // and to add the text labels
  svg.selectAll("text")
    .data(root.leaves())
    .enter()
    .append("text")
    .attr("font-size", "10px")
    .attr("x", function (d) {
      return d.x0 + 5
    })    // +10 to adjust position (more right)
    .attr("y", function (d) {
      return d.y0 + 40
    })    // +20 to adjust position (lower)
    .text(function (d) {
      if (d.data.value !== 0) {
        return d.data.name + " - ("+ d.data.value+")";
      }
    })
    .attr("fill", "white")




//Reference: https://www.d3-graph-gallery.com/graph/treemap_basic.html

}
