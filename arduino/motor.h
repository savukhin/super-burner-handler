#ifndef MOTOR_H
#define MOTOR_H
#include <math.h>

class Motor {
private:
  int pulse_rev;
  int rev_min;
  int pinPull;
  int pinDir;
  float valveLenghtMM;
  float valveLenghtPerDegree;
  float stepDegree;
  float position;

  int getPulseDelay() {
    int pulse_min = pulse_rev * rev_min;
    float time_pulse_min = 1. / pulse_min;
    float time_pulse_mcs = time_pulse_min * 60. * 1000. * 1000.;

    return time_pulse_mcs / 2;
  }


public:
  Motor(int pulse_rev, float valveRadiusMM=2) {
    this->valveLenghtMM = 2 * M_PI * valveRadiusMM;
    this->valveLenghtPerDegree = this->valveLenghtMM / 360;

    this->pulse_rev = pulse_rev;
    // this->rev_min = 1600;
    this->rev_min = 1000;
    this->stepDegree = 360 / this->pulse_rev;

    this->position = 0;
  }
  
  void setup(int pinPull, int pinDir) {
    this->pinPull = pinPull;
    this->pinDir = pinDir;

    pinMode(this->pinPull, OUTPUT);
    pinMode(this->pinDir, OUTPUT);
  }

  void step(float pulse_rev=200) {
    int pd = this->getPulseDelay();

    digitalWrite(this->pinPull, HIGH);
    delayMicroseconds(pd);
    digitalWrite(this->pinPull, LOW);
    delayMicroseconds(pd);
    Serial.println(pd);
  }

  void rotate(float degrees) {
    int steps = ceil(abs(degrees) / this->stepDegree);
    boolean dir = HIGH;
    if (degrees < 0)
      dir = LOW;

    digitalWrite(this->pinDir, dir);

    for (int i = 0; i < steps; i++) {
      step();
    }
  }

  void moveLength(float lenght) {
    float degrees = lenght / this->valveLenghtPerDegree;
    this->rotate(degrees);
  }

  void moveTo(float position) {
    this->moveLength(position - this->position);
    this->position = position;
  }
};

#endif