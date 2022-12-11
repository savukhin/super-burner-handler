#include <string>
#include <vector>
#include <Thread.h>

#include "connector.h"
#include "sensor.h"
#include "motor.h"
#include "reductorMotor.h"
#include "queries.h"

#define D0 16
#define D1 5
#define D2 4
#define D3 0
#define D4 2
#define D5 14  
#define D6 12
#define D7 13
#define D8 15

int httpPort = 80;
std::string ssid = "WS_Lab7";
std::string password = "ws2020ws";

Sensors sensors(std::vector<uint32_t>{0});
Connector connector;
Motor motorX(200);
Motor motorY(200);

ReductorMotor motorReductor1(200);
ReductorMotor motorReductor2(200);

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
    connector.setup(httpPort, ssid, password);

    // sensorsThread.onRun(sendCharts);
    // sensorsThread.setInterval(1000);
    // stepper.setSpeed(30);
    

    motorX.setup(D8, D2);
    motorY.setup(5, 0);
    // motorReductor1.setup(D8, D2);
    // motorReductor2.setup(5, 0);


    connector.setMotorMoveCallback([](MotorMoveQuery query) {
      Serial.println("Query motor move x-axis " + String(query.x_axis ? "True" : "False") + " NextPosition: " + String(query.position));
      if (query.x_axis)
        motorX.moveTo(query.position);
      else
        motorY.moveTo(query.position);
      connector.sendResponse(query.id, "ok");
    });

    connector.setReductorCallback([](ReductorQuery query) {
      // Serial.println("Query reduct number " + String(query.reductor_number) + " NextPercentage: " + String(query.open_percentage));

      switch (query.reductor_number) {
        case 1:
          motorReductor1.openPercentage(query.open_percentage);
          break;
        case 2:
          motorReductor2.openPercentage(query.open_percentage);
          break;
      }
      connector.sendResponse(query.id, "ok");
    });
}

void loop() {
    // if (sensorsThread.shouldRun())
    //     sensorsThread.run();
    connector.loop();
}