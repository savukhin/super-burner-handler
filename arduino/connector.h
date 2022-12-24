#ifndef CONNECTOR_H
#define CONNECTOR_H

#include <string>
#include <vector>
// #include <optional>
#include <memory>

#include "chart.h"
#include "queries.h"

class Connector {
private:
    void(*moveMotorCallback)(MotorMoveQuery);
    void(*reductorCallback)(ReductorQuery);

    bool doQuery(RawQuery query) {
      auto motorMove = MotorMoveQuery::isMotorMoveQuery(query);
      if (motorMove != nullptr) {
        // Serial.println("Motor move query");
        this->moveMotorCallback(*motorMove);
        return true;
      }

      auto reductor = ReductorQuery::isReductorQuery(query); 
      if (reductor != nullptr) {
        // Serial.println("Reductor query");
        this->reductorCallback(*reductor);
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
      // Serial.println(content);

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
