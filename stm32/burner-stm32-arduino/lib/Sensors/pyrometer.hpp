#pragma once

#include "Arduino.h"
#include "pinReader.hpp"

class Pyrometer : public PinReader {
public:
    Pyrometer() = delete;
    Pyrometer(int pin): PinReader(pin) {}
};
