#include <ESPAsyncTCP.h>
#include <ESPAsyncWebServer.h>
#include <string>
#include "chart.h"

using namespace std;

class Connector {
private:
    AsyncWebServer server;
    AsyncWebSocket ws;

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

public:
    Connector(): server(80), ws("/ws") {}

    void setup(uint httpPort, std::string ssid, std::string password) {
        WiFi.begin(ssid.c_str(), password.c_str());
        Serial.begin(115200);

        this->server = AsyncWebServer(httpPort);
        this->ws.onEvent(this->onEvent);
        this->server.addHandler(&ws);
    }

    void send(std::vector<Chart> &charts) {

    }

    bool loop() {
      if (WiFi.status() != WL_CONNECTED) {
        Serial.println("Not connected");
        return false;
      }

      Serial.println("Connected");
      return true;
    }
};
