#pragma once

#define NC -1

#if defined(TARGET_BLUEPILL)
    #define MOTOR_Y_PULL       PB14
    #define MOTOR_Y_DIR        PB13
    #define MOTOR_Y_ENA        PB12
    #define MOTOR_X_PULL       PB9
    #define MOTOR_X_DIR        PB8
    #define MOTOR_X_ENA        PB7
#else
    #define MOTOR_Y_PULL       A11
    #define MOTOR_Y_DIR        A12
    #define MOTOR_Y_ENA        A13
    #define MOTOR_X_PULL       D14
    #define MOTOR_X_DIR        D15
    #define MOTOR_X_ENA        A16
#endif
