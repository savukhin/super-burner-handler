#ifndef MOTOR_H
#define MOTOR_H

#include "logging.h"
#include <math.h>

class Motor {
private:
  int pulse_rev;
  int rev_min;
  int pinPull;
  int pinDir;
  int pinEna;
  float valveLenghtMM;
  float valveLenghtPerDegree;
  float stepDegree;
  float position;
  float speedMultiplier;
  bool invertDIR;

  int getPulseDelay() {
    int pulse_min = pulse_rev * rev_min;
    // float time_pulse_min = 1. / pulse_min;
    // float time_pulse_mcs = time_pulse_min * 60. * 1000. * 1000.;

    float time_pulse_mcs = (60. * 1000. * 1000.) / pulse_min;

    return time_pulse_mcs / (2 * this->speedMultiplier);
  }


public:
  Motor(int pulse_rev, float valveRadiusMM=2, bool invertDIR=false, float speedMultiplier=1) {
    this->invertDIR = invertDIR;

    this->valveLenghtMM = 2 * M_PI * valveRadiusMM;
    this->valveLenghtPerDegree = this->valveLenghtMM / 360;

    this->pulse_rev = pulse_rev;
    // this->rev_min = 1600;
    this->rev_min = 1000;
    this->stepDegree = 360. / this->pulse_rev;

    this->position = 0;

    this->speedMultiplier = speedMultiplier;
  }
  
  void setup(int pinPull, int pinDir, int pinEna=-1) {
    this->pinPull = pinPull;
    this->pinDir = pinDir;
    this->pinEna = pinEna;

    pinMode(this->pinPull, OUTPUT);
    pinMode(this->pinDir, OUTPUT);
    pinMode(this->pinEna, OUTPUT);

    digitalWrite(this->pinEna, HIGH);
  }

  void step(float pulse_rev=200) {
    int pd = this->getPulseDelay();

    digitalWrite(this->pinPull, HIGH);
    delayMicroseconds(pd);
    digitalWrite(this->pinPull, LOW);
    delayMicroseconds(pd);
  }

  void restart() {
    Logging::debug("start restart");
    digitalWrite(this->pinEna, LOW);
    delay(200);

    digitalWrite(this->pinEna, HIGH);
    Logging::debug("end restart");
  }

  void refreshZeroPosition() {
    this->position = 0;
  }

  void makeSteps(float steps) {
    boolean dir = HIGH;
    if (steps < 0)
      dir = LOW;

    if (this->invertDIR) {
      if (dir == HIGH)
        dir = LOW;
      else
        dir = HIGH;
    }
    Logging::debug("dir = " + String(dir));
    Logging::debug("steps = " + String(steps));

    digitalWrite(this->pinDir, dir);

    int final_steps = 0;
    if (steps < 0) {
        final_steps = floor(abs(steps));
    } else {
        final_steps = ceil(abs(steps));
    }

    for (int i = 0; i < final_steps; i++) {
      this->step();
    }

    this->restart();
  }

  float getPosition() {
    return this->position;
  }

  void rotate(float degrees) {
    float steps = degrees / this->stepDegree;
    // int steps = ceil(abs(degrees) / this->stepDegree);

    makeSteps(steps);
  }

  void moveLength(float lenght) {
    float degrees = lenght / this->valveLenghtPerDegree;
    // this->rotate(degrees);

    float steps = this->pulse_rev * (lenght / this->valveLenghtMM);
    makeSteps(steps);
  }

  void moveTo(float position) {
    this->moveLength(position - this->position);
    this->position = position;
  }
};

#endif