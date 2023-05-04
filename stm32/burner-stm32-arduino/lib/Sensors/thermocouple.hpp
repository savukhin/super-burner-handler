#pragma once

#include "Arduino.h"
#include "pinReader.hpp"

class Thermocouple : public PinReader {
public:
    Thermocouple() = delete;
    Thermocouple(int pin): PinReader(pin) {}
};
