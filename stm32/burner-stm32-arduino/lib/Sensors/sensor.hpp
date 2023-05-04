#pragma once

class ISensor {
public:
    ISensor() {}
    virtual double getValue() = 0;
};
