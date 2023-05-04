#pragma once

#include <future>

class Timer {
    bool clear = false;

public:
    template<typename Function>
    void setTimeout(Function function, int delay_ms) {
        this->clear = false;
        std::thread t([=]() {
            if(this->clear) return;
            std::this_thread::sleep_for(std::chrono::milliseconds(delay_ms));
            if(this->clear) return;
            function();
        });
        t.detach();
    }

    void stop() {
        this->clear = true;
    }
};