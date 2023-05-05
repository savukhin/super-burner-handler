#pragma once

#include "baseQuery.hpp"
#include "logging.hpp"
#include <memory>
#include <vector>

// 1 setfloat varname 100
struct SetFloatVarQuery : public BaseQuery {
  String variable = "";
  float value = 0;

  static std::shared_ptr<SetFloatVarQuery> isSetFloatVarQuery(RawQuery queries) {
    Logging::debug("Start checking is motor move query");
    
    if (queries.size() != 4) {
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

    if (queries[1] != "setfloat") {
      Logging::debug("Second param not setfloat: " + queries[1]);
      return nullptr;
    }

    auto value = toFloat(queries[3]);
    if (value == nullptr) {
      Logging::debug("Fourth param not int'" + queries[3] + "'");
      return nullptr;
    }
    
    SetFloatVarQuery result;
    result.valid = true;
    result.id = *id;
    result.variable = queries[1];
    result.value = *value;
    return std::make_shared<SetFloatVarQuery>(result);
  }
};