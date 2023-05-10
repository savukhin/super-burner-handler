#pragma once

#define NC -1

#if defined(TARGET_BLUEPILL)
    #define MOTOR_Y_PULL       PB14
    #define MOTOR_Y_DIR        PB13
    #define MOTOR_Y_ENA        PB12
    #define MOTOR_X_PULL       PB9
    #define MOTOR_X_DIR        PB8
    #define MOTOR_X_ENA        PB7

    #define IGNITOR_PIN        NC

#elif defined(TARGET_ESP32_WROOM)
    #define MOTOR_Y_PULL       15
    #define MOTOR_Y_DIR        2
    #define MOTOR_Y_ENA        4
    #define MOTOR_X_PULL       13
    #define MOTOR_X_DIR        12
    #define MOTOR_X_ENA        14

    #define IGNITOR_PIN        27

#endif
