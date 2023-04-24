#ifndef QUERIES_H
#define QUERIES_H

#include "logging.h"
#include <memory>
#include <vector>
// #include <Arduino.h>

using RawQuery = std::vector<String>;

std::shared_ptr<int> toInt(String str) {
  if (str.length() == 0)
    return 0;

  int result = 0;
  bool wasMinus = false;

  if (str[0] == '-')
    wasMinus = true;

  for (int i = (wasMinus? 1 : 0); i < str.length(); i++) {
    if (str[i] > '9' || str[i] < '0') {
      return nullptr;
    }

    int num = str[i] - '0';

    result = result * 10. + num;
  }

  if (wasMinus)
    result = -result;
    
  return std::make_shared<int>(result);
}

std::shared_ptr<unsigned int> toUInt(String str) {
  auto result = toInt(str);
  Logging::debug("is opt?");
  if (result == nullptr) {
    Logging::debug("opt");
    return nullptr; 
  }
  Logging::debug("value = " + String(*result));
  if (result.get() < 0)
    return nullptr; 

  return std::make_shared<unsigned int>(*result);
}

std::shared_ptr<float> toFloat(String str) {
  if (str.length() == 0)
    return 0;

  float result = 0;
  bool wasDot = false;
  bool wasMinus = false;
  int dotPower = 10;

  if (str[0] == '-')
    wasMinus = true;

  for (int i = (wasMinus? 1 : 0); i < str.length(); i++) {
    if (str[i] == '.' && wasDot) {
      return nullptr;
    }

    if (str[i] == '.' && !wasDot) {
      wasDot = true;
      continue;
    }

    if (str[i] > '9' || str[i] < '0') {
      return nullptr;
    }

    int num = str[i] - '0';

    if (!wasDot) {
      result = result * 10. + num;
      continue;
    }

    result = result + float(num) / float(dotPower);
    dotPower *= 10;
  }

  if (wasMinus)
    result = -result;

  return std::make_shared<float>(result);
}

String toString(char *data) {
  int len = strlen(data);
  String result = String("");
  for (int i = 0; i < len; i++)
    result.concat(data[i]);
  return result;
}


struct BaseQuery {
  bool valid = true;
  unsigned int id = 0;
};

// 5 motor-move x 100 1000
struct MotorMoveQuery : public BaseQuery {
  float position; // in mm
  bool x_axis;
  float speed_mm_per_min = 10;

  static std::shared_ptr<MotorMoveQuery> isMotorMoveQuery(RawQuery queries) {
    Logging::debug("Start checking is motor move query");
    
    if (queries.size() != 4 && queries.size() != 5) {
      Logging::debug("Size not two: " + String(queries.size()));
      for (int i = 0; i < queries.size(); i++) {
        Logging::debug("Queries[" + String(i) + "] = '" + queries[i] + "'");
      }
      return nullptr;
    }

    auto id = toUInt(queries[0]);
    if (id == nullptr) {
      Logging::debug("Third param: " + queries[2]);
      return nullptr;
    }

    if (queries[1] != "motor-move") {
      Logging::debug("First param no motor-move: " + queries[0]);
      return nullptr;
    }

    if (queries[2] != "x" && queries[2] != "y") {
      Logging::debug("Second param: '" + queries[2] + "'");
      return nullptr;
    }
    
    auto position = toFloat(queries[3]);
    if (position == nullptr) {
      Logging::debug("Third param: " + queries[2]);
      return nullptr;
    }

    auto speed = toFloat(queries[4]);
    if (speed != nullptr) {
      Logging::debug("Speed: " + String(*speed));
    }

    Logging::debug("It is motor move query");

    MotorMoveQuery result;
    result.valid = true;
    result.id = *id;
    result.x_axis = (queries[2][0] == 'x');
    result.position = *position;
    if (speed != nullptr)
      result.speed_mm_per_min = *speed;
    else
      result.speed_mm_per_min = -1;

    return std::make_shared<MotorMoveQuery>(result);
  }
};

