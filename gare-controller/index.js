const axios = require('axios');
var http = require('http');
const gTTS = require('gtts');
const player = require('play-sound')(opts = {});

var alert=false
 const  ConnecterArduino=require('./ConnecterArduino')
const url = require("url");
var conneter=new ConnecterArduino();
http.createServer(function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/html'});
    //Return the url part of the request object:
    const queryObject = url.parse(req.url, true).query;
    res.end();
    alertf(queryObject);

}).listen(8015);
async function alertf(queryObject) {
    alert = true
    console.log('ok')
    // alretAudio(queryObject['audio'])
    await delay(2000)
    var s = queryObject['text']
    var m = s.split(';')
    conneter.Affiche(m[0], m[1])
    await delay(10000)
    conneter.Affiche("","")
    await delay(5000)
    alert = false 
    affiche();
}
function delay(time) {
    return new Promise(resolve => setTimeout(resolve, time));
}
async function affiche() {
    while (!alert) {
        const ListNearless = await getNearless();
        for (voyage of ListNearless.data.voyages) {
            let Destination='Destination '+(voyage.arrival.station.wilaya.id);
            let time='Temps  '+voyage.departure.departTime;
            console.log("1")
            console.log(time)
            await  conneter.Affiche(Destination,time);
            console.log("2")
            await  delay(15000)        }}
    console.log('stop')
}

affiche()


async function getNearless() {

    const currentTime = () => {
        var time = new Date();
        var local = new Date(time);
        local.setMinutes(time.getMinutes() - time.getTimezoneOffset());
        const heure = () => {
            if (time.getHours() < 10)
                return '0' + time.getHours();
            return time.getHours();
        }
        const minutes = () => {
            if (time.getMinutes() < 10)
                return '0' + time.getMinutes();
            return time.getMinutes();
        }
        return {time: heure() + ":" + minutes(), date: local.toJSON().slice(0, 10)}
    }
    var Atime = currentTime();
    const config = {
        headers: {
            gare: 1,
        },
        params: {
            time: Atime.time,
            date: Atime.date
        }
    };

    return await axios.get('http://localhost:8081/voyage/gare/prochaineVoyage', config)
        .then(response => {
            return response;
        })
        .catch(error => {
            console.log(error);
        });
}
function alretAudio(text){

const gtts = new gTTS(text, 'fr');
gtts.save('Voice.mp3', function (err, result){
    if(err) { throw new Error(err); }
    player.play('./Voice.mp3', function(err){
        if (err) console.log('err')
    })
});}
