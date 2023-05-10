#pragma once

#include "baseQuery.hpp"
#include "logging.hpp"
#include <memory>
#include <vector>

// 1 calibrate-xy-motors
struct CalibrateXYMotorsQuery : public BaseQuery {
  static std::shared_ptr<CalibrateXYMotorsQuery> isCalibrateQuery(RawQuery queries) {
    Logging::debug("Start checking is calibrate query");
    
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