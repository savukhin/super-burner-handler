#pragma once

#include "Arduino.h"
#include "logging.hpp"

class Ignitor {
private:
    int pin = -1;
public:
    Ignitor() = default;
    Ignitor(int pin): pin(pin) {
        pinMode(pin, OUTPUT);
    }

    void start() {
        Logging::debug("Started ignitor");
        digitalWrite(pin, HIGH);
    }

    void stop() {
        Logging::debug("Stopped ignitor");
        digitalWrite(pin, LOW);
    }
};