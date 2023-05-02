#include <Arduino.h>
#include "max6675.hpp"

#define D18 19
#define D19 18
#define D5 5

// int thermoMISO = D19;
// int thermoCS = D5;
// int thermoCLK = D18;

int thermoMISO = PB_5;
int thermoCS = PB_4;
int thermoCLK = PB_3;

MAX6675 thermocouple(thermoCLK, thermoCS, thermoMISO, 1.0 / 7.0);

void setup() {
  Serial.begin(115200);

  Serial.println("MAX6675 test");
  // wait for MAX chip to stabilize
  delay(500);
}

void loop() {
   Serial.print("C = "); 
   Serial.println(thermocouple.readCelsius());
 
   // For the MAX6675 to update, you must delay AT LEAST 250ms between reads!
   delay(1000);
}