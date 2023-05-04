#ifndef REDUCTOR_MOTOR_H
#define REDUCTOR_MOTOR_H

#include "logging.hpp"
#include "motor.hpp"

class ReductorMotor : public Motor {
public:
  ReductorMotor(int pulse_rev, float valveRadiusMM=2): Motor(pulse_rev, valveRadiusMM) {}

  void openPercentage(float percentage) {
    digitalWrite(4, HIGH);
    // for (int i = 0; i < 50; i++) {
    for (int i = 0; i < 50; i++) {
      delayMicroseconds(50);
      digitalWrite(15, HIGH);
      delayMicroseconds(50);
      digitalWrite(15, LOW);
      // Logging::debug("Wrote");
      }
    // moveLength(percentage);
  }
};

#endif