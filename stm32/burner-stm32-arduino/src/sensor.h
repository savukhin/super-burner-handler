#include <vector>
#include "chart.h"

class Sensor {
private:
    uint32_t pin;
public:
    Sensor(uint32_t pin=A0) {
        this->pin = pin;
    }

    Chart getChart() {}
};

class Sensors {
private:
    std::vector<Sensor> sensors;
public:
    Sensors(std::vector<uint32_t> pins) {
        this->sensors.resize(0);

        for (auto pin : pins)
            this->sensors.emplace_back(pin);
        
    }

    void setup() {

    }

    std::vector<Chart> getCharts() {
      std::vector<Chart> charts;
      for (auto sensor : sensors) {
        charts.push_back(sensor.getChart());
      }

      return charts;
    }
};
