var app = require("express")();
var http = require("http").createServer(app);
var io = require("socket.io")(http);
const bodyParser = require("body-parser");
const cors = require("cors");

app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json());
app.use(cors());


var stations = [];
var stations_ID = [];
var tempNull = { tempC: "", humi: "", uSv: "", cps: "", counts: "" };

//Connection MongoDB database
const MongoClient = require('mongodb').MongoClient;
const urlStation =
    "mongodb+srv://vutrantienbao290699:vutrantienbao99@project.murnk.mongodb.net/ESP?retryWrites=true&w=majority";
const client = new MongoClient(urlStation,{useNewUrlParser: true,
   useUnifiedTopology: true});

client.connect();


const PORT = 3484;
http.listen(process.env.PORT || PORT, console.log("server running ", PORT));

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/IOT_Server.html");
});




io.on("connection", (socket) => {
    console.log("a user connected, id: ", socket.id);
    io.emit("stations", stations);
    const db = client.db("ESP")
  
    socket.on("disconnect", () => {
        if (stations_ID.includes(socket.id)) {
            stations_ID = stations_ID.filter((element) => element !== socket.id);
            stations = stations.filter((station) => station.id !== socket.id);
            io.to(socket.id).emit("temp2web", tempNull);
            io.emit("temptoapp", `${'disconnected'}`);
            io.emit("tempto5app", `${'disconnected'}`);
            io.emit("tempto10app", `${'disconnected'}`);
            io.emit("tempto15app", `${'disconnected'}`);
            io.emit("tempto20app", `${'disconnected'}`);
            io.emit("tempto25app", `${'disconnected'}`);
            io.emit("stations", stations);
           console.log("Room ", socket.id, " disconnected");
      console.log("stations_ID[]: ", stations_ID);
    } else console.log("user ", socket.id, " disconnected");
            
      
    });

    socket.on("create-station", (station) => {
        let stationTemp = station;
        stationTemp.id = socket.id;
        stations.push(stationTemp);
        stations_ID.push(stationTemp.id);
     
        //io.to(socket.id).emit("station-id", socket.id);
        io.emit("stations", stations);
    });

    socket.on("list-rooms", (msg) => {
        io.emit("stations", stations);
      
    });

    socket.on("join-room", (msg) => {
        socket.leaveAll();
        socket.join(msg);
    });
  
  
    socket.on('temp', (msg) => {
        
        msg.tempC = msg.tempC.toFixed(1);
        msg.uSv = msg.uSv.toFixed(2);
        msg.date = new Date(msg.date * 1000);
        io.to(socket.id).emit("temp2web", msg);
        //console.log(msg);
        switch(msg.statusStation) {
          
          case 'Tram1':  {
            try {
              
              io.emit("temptoapp", `${msg.tempC}`);
              io.emit("tempto1app", `${msg.humi}`);
              io.emit("tempto2app", `${msg.cps}`);
              io.emit("tempto3app", `${msg.uSv}`);
              io.emit("tempto4app", `${msg.counts}`);
              io.emit("tempto31app", `${msg.date}`);   
               
                const col = db.collection("Tram_1");
                const p = col.insertOne(msg);
              

                
            } catch (err) {

            }
            break;
        }
          case 'Tram2':  {
            try {
              io.emit("tempto5app", `${msg.tempC}`);
              io.emit("tempto6app", `${msg.humi}`);
              io.emit("tempto7app", `${msg.cps}`);
              io.emit("tempto8app", `${msg.uSv}`);
              io.emit("tempto9app", `${msg.counts}`);
              io.emit("tempto32app", `${msg.date}`);  
              
                const col = db.collection("Tram_2");
                const p = col.insertOne(msg);
              
              
            } catch (err) {

            }
            break;
        }
        case 'Tram3':  {
            try {

              
              io.emit("tempto10app", `${msg.tempC}`);
              io.emit("tempto11app", `${msg.humi}`);
              io.emit("tempto12app", `${msg.cps}`);
              io.emit("tempto13app", `${msg.uSv}`);
              io.emit("tempto14app", `${msg.counts}`);
              io.emit("tempto33app", `${msg.date}`);  
              
              
                const col = db.collection("Tram_3");
                const p = col.insertOne(msg);
              
              
              
             
                
            } catch (err) {

            }
            break;
        }
        case 'Tram4':  {
            try {
              io.emit("tempto15app", `${msg.tempC}`);
              io.emit("tempto16app", `${msg.humi}`);
              io.emit("tempto17app", `${msg.cps}`);
              io.emit("tempto18app", `${msg.uSv}`);
              io.emit("tempto19app", `${msg.counts}`);
              io.emit("tempto34app", `${msg.date}`);  

                const col = db.collection("Tram_4");
                const p = col.insertOne(msg);
                // let data = JSON.stringify(msg);
                //   fs.appendFileSync('student-2.json', data);
            } catch (err) {

            }
            break;
        }
        case 'Tram5':  {
            try {
              io.emit("tempto20app", `${msg.tempC}`);
              io.emit("tempto21app", `${msg.humi}`);
              io.emit("tempto22app", `${msg.cps}`);
              io.emit("tempto23app", `${msg.uSv}`);
              io.emit("tempto24app", `${msg.counts}`);;
              io.emit("tempto35app", `${msg.date}`);  
              
                const col = db.collection("Tram_5");
                const p = col.insertOne(msg);
                
              
                
            } catch (err) {
                console.log(err);
            }
            break;
        }
        case 'Tram6':  {
            try {
              io.emit("tempto25app", `${msg.tempC}`);
              io.emit("tempto26app", `${msg.humi}`);
              io.emit("tempto27app", `${msg.cps}`);
              io.emit("tempto28app", `${msg.uSv}`);
              io.emit("tempto29app", `${msg.counts}`);
              io.emit("tempto36app", `${msg.date}`);  
                const col = db.collection("Tram_6");
                const p = col.insertOne(msg);
              
         
            } catch (err) {

            }
            break;
        }
        }
    });
});