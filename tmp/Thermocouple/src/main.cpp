#include <Arduino.h>
#include <SPI.h>    // include the SPI library:
// #define DEBUG_ADC
#include <AD779X.hpp> // include the AD779X library 

// AD779X myADC(0.34);  // create new object, the voltage reference is 1.8V
AD779X myADC(1.8);  // create new object, the voltage reference is 1.8V

void setup() {

  Serial.begin(9600);                    // initialize serial port
  delay(2000);
  SPI.begin();                           // wake up the SPI
  SPI.setDataMode(SPI_MODE3);            // datasheet p6-7
  SPI.setBitOrder(MSBFIRST);
  SPI.setClockDivider(SPI_CLOCK_DIV32);  // datasheet p6
  myADC.Begin(PA15);                       // ADC attached to CS pin 10
  // myADC.Begin(5);                       // ADC attached to CS pin 10
  myADC.Setup(1,0);                      // sample only channel 0
  myADC.Config();                        // default values: gain 124, unipolar, 80dB (50 Hz only) rejection, reference detection disabled, buffer enabled, burnout current disabled, power switch disabled
}

void loop() {
  if (myADC.Update()) {                      // if new values available, print RAW and mV values
      Serial.print("CH0");
      Serial.print(" - RAW: ");
      Serial.print(myADC.readRaw(0), HEX);
      Serial.print("\tmV: ");
      Serial.println(myADC.readmV(0), HEX); 
    }
}
