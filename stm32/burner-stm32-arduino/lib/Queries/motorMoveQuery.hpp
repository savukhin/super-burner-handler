#pragma once

#include "baseQuery.hpp"
#include "logging.hpp"
#include <memory>
#include <vector>

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