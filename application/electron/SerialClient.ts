import { SerialPort } from 'serialport';


export class SerialClient {
    private serial?: SerialPort

    constructor() {}

    public static async handleGetCOMs(event: Electron.IpcMainInvokeEvent) {
        return (await SerialPort.list()).map(port => port.path)
    }

    SetPortHandler(event: Electron.IpcMainEvent, portName: string) {
        this.serial = new SerialPort({ path: portName, baudRate: 115200 });
        // this.serial.
        console.log("OPENING", portName, this.serial.port);
        let serial = this.serial
     
          this.serial.on('error', function(err) {
            console.log('Error: ', err.message)
          })

          this.serial.on('open', function(msg) {
            console.log('Message: ', msg)
            console.log("OPENING", portName, serial.port);
            })

        var buffer = '';
        this.serial.on('data', function(chunk) {
            // console.log('Data: ', data)
            buffer += chunk;
            var answers = buffer.split(/\r?\n/); // Split data by new line character or smth-else
            let popped = answers.pop(); // Store unfinished data
            if (popped == undefined)
                buffer = ''
            else
                buffer = popped
            
            let outputting = answers.filter((answer) => answer != 'content is ')
            if (outputting.length > 0)
                console.log(outputting)
            // if (answers.length > 0) 
            //     sendData(200, answer[0]);
          })
          this.serial.on('close', function() {
            console.log('Close: ')
          })

          this.serial.write('main screen turn on', function(err) {
            if (err) {
              return console.log('Error on write: ', err.message)
            }
            console.log('message written')
          })

    }

    SendMoveHandler(event: Electron.IpcMainEvent, length: number, axis: "x" | "y") {
        if (this.serial == undefined)
            return
        
        console.log("isOpen ", this.serial.isOpen);
        

        console.log(axis, length);
        
        let request = "motor-move " + axis.toString() + " " + length.toString()

        // this.serial.write(Buffer.from(request), function(err) {
        this.serial.write(request, function(err) {
            if (err) {
              return console.log('Error on write: ', err.message)
            }
            console.log('message written')
          })
    }

}