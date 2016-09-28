
PATH := node_modules/.bin:$(PATH)

arch = ia32,x64
platform = linux
electron_version=1.4.1


.PHONY: all build clean

all: build

build: clean
	electron-packager app --out build --version=$(electron_version) --platform=$(platform) --arch=$(arch) --overwrite
	tar -zcf build/electron-runner-linux-x64.tar.gz -C build/electron-runner-linux-x64 .
	tar -zcf build/electron-runner-linux-ia32.tar.gz -C build/electron-runner-linux-ia32 .


clean:
	rm -rf build
