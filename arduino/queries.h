#ifndef QUERIES_H
#define QUERIES_H

#include <optional>
#include <vector>

using RawQuery = std::vector<String>;

std::optional<int> toInt(String str) {
  if (str.length() == 0)
    return 0;

  int result = 0;
  bool wasMinus = false;

  if (str[0] == '-')
    wasMinus = true;

  for (int i = (wasMinus? 1 : 0); i < str.length(); i++) {
    if (str[i] > '9' || str[i] < '0') {
      return std::nullopt;
    }

    int num = str[i] - '0';

    result = result * 10. + num;
  }

  if (wasMinus)
    result = -result;
    
  return result;
}

std::optional<float> toFloat(String str) {
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
      return std::nullopt;
    }

    if (str[i] == '.' && !wasDot) {
      wasDot = true;
      continue;
    }

    if (str[i] > '9' || str[i] < '0') {
      return std::nullopt;
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

  return result;
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
};

struct MotorMoveQuery : public BaseQuery {
  float position; // in mm
  bool x_axis;

  static std::optional<MotorMoveQuery> isMotorMoveQuery(RawQuery queries) {
    if (queries.size() != 3) {
      Serial.println("Size not two: " + String(queries.size()));
      for (int i = 0; i < queries.size(); i++) {
        Serial.println("Queries[" + String(i) + "] = '" + queries[i] + "'");
      }
      return std::nullopt;
    }

    if (queries[0] != "motor-move") {
      Serial.println("First param no motor-move: " + queries[0]);
      return std::nullopt;
    }

    if (queries[1] != "x" && queries[1] != "y") {
      Serial.println("Second param: '" + queries[1] + "'");
      return std::nullopt;
    }
    
    auto position = toFloat(queries[2]);
    if (position == std::nullopt) {
      Serial.println("Third param: " + queries[2]);
      return std::nullopt;
    }

    MotorMoveQuery result;
    result.valid = true;
    result.x_axis = (queries[1][0] == 'x');
    result.position = position.value();
    return result;
  }
};

struct ReductorQuery : public BaseQuery {
  float open_percentage; // in percents [0; 100]
  int reductor_number;

  static std::optional<ReductorQuery> isReductorQuery(RawQuery queries) {
    if (queries.size() != 3) {
      Serial.println("Size not two: " + String(queries.size()));
      for (int i = 0; i < queries.size(); i++) {
        Serial.println("Queries[" + String(i) + "] = '" + queries[i] + "'");
      }
      return std::nullopt;
    }

    if (queries[0] != "reductor") {
      Serial.println("First param not reductor: " + queries[1]);
      return std::nullopt;
    }

    auto number = toInt(queries[1]);
    if (number == std::nullopt) {
      Serial.println("Second param: '" + queries[1] + "'");
      return std::nullopt;
    }
    
    auto percentage = toFloat(queries[2]);
    if (percentage == std::nullopt) {
      Serial.println("Third param: " + queries[2]);
      return std::nullopt;
    }

    Serial.println("params: " + queries[0] + " " + queries[1] + " " + queries[2]);
    Serial.println("decoded: " + queries[0] + " " + String(number.value()) + " " + String(percentage.value()));

    ReductorQuery result;
    result.valid = true;
    result.reductor_number = number.value();
    result.open_percentage = percentage.value();
    return result;
  }
};


RawQuery parseQuery(String query) {
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