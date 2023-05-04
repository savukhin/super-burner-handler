#pragma once

#include "Arduino.h"
#include "sensor.hpp"

class PinReader : public ISensor {
private:
    int pin = -1;
public:
    PinReader() = delete;
    PinReader(int pin) {
        this->pin = pin;
        pinMode(pin, INPUT);
    }

    double getValue() {
        return analogRead(pin);
    }
};
