#include <Arduino.h>

const auto PYRO_PIN = 15; 

void setup() {
  // put your setup code here, to run once:
  pinMode(PYRO_PIN, INPUT);
  Serial.begin(115200);
}

void loop() {
  // put your main code here, to run repeatedly:
  float sensorValue = analogRead(PYRO_PIN);
  float Result;
  
  Result = ((sensorValue-204.0)*100.0)/(1024.0-204.0);  //204 is offset, 4mAmp is 0
  // print out the value you read:
  if(Result>0)
  {
    Serial.print("Sensor Output:");
    Serial.print(Result); 
    Serial.print(" % ");
    Serial.println(sensorValue); 
  }
  else
  {
    Serial.print("Sensor Error ");	  //Show error if value is less than 4mAmp
    Serial.print(Result); 
    Serial.print(" % ");
    Serial.println(sensorValue); 
  }
    delay(200);        // delay in between reads for stability    
}