#pragma once

#include "baseQuery.hpp"
#include "logging.hpp"
#include <memory>
#include <vector>

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
      return nullptr;
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