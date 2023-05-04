#include <gtest/gtest.h>

#if defined(ARDUINO)
#include <Arduino.h>

void setup()
{
    // should be the same value as for the `test_speed` option in "platformio.ini"
    // default value is test_speed=115200
    Serial.begin(115200);

    ::testing::InitGoogleTest();
    // if you plan to use GMock, replace the line above with
    // ::testing::InitGoogleMock();
}

void loop()
{
  // Run tests
  if (RUN_ALL_TESTS())
  ;

  // sleep for 1 sec
  delay(1000);
}

#else
#include <ArduinoUnit.h>
#include <ArduinoUnitMock.h>
int main(int argc, char **argv)
{
    ::testing::InitGoogleTest(&argc, argv);
    // if you plan to use GMock, replace the line above with
    // ::testing::InitGoogleMock(&argc, argv);

    if (RUN_ALL_TESTS())
    ;

    // Always return zero-code and allow PlatformIO to parse results
    return 0;
}
#endif


// #include <Arduino.h>
// #include <unity.h>
// // #include "logging.hpp"
// // #include "motor.hpp"
// // #include "sensor.hpp"
// // #include "reductorMotor.hpp"

// #include "queries.hpp"
// // #include ""
// // #include <string>

// String STR_TO_TEST;

// void setUp(void) {
//     // set stuff up here
//     STR_TO_TEST = "Hello, world!";
// }

// void tearDown(void) {
//     // clean stuff up here
//     STR_TO_TEST = "";
// }

// void test_string_concat(void) {
//     String hello = "Hello, ";
//     String world = "world!";
//     TEST_ASSERT_EQUAL_STRING(STR_TO_TEST.c_str(), (hello + world).c_str());
// }

// void test_string_substring(void) {
//     TEST_ASSERT_EQUAL_STRING("Hello", STR_TO_TEST.substring(0, 5).c_str());
// }

// void test_string_index_of(void) {
//     TEST_ASSERT_EQUAL(7, STR_TO_TEST.indexOf('w'));
// }

// void test_string_equal_ignore_case(void) {
//     TEST_ASSERT_TRUE(STR_TO_TEST.equalsIgnoreCase("HELLO, WORLD!"));
// }

// void test_string_to_upper_case(void) {
//     STR_TO_TEST.toUpperCase();
//     TEST_ASSERT_EQUAL_STRING("HELLO, WORLD!", STR_TO_TEST.c_str());
// }

// void test_string_replace(void) {
//     STR_TO_TEST.replace('!', '?');
//     TEST_ASSERT_EQUAL_STRING("Hello, world?", STR_TO_TEST.c_str());
// }

// void test_queries(void) {
//     TEST_ASSERT_EQUAL_STRING("a", "a");
// }

// void setup()
// {
//     delay(2000); // service delay
//     UNITY_BEGIN();

//     RUN_TEST(test_string_concat);
//     RUN_TEST(test_string_substring);
//     RUN_TEST(test_string_index_of);
//     RUN_TEST(test_string_equal_ignore_case);
//     RUN_TEST(test_string_to_upper_case);
//     RUN_TEST(test_string_replace);
//     RUN_TEST(test_queries);

//     UNITY_END(); // stop unit testing
// }

// void loop()
// {
// }