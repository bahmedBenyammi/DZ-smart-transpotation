const { SerialPort } = require('serialport')
const serialPort = new SerialPort({
    path: getPort(),
    baudRate: 9600,
    autoOpen: false,
})


async function getPort() {
    var ports = await SerialPort.list()
    var path;
    ports.forEach(p => {
        console.log(p.path)
        // if( p.path.startsWith('COM'))
        //     path= p.path
        if (p.path === 'COM3')
            path = p.path
    })
    return path;
}
module.exports= class ConnecterArduino{
    constructor() {
        this.serialPort = undefined;
    }
    async create() {
        if (this.serialPort === undefined) {
            this.serialPort = new SerialPort({
                path: await getPort(),
                baudRate: 9600,
            })
            await delay(6000)

        }
    }
    async Affiche(voyage, time) {
        await this.create()
        this.serialPort.write('A');
        await delay(1000)
        this.serialPort.write(voyage)
        console.log(voyage,)
        await delay(2000)
        this.serialPort.write(time)
    }
}
function delay(time) {
    return new Promise(resolve => setTimeout(resolve, time));
}


