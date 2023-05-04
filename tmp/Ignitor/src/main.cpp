#include <Arduino.h>

#define D33 33
#define D12 12

const int SOURCE_PIN = D12;
const int GATE_PIN = D33;

void setup() {
  // put your setup code here, to run once:
  // pinMode(SOURCE_PIN, OUTPUT);
  pinMode(GATE_PIN, OUTPUT);

  // digitalWrite(SOURCE_PIN, HIGH);
}

void loop() {
  // put your main code here, to run repeatedly:
  digitalWrite(GATE_PIN, HIGH);
  delay(5000);
  digitalWrite(GATE_PIN, LOW);
  delay(5000);
}