#ifndef CONNECTOR_H
#define CONNECTOR_H

#include <string>
#include <vector>
#include "logging.h"
// #include <optional>
#include <memory>

#include "chart.h"
#include "queries.h"

class Connector {
private:
    void(*moveMotorCallback)(MotorMoveQuery);
    void(*reductorCallback)(ReductorQuery);
    void(*calibrateXYMotorsCallback)(CalibrateXYMotorsQuery);

    bool doQuery(RawQuery query) {
      auto motorMove = MotorMoveQuery::isMotorMoveQuery(query);
      if (motorMove != nullptr) {
        // Logging::debug("Motor move query");
        this->moveMotorCallback(*motorMove);
        return true;
      }

      auto reductor = ReductorQuery::isReductorQuery(query); 
      if (reductor != nullptr) {
        // Logging::debug("Reductor query");
        this->reductorCallback(*reductor);
        return true;
      }

      auto calibrate = CalibrateXYMotorsQuery::isCalibrateQuery(query); 
      if (calibrate != nullptr) {
        // Logging::debug("Calibrate query");
        this->calibrateXYMotorsCallback(*calibrate);
        return true;
      }

      return false;
    }

    void serialReader() {
      String content = "";

      while (Serial.available() == 0) {}     //wait for data available
      content = Serial.readString();
      content.trim();

      // Serial.print("content is ");
      // Logging::debug(content);

      auto query = parseQuery(content);
      doQuery(query);
    }

public:
    Connector() {}

    void setup() {
        Serial.begin(115200);
    }

    void setMotorMoveCallback(void(*moveMotorCallback)(MotorMoveQuery)) {
      this->moveMotorCallback = moveMotorCallback;
    }
    void setReductorCallback(void(*reductorCallback)(ReductorQuery)) {
      this->reductorCallback = reductorCallback;
    }
    void setCalibrateXYMotorsCallback(void(*calibrateXYMotorsCallback)(CalibrateXYMotorsQuery)) {
      this->calibrateXYMotorsCallback = calibrateXYMotorsCallback;
    }

    void send(std::vector<Chart> &charts) {

    }

    void sendResponse(int id, String message) {
       Serial.println(String(id) + " " + message);
    }

    bool loop() {
      serialReader();

      return true;
    }
};

#endif
