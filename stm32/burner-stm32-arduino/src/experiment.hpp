#ifndef EXPERIMENT_H
#define EXPERIMENT_H

#include <vector>
// #include <exception>
// #include <windows.h>//different header file in linux
// #include <future>

#include "sensor.hpp"
#include "motor.hpp"
#include "ignitor.hpp"
#include "resistor.hpp"

/*
   |   (0,0)  ------------------> X-axis        |
   |   *-----------------------------           |
   |   |                            |           |
   |   |                            |           |
   |   |                            |           |
   |   |                            |           |
   |   |                            |           |
   |   |                            |           |
   |   |                            |           |
   |   |  -------->===<------------ |           |
   |   |                            |           |
   |   |                            |           |
   |   |                            |           |
   |   ------------------------------           |
   |                ^                           |
   |               | |                          Y
   |               | |                          
   Y               | |                         Y-axis
                   | |
Y-axis            -----
*/


class Experiment {
private:
    bool started = false;

    // ----- Electrical elements ----- //
    std::vector<ISensor*> sensors;
    Motor *motorX; // Target axis
    Motor *motorY; // Ignitor axis
    Ignitor *ignitor;
    Resistor *photoresistor;

    // ----- Experiments variables ----- //
    double YStart;
    double XStart;
    double YEnd;

    double XHighSpeed;
    double XLowSpeed;
    double YHighSpeed;
    double YLowSpeed;

    uint32_t startTime = -1;

    std::vector<double> readSensors() {
        std::vector<double> result(sensors.size());

        for (int i = 0; i < this->sensors.size(); i++) {
            result[i] = this->sensors[i]->getValue();
        }

        return result;
    }

public:
    Experiment() = delete;
    Experiment(std::vector<ISensor*> sensors,
        Motor *motorX, // Target axis
        Motor *motorY, // Ignitor axis
        Ignitor *ignitor,
        Resistor *photoresistor
    ): sensors(sensors), motorX(motorX), motorY(motorY), ignitor(ignitor), photoresistor(photoresistor) {}

    void start() {
        if (!this->motorX || !this->motorY || !this->ignitor) {
            throw std::invalid_argument("Electrical elements must be defined");
        }

        started = true;
        
        // Move to the null position
        this->motorX->moveTo(0, XHighSpeed);
        this->motorY->moveTo(0, YHighSpeed);

        // Move to the start position
        this->motorX->moveTo(this->XStart, XHighSpeed);
        this->motorY->moveTo(this->YStart, YHighSpeed);

        // Move to the ignitor position
        this->motorY->moveTo(this->YEnd, YLowSpeed);

        this->startTime = millis();

        this->ignitor->start();

    }

    void interrupt() {
        started = false;
        this->ignitor->stop();

        this->motorY->moveTo(this->YStart, YHighSpeed);

    }

    std::vector<double> loop() {
        if (!started) {
            return {};
        }

        if (millis() - this->startTime > 500) {
            this->ignitor->stop();
        }

        if (this->photoresistor->getValue() > 200) {
            interrupt();
        }

        std::vector<double> sensor_data = readSensors();

        return sensor_data;
    }

    bool SetVariable(String varname, float value) {
        if (varname == "YStart") {
            YStart = value;
        } else if (varname == "XStart") {
            XStart = value;
        } else if (varname == "YEnd") {
            YEnd = value;
        } else if (varname == "XHighSpeed") {
            XHighSpeed = value;
        } else if (varname == "XLowSpeed") {
            XLowSpeed = value;
        } else if (varname == "YHighSpeed") {
            YHighSpeed = value;
        } else if (varname == "YLowSpeed") {
            YLowSpeed = value;
        } else {
            return false;
        }  
        return true;
    }
};

#endif // EXPERIMENT_H
