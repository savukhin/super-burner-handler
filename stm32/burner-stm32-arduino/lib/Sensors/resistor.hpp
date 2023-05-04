#pragma once

#include "Arduino.h"
#include "pinReader.hpp"

class Resistor : public PinReader {
public:
    Resistor() = delete;
    Resistor(int pin): PinReader(pin) {}
};
