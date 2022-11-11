#ifndef CONNECTOR_H
#define CONNECTOR_H

#include <ESPAsyncTCP.h>
#include <ESPAsyncWebServer.h>
#include <string>
#include <vector>
#include <optional>
#include "chart.h"
#include "queries.h"

class Connector {
private:
    AsyncWebServer server;
    AsyncWebSocket ws;
    void(*moveMotorCallback)(MotorMoveQuery);

    static void handleWebSocketMessage(void *arg, uint8_t *data, size_t len) {
        AwsFrameInfo *info = (AwsFrameInfo*)arg;
        if (info->final && info->index == 0 && info->len == len && info->opcode == WS_TEXT) {
            data[len] = 0;
            // String str = toString(data, len);
        }
    }

    static void onEvent(AsyncWebSocket *server, AsyncWebSocketClient *client, AwsEventType type,
                void *arg, uint8_t *data, size_t len) {
        switch (type) {
            case WS_EVT_CONNECT:
                break;
            case WS_EVT_DISCONNECT:
                break;
            case WS_EVT_DATA:
                handleWebSocketMessage(arg, data, len);
            break;
            case WS_EVT_PONG:
            case WS_EVT_ERROR:
            break;
        }
    }

    bool doQuery(RawQuery query) {
      auto motor = MotorMoveQuery::isMotorMoveQuery(query);

      if (motor != std::nullopt) {
        Serial.println("Motor query");
        this->moveMotorCallback(motor.value());
        return true;
      }

      return false;
    }

    void serialReader() {
      String content = "";
      // char character;
          
      // while(Serial.available()) {
      //     character = Serial.read();
      //     content.concat(character);
      // }

      while (Serial.available() == 0) {}     //wait for data available
      content = Serial.readString();
      content.trim();

      Serial.print("content is ");
      Serial.println(content);

      auto query = parseQuery(content);
      doQuery(query);
    }

public:
    Connector(): server(80), ws("/ws") {}

    void setup(int httpPort, std::string ssid, std::string password) {
        // WiFi.begin(ssid.c_str(), password.c_str());
        Serial.begin(115200);

        // this->server = AsyncWebServer(httpPort);
        // this->ws.onEvent(this->onEvent);
        // this->server.addHandler(&ws);
    }

    void setMotorMoveCallback(void(*moveMotorCallback)(MotorMoveQuery)) {
      this->moveMotorCallback = moveMotorCallback;
    }

    void send(std::vector<Chart> &charts) {

    }

    bool loop() {
      if (WiFi.status() != WL_CONNECTED) {
        // return false;
      }

      serialReader();

      return true;
    }
};

#endif
