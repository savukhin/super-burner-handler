#ifndef MOTOR_H
#define MOTOR_H

class Motor {
private:
  int pulse_rev;
  int rev_min;

  int getPulseDelay() {
    int pulse_min = pulse_rev * rev_min;
    float time_pulse_min = 1. / pulse_min;
    float time_pulse_mcs = time_pulse_min * 60. * 1000. * 1000.;

    return time_pulse_mcs / 2;
  }

public:
  int Motor(int pulse_rev) {
    int rev_min = 
  }
  
  void setup(int pinPull, int pinDir) {
    pinMode (driverPUL, OUTPUT);
    pinMode (driverDIR, OUTPUT);
  }

  void step(float pulse_rev=1000, boolean dir) {
    int pd = this->getPulseDelay();

    digitalWrite(this->driverDIR, dir);
    digitalWrite(this->driverPUL, HIGH);
    delayMicroseconds(pd);
    digitalWrite(this->driverPUL, LOW);
    delayMicroseconds(pd);
  }

  void rotate(float degrees) {
    
  }
}

#endif