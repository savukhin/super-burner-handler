#include <string>
#include <vector>
#include <Thread.h>

#include "connector.h"
#include "sensor.h"
#include "motor.h"

uint httpPort = 80;
std::string ssid = "WS_Lab7";
std::string password = "ws2020ws";

Sensors sensors(std::vector<uint32_t>{0});
Connector connector;
Motor motorX(200);
Motor motorY(200);

Thread sensorsThread = Thread();

void sendCharts() {
    while (true) {
        auto charts = sensors.getCharts();
        connector.send(charts);
        delay(3000);
    }
}


void setup() {
    // sensors.setup()
    // connector.setup(httpPort, ssid, password);

    // sensorsThread.onRun(sendCharts);
    // sensorsThread.setInterval(1000);
    // stepper.setSpeed(30);
    

    motorX.setup(16, 5);
    motorY.setup(4, 0);
}

const float GEAR_RED = 64;
const float STEPS_PER_OUT_REV = STEPS * GEAR_RED;
int StepsRequired;

void loop() {
    // if (sensorsThread.shouldRun())
    //     sensorsThread.run();

    // connector.loop();
}