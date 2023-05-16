#pragma once

#include "Arduino.h"
#include "logging.hpp"

class Ignitor {
private:
    int pin = -1;
    bool started = false;
public:
    Ignitor() = default;
    Ignitor(int pin): pin(pin) {
        pinMode(pin, OUTPUT);
    }

    void start() {
        Logging::debug("Started ignitor");
        this->started = true;
        digitalWrite(pin, HIGH);
    }

    bool isStarted() {
        return this->started;
    }

    void stop() {
        Logging::debug("Stopped ignitor");
        this->started = false;
        digitalWrite(pin, LOW);
    }
};