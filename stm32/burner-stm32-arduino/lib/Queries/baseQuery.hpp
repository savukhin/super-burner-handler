#pragma once
#include <Arduino.h>

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
