#pragma once

#include "baseQuery.hpp"
#include "logging.hpp"
#include <memory>
#include <vector>


// 5 ignite 1
// 5 ignite 0
struct IgniteQuery : public BaseQuery {
  float turnOn = false; // 1 = turnOn, 0 = turnOff

  static std::shared_ptr<IgniteQuery> isIgniteQuery(RawQuery queries) {
    Logging::debug("Start checking is ignite query");
    
    if (queries.size() != 3) {
      Logging::debug("Size not three: " + String(queries.size()));
      for (int i = 0; i < queries.size(); i++) {
        Logging::debug("Queries[" + String(i) + "] = '" + queries[i] + "'");
      }
      return nullptr;
    }

    auto id = toUInt(queries[0]);
    if (id == nullptr) {
      Logging::debug("First param: " + queries[0]);
      return nullptr;
    }

    auto flag = toUInt(queries[2]);
    if (flag == nullptr || (*flag != 1 && *flag != 0)) {
      Logging::debug("Third param: " + queries[2] + " *flag =" + String(*flag));
      return nullptr;
    }


    IgniteQuery result;
    result.valid = true;
    result.turnOn = (*flag == 1);
    result.id = *id;

    return std::make_shared<IgniteQuery>(result);
  }
};
