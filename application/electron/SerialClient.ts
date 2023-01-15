import { SerialPort } from 'serialport';

export class SerialClient {
    serial?: SerialPort
    answers = new Map<number, string>
    nextId = 1

    constructor() {}

    public static async handleGetCOMs(event: Electron.IpcMainInvokeEvent) {
        return (await SerialPort.list()).map(port => port.path)
    }

    private generateId() {
        this.nextId = this.nextId + 1
        return this.nextId - 1;
    }

    async SetPortHandler(event: Electron.IpcMainInvokeEvent, portName: string) {
        let serial = new SerialPort({ path: portName, baudRate: 115200 });

        const checkOpened = await new Promise((resolve) => setTimeout(resolve, 300)).then(() => {
          return serial.isOpen
        })

        if (checkOpened == false) {
          return "Not connected! Reload program and try again"
        }
        
        this.serial = serial;
        console.log(this.serial);
        
        
        // console.log("OPENING", portName, this.serial.port);
     
          this.serial.on('error', function(err) {
            console.log('Error: ', err.message)
          })

          this.serial.on('open', function(msg) {
            console.log('Message: ', msg)
            // console.log("OPENING", portName, serial.port);
            })

        var buffer = '';
        let obj = this
        this.serial.on('data', async function(chunk) {
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
                for (let i = 0; i < outputting.length; i++) {
                    const splitted = outputting[i].split(" ");
                    const id = parseInt(splitted[0])
                    if (isNaN(id))
                        continue
                        
                    console.log(`[0] = ${splitted[0]}; id = ${id}`);
                    const msg = splitted.slice(1).join(" ")
                    obj.answers.set(id, msg)
                    console.log(`answers = ${JSON.stringify(answers)}`);
                }
            // if (answers.length > 0) 
            //     sendData(200, answer[0]);
          })
          this.serial.on('close', function() {
            console.log('Close: ')
          })

        return "ok"

    }

    private async WaitForAnswer(id: number) {
        while (!this.answers.has(id)) {
            console.log(`step. answers = ${JSON.stringify(this.answers)}`);
            await new Promise( resolve => setTimeout(resolve, 100) );
        }

        return this.answers.get(id)
    }

    async SendMoveHandler(event: Electron.IpcMainInvokeEvent, length: number, axis: "x" | "y", speed?: number) {
        console.log(`received request serial = ${this.serial}`);
        if (this.serial == undefined)
            return
        
        console.log("isOpen ", this.serial.isOpen);
        

        console.log(axis, length);
        const id = this.generateId()
        let request = `${id} motor-move ${axis.toString()} ${length.toString()}\n`

        if (speed != undefined) {
            request = `${id} motor-move ${axis.toString()} ${length.toString()} ${speed.toString()}\n`
        }
        console.log(`request is '${request}'`);

        // this.serial.write(Buffer.from(request), function(err) {
        this.serial.write(request, function(err) {
            if (err) {
                return console.log('Error on write: ', err.message)
            }
            console.log('message written')
        })
        // this.serial.flush()

        // return "ok"
        const response_from_serial = await this.WaitForAnswer(id)
        if (!response_from_serial)
            return response_from_serial

        const json = JSON.parse(response_from_serial) as { final_position: string }
        
        return json.final_position
    }

    async SendCalibrateHandler (ievent: Electron.IpcMainInvokeEvent) {
        if (this.serial == undefined)
            return

        const id = this.generateId()

        let request = `${id} calibrate-xy-motors\n`
        this.serial.write(request, function(err) {
            if (err) {
                return console.log('Error on write: ', err.message)
            }
            console.log('message written')
        })

        return await this.WaitForAnswer(id)
    }

}