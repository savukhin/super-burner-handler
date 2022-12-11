float Vacross,Iamp = 0;
const int Shunt_Res = 1000; //for 1k resistor

void setup() {
  Serial.begin(9600);
}

void loop() {
  Vacross = analogRead(A0);
   
  Vacross = (Vacross * 5.0) / 1023.0;
  Iamp = (Vacross * 1000) / Shunt_Res;
  
  Serial.print("Current = ");
  Serial.print(Iamp);
  Serial.println("mA");
  delay(1000);
}
