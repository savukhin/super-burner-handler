#ifndef LOG_H
#define LOG_H

#define DEBUG

class Logging {
public:
    static void debug(String msg) {
        #ifdef DEBUG
        Serial.println(msg);
        #endif DEBUG
    }
};

#endif LOG_H
