#pragma once

#include "baseQuery.hpp"
#include "logging.hpp"
#include <memory>
#include <vector>

// 1 start
struct StartExperimentQuery : public BaseQuery {
  static std::shared_ptr<StartExperimentQuery> isStartExperimentQuery(RawQuery queries) {
    Logging::debug("Start checking is start experiment query");
    
    if (queries.size() != 2) {
      Logging::debug("Size not two: " + String(queries.size()));
      for (int i = 0; i < queries.size(); i++) {
        Logging::debug("Queries[" + String(i) + "] = '" + queries[i] + "'");
      }
      return nullptr;
    }

    auto id = toUInt(queries[0]);
    if (id == nullptr) {
      Logging::debug("First param not id: " + queries[0]);
      return nullptr;
    }

    if (queries[1] != "start") {
      Logging::debug("Second param not setint: " + queries[1]);
      return nullptr;
    }
    
    StartExperimentQuery result;
    result.valid = true;
    return std::make_shared<StartExperimentQuery>(result);
  }
};
