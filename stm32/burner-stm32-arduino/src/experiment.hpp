#ifndef EXPERIMENT_H
#define EXPERIMENT_H

#include <vector>
// #include <exception>
// #include <windows.h>//different header file in linux
// #include <future>

#include "sensor.hpp"
#include "motor.hpp"
#include "ignitor.hpp"
#include "timer.hpp"

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

    // ----- Experiments variables ----- //
    double YStart;
    double XStart;
    double YEnd;

    double highSpeed;
    double lowSpeed;

    Timer timer;

    std::vector<double> readSensors() {
        std::vector<double> result(sensors.size());

        for (int i = 0; i < this->sensors.size(); i++) {
            result[i] = this->sensors[i]->getValue();
        }

        return result;
    }

public:
    Experiment() = default;
    Experiment(std::vector<ISensor*> sensors): sensors(sensors) {}

    void start() {
        if (!this->motorX || !this->motorY || !this->ignitor) {
            throw std::invalid_argument("Electrical elements must be defined");
        }

        started = true;
        
        // Move to the null position
        this->motorX->moveTo(0, highSpeed);
        this->motorY->moveTo(0, highSpeed);

        // Move to the start position
        this->motorX->moveTo(this->XStart, highSpeed);
        this->motorY->moveTo(this->YStart, highSpeed);

        // Move to the ignitor position
        this->motorY->moveTo(this->YEnd, lowSpeed);

        std::function<void()> func1 = [&]() {
            this->ignitor->stop();
        };

        this->timer.setTimeout(func1, 500);
    }

    std::vector<double> loop() {
        if (!started) {
            return;
        }

        std::vector<double> sensor_data = readSensors();
        
    }
};

#endif // EXPERIMENT_H