struct ReductorQuery : public BaseQuery {
  float open_percentage; // in percents [0; 100]
  int reductor_number;

  static std::shared_ptr<ReductorQuery> isReductorQuery(RawQuery queries) {
    if (queries.size() != 4) {
      Logging::debug("Size not two: " + String(queries.size()));
      for (int i = 0; i < queries.size(); i++) {
        Logging::debug("Queries[" + String(i) + "] = '" + queries[i] + "'");
      }
      return nullptr;
    }

    auto id = toUInt(queries[0]);
    if (id == nullptr) {
      // Logging::debug("Third param: " + queries[2]);
      return nullptr;
    }

    if (queries[1] != "reductor") {
      // Logging::debug("First param not reductor: " + queries[1]);
      // return nullptr;
    }

    auto number = toInt(queries[2]);
    if (number == nullptr) {
      // Logging::debug("Second param: '" + queries[1] + "'");
      return nullptr;
    }
    
    auto percentage = toFloat(queries[3]);
    if (percentage == nullptr) {
      // Logging::debug("Third param: " + queries[2]);
      return nullptr;
    }

    // Logging::debug("params: " + queries[0] + " " + queries[1] + " " + queries[2]);
    // Logging::debug("decoded: " + queries[0] + " " + String(number.get()) + " " + String(percentage.get()));

    ReductorQuery result;
    result.valid = true;
    result.id = *id;
    result.reductor_number = *number;
    result.open_percentage = *percentage;
    return std::make_shared<ReductorQuery>(result);
  }
};

// 1 calibrate-xy-motors
struct CalibrateXYMotorsQuery : public BaseQuery {
  static std::shared_ptr<CalibrateXYMotorsQuery> isCalibrateQuery(RawQuery queries) {
    Logging::debug("Start checking is motor move query");
    
    if (queries.size() != 2) {
      Logging::debug("Size not two: " + String(queries.size()));
      for (int i = 0; i < queries.size(); i++) {
        Logging::debug("Queries[" + String(i) + "] = '" + queries[i] + "'");
      }
      return nullptr;
    }

    auto id = toUInt(queries[0]);
    if (id == nullptr) {
      Logging::debug("Third param: " + queries[2]);
      return nullptr;
    }

    if (queries[1] != "calibrate-xy-motors") {
      Logging::debug("First param no motor-move: " + queries[0]);
      return nullptr;
    }

    Logging::debug("It is calibrate xy motors query");

    CalibrateXYMotorsQuery result;
    result.valid = true;
    result.id = *id;
    return std::make_shared<CalibrateXYMotorsQuery>(result);
  }
};

// 5 ignite 1
// 5 ignite 0
struct IgniteQuery : public BaseQuery {
  float turnOn = false; // 1 = turnOn, 0 = turnOff

  static std::shared_ptr<IgniteQuery> isIgniteQuery(RawQuery queries) {
    Logging::debug("Start checking is ignite query");
    
    if (queries.size() != 2) {
      Logging::debug("Size not two: " + String(queries.size()));
      for (int i = 0; i < queries.size(); i++) {
        Logging::debug("Queries[" + String(i) + "] = '" + queries[i] + "'");
      }
      return nullptr;
    }

    auto flag = toUInt(queries[0]);
    if (flag == nullptr || *flag != 1 || *flag != 2) {
      Logging::debug("Third param: " + queries[2]);
      return nullptr;
    }


    IgniteQuery result;
    result.turnOn = (*flag == 1);

    return std::make_shared<IgniteQuery>(result);
  }
};


RawQuery parseQuery(String query) {
  Logging::debug("Parsing " + query);
  RawQuery result;
  char *str = new char[query.length() + 1];
  strcpy(str, query.c_str());
  str[query.length()] = '\0';
  char * pch = strtok (str, " ");

  while (pch != NULL) {
    result.push_back(toString(pch));
    pch = strtok (NULL, " ");
  }

  free(str);

  return result;
}

#endif