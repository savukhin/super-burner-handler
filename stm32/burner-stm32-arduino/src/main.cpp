// #if defined(ARDUINO)
#include <Arduino.h>
// #else
// #include <ArduinoUnit.h>
// #include <ArduinoUnitMock.h>
// #endif

#include <target.hpp>
#include <string>
#include <vector>
// #include <Thread.h>
#include <math.h>

#include "experiment.hpp"
#include "logging.hpp"
#include "connector.hpp"
#include "pyrometer.hpp"
#include "resistor.hpp"
#include "thermocouple.hpp"
#include "motor.hpp"
#include "reductorMotor.hpp"
#include "queries.hpp"

// #define D0 16
// #define D1 5
// #define D2 4
// #define D3 0
// #define D4 2
// #define D5 14  
// #define D6 12
// #define D7 13
// #define D8 15
#define D23 23
#define D22 22
#define D21 21

#define D15 15
#define D2 2
#define D4 4

#define D14 14
#define D27 27
#define D26 26

const float MAX_X_MM = 280;
const float MAX_Y_MM = 200;

Connector connector;

// ------- MOTORS ------- //
Motor motorX(200, 0.3184, true, 0.4);
// Motor motorX(200, 0.41, false, 0.4);
Motor motorY(200, 9.77, true, 1);
// Motor motorY(200, 0.525, true, 0.05);
// Motor motorY(200, 19, true, 0.05);
// Motor motorY(200, 0.41, true, 0.6);
// Motor motorY(200, 4.1);

ReductorMotor motorReductor1(200);
ReductorMotor motorReductor2(200);

// ------- SENSORS ------- //
Thermocouple thermocouple(NC);
Pyrometer pyrometer(NC);
Resistor photoresistor(NC);

// ------- OTHERS ------- //
Ignitor ignitor(NC);

Experiment experiment(
  {&thermocouple, &pyrometer, &photoresistor},
  &motorX, &motorY, &ignitor, &photoresistor
);


void setup() {
    // sensors.setup()
    connector.setup();

    // sensorsThread.onRun(sendCharts);
    // sensorsThread.setInterval(1000);
    // stepper.setSpeed(30);
    
    motorX.setup(MOTOR_X_PULL, MOTOR_X_DIR, MOTOR_X_ENA);
    motorY.setup(MOTOR_Y_PULL, MOTOR_Y_DIR, MOTOR_Y_ENA);

    connector.setMotorMoveCallback([](MotorMoveQuery query) {
      Logging::debug("Query motor move " + String(query.x_axis ? "x-axis" : "y-axis") + " NextPosition: " + String(query.position) + " Speed: " + String(query.speed_mm_per_min));
      // float final_position = query.position + (query.x_axis ? motorX.getPosition() : motorY.getPosition());
      float final_position = max(0.f, query.position);

      if (query.x_axis) {
        final_position = min(MAX_X_MM, final_position);
        motorX.moveTo(final_position, query.speed_mm_per_min);
      } else {
        final_position = min(MAX_Y_MM, final_position);
        motorY.moveTo(final_position, query.speed_mm_per_min);
      }
    
      connector.sendResponse(query.id, "{ \"final_position\": " + String(final_position) + " }");
    });

    connector.setCalibrateXYMotorsCallback([](CalibrateXYMotorsQuery query) {
      Logging::debug("Query calibrate motor");

      motorX.moveTo(-MAX_X_MM);
      Logging::debug("Calibrated X");
      motorY.moveTo(-MAX_Y_MM);
      Logging::debug("Calibrated Y");

      motorX.refreshZeroPosition();
      motorY.refreshZeroPosition();
      Logging::debug("Refreshed positions");

      connector.sendResponse(query.id, "ok");
    });

    connector.setSetIntVarCallback([](SetIntVarQuery query) {
      Logging::debug("Query setInt " + query.variable + " value = " + String(query.value));
      // float final_position = query.position + (query.x_axis ? motorX.getPosition() : motorY.getPosition());
      
    });

    connector.setStartExperimentCallback([](StartExperimentQuery query) {
      Logging::debug("Query startExperiment");
      experiment.start();
    });
}

void loop() {
    // if (sensorsThread.shouldRun())
    //     sensorsThread.run();
    connector.loop();
    experiment.loop();
}
