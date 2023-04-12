#include <Arduino.h>

#define PIN_PULL PB9
#define PIN_DIR PB8

void setup() {
  // put your setup code here, to run once:
  pinMode(PIN_PULL, OUTPUT);
  pinMode(PIN_DIR, OUTPUT);
  // pinMode(PB8, OUTPUT);

  digitalWrite(PIN_DIR, HIGH);
}

void loop() {
  // put your main code here, to run repeatedly:
  digitalWrite(PIN_PULL, HIGH);
  delayMicroseconds(1000);
  digitalWrite(PIN_PULL, LOW);
  delayMicroseconds(1000);
}