let db;
let openRequest;

let countyNames = ["Carlow", "Cavan", "Clare", "Cork", "Donegal", "Dublin", "Galway", "Kerry", "Kildare", "Kilkenny",
  "Laois", "Leitrim", "Limerick", "Longford", "Louth", "Mayo", "Meath", "Monaghan", "Offaly", "Roscommon", "Sligo",
  "Tipperary", "Waterford", "Westmeath", "Wexford", "Wicklow"];
// let countyDataNames = [], carlowData = [], cavanData = [], clareData = [], corkData = [], donegalData = [], dublinData = [],
//   galwayData = [], kerryData = [], kildareData = [], kilkennyData = [], laoisData = [], leitrimData = [], limerickData = [],
//   longfordData =[], louthData = [], mayoData = [], meathData = [], monaghanData = [], offalyData = [], roscommonData = [],
//   sligoData = [], tipperaryData = [], waterfordData = [], westmeathData = [], wexfordData = [], wicklowData = [];

let countyDataNames = [];
//generate arrays for all county dynamically use 'window'
for (let i = 0; i < countyNames.length; i++) {
  this[countyNames[i].toLowerCase() + 'Data'] = [];
  countyDataNames.push(countyNames[i].toLowerCase() + 'Data');
}
//console.log(countyDataNames);
var allCountyArray = [];

self.onmessage = function (event) {
  //console.log(event.data.selector);
  //console.log(event.data.data);


  switch (event.data.selector) {
    case "init": {
      openRequest = indexedDB.open("DATASET", 2);
      openRequest.onupgradeneeded = function (e) {
        console.log("Upgrading...");
        let thisDB = e.target.result;

        if (!thisDB.objectStoreNames.contains("All")) {
          thisDB.createObjectStore("All");
        }

        for (let i = 0; i < countyNames.length; i++) {

          if (!thisDB.objectStoreNames.contains(countyNames[i])) {
            thisDB.createObjectStore(countyNames[i]);
          }

        }
      }
      openRequest.onsuccess = function (e) {
        console.log("Success!");
        db = e.target.result;
        console.log(db);

        let allData = (event.data.data) ? JSON.parse(event.data.data) : [];
        //console.log(allData);

        add("All", allData);

        allData.forEach(obj => {
          switch (obj.s) {
            case "Carlow": {
              //add("Carlow", obj);
              carlowData.push(obj);
            }
              break;
            case "Cavan": {
              cavanData.push(obj);
            }
              break;
            case "Clare": {
              clareData.push(obj);
            }
              break;
            case "Cork": {
              corkData.push(obj);
            }
              break;
            case "Donegal": {
              donegalData.push(obj);
            }
              break;
            case "Dublin": {
              dublinData.push(obj);
            }
              break;
            case "Galway": {
              galwayData.push(obj);
            }
              break;
            case "Kerry": {
              kerryData.push(obj);
            }
              break;
            case "Kildare": {
              kildareData.push(obj);
            }
              break;
            case "Kilkenny": {
              kilkennyData.push(obj);
            }
              break;
            case "Laois": {
              laoisData.push(obj);
            }
              break;
            case "Leitrim": {
              leitrimData.push(obj);
            }
              break;
            case "Limerick": {
              limerickData.push(obj);
            }
              break;
            case "Longford": {
              longfordData.push(obj);
            }
              break;
            case "Louth": {
              louthData.push(obj);
            }
              break;
            case "Mayo": {
              mayoData.push(obj);
            }
              break;
            case "Meath": {
              meathData.push(obj);
            }
              break;
            case "Monaghan": {
              monaghanData.push(obj);
            }
              break;
            case "Offaly": {
              offalyData.push(obj);
            }
              break;
            case "Roscommon": {
              roscommonData.push(obj);
            }
              break;
            case "Sligo": {
              sligoData.push(obj);
            }
              break;
            case "Tipperary": {
              tipperaryData.push(obj);
            }
              break;
            case "Waterford": {
              waterfordData.push(obj);
            }
              break;
            case "Westmeath": {
              westmeathData.push(obj);
            }
              break;
            case "Wexford": {
              wexfordData.push(obj);
            }
              break;
            case "Wicklow": {
              wicklowData.push(obj);
            }
              break;
            default:
              break;
          }

        })

        allCountyArray.length = 0;


        allCountyArray.push(carlowData, cavanData, clareData, corkData, donegalData, dublinData, galwayData,
          kerryData, kildareData, kilkennyData, laoisData, leitrimData, limerickData, longfordData, louthData, mayoData,
          meathData, monaghanData, offalyData, roscommonData, sligoData, tipperaryData, waterfordData, westmeathData,
          wexfordData, wicklowData);

        console.log(allCountyArray);

        for (let i = 0; i < allCountyArray.length; i++) {
          add(countyNames[i], allCountyArray[i]);
        }

        function add(key, value) {
          //Assume db is a database variable opened earlier
          let transaction = db.transaction([key], "readwrite");
          let store = transaction.objectStore(key);
          let request = store.add(value, 1);

          request.onerror = function (e) {
            console.log("Error", e.target.error);
            //some type of error handler
          }

          request.onsuccess = function (e) {
            self.postMessage({job: "Databases generated...", status: "done"});
            //console.log(key + " database fulfilled");
          }

        }


      }
      openRequest.onerror = function (e) {
        console.log("Error");
        self.postMessage({job: "Databases generated...", status: "error"});
        console.dir(e);
      }
    }

      break;

    case "county": {
      if(event.data.data !== "None"){
        console.log("Request under process for " + event.data.data + " ...");
        readCountyData(event.data.data);
      }else{
        self.postMessage({job: "None", status:"None"});
      }

    }

      break;

    // case "choropleth": {
    //   console.log("Selector: " + event.data.selector);
    //   console.log("Year: " + event.data.year);
    //   console.log("Crime: " + event.data.crime);
    //
    //   if(event.data.year !== "None"){
    //     switch (event.data.crime) {
    //
    //     }
    //   }
    //   else{
    //
    //   }
    // }
    //   break;
    //
    // case "add": {
    //   add();
    // }
    //   break;
    default:
      break;
  }

  //console.log(corkData);
  //console.log(dublinData);


};


function readCountyData(countyName) {
  let transaction = db.transaction([countyName], "readonly");
  let store = transaction.objectStore(countyName);

  //x is some value
  let request = store.get(1);


  request.onsuccess = function (e) {
    console.log(request.result);
    self.postMessage({job: countyName, result:request.result});
  }

  // let objectStore = db.transaction("name").objectStore("name");
  // let users = [];
  //
  // objectStore.openCursor().onsuccess = function (event) {
  //   let cursor = event.target.result;
  //
  //   if (cursor) {
  //     users.push(cursor.value.name);
  //     cursor.continue();
  //   } else {
  //     self.postMessage("Every users: " + users.join(", "));
  //   }
  // };
}


