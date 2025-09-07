CXX = g++
CXXFLAGS = -std=c++17 -Wall -Wextra -O2
LIBS = -lcurl -lpthread

TARGET = vulnerability_scanner
SOURCE = vulnerability_scanner.cpp

all: $(TARGET)

$(TARGET): $(SOURCE)
	$(CXX) $(CXXFLAGS) -o $(TARGET) $(SOURCE) $(LIBS)

clean:
	rm -f $(TARGET) *.html

install-deps:
	# Ubuntu/Debian
	sudo apt-get update
	sudo apt-get install libcurl4-openssl-dev build-essential

.PHONY: all clean install-deps