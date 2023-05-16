#ifndef CONNECTOR_H
#define CONNECTOR_H

#include <string>
#include <vector>
#include "logging.hpp"
// #include <optional>
#include <memory>

#include "queries.hpp"

class Connector {
private:
    void(*moveMotorCallback)(MotorMoveQuery);
    void(*calibrateXYMotorsCallback)(CalibrateXYMotorsQuery);
    void(*igniteCallback)(IgniteQuery);
    void(*setFloatVarCallback)(SetFloatVarQuery);
    void(*startExperimentCallback)(StartExperimentQuery);

    bool doQuery(RawQuery query) {
      auto motorMove = MotorMoveQuery::isMotorMoveQuery(query);
      if (motorMove != nullptr) {
        Logging::debug("Motor move query");
        this->moveMotorCallback(*motorMove);
        return true;
      }

      auto calibrate = CalibrateXYMotorsQuery::isCalibrateQuery(query); 
      if (calibrate != nullptr) {
        Logging::debug("Calibrate query");
        this->calibrateXYMotorsCallback(*calibrate);
        return true;
      }

      auto ignite = IgniteQuery::isIgniteQuery(query); 
      if (ignite != nullptr) {
        Logging::debug("ignite query");
        this->igniteCallback(*ignite);
        return true;
      }

      auto setInt = SetFloatVarQuery::isSetFloatVarQuery(query); 
      if (setInt != nullptr) {
        Logging::debug("SetInt query");
        this->setFloatVarCallback(*setInt);
        return true;
      }

      auto start = StartExperimentQuery::isStartExperimentQuery(query); 
      if (start != nullptr) {
        Logging::debug("Start experiment query");
        this->startExperimentCallback(*start);
        return true;
      }

      return false;
    }

    void serialReader() {
      String content = "";

      if (Serial.available() == 0) 
        return;

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
    void setCalibrateXYMotorsCallback(void(*calibrateXYMotorsCallback)(CalibrateXYMotorsQuery)) {
      this->calibrateXYMotorsCallback = calibrateXYMotorsCallback;
    }
    void setIgniteCallback(void(*igniteCallback)(IgniteQuery)) {
      this->igniteCallback = igniteCallback;
    }
    void setSetFloatVarCallback(void(*setFloatVarCallback)(SetFloatVarQuery)) {
      this->setFloatVarCallback = setFloatVarCallback;
    }
    void setStartExperimentCallback(void(*startExperimentCallback)(StartExperimentQuery)) {
      this->startExperimentCallback = startExperimentCallback;
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
