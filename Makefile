
electron_version = 4.2.12

PATH := node_modules/.bin:$(PATH)

app_version = $(shell node -p "require('./package.json').version")
arch = $(shell uname -m)

.PHONY: all build clean default

default: $(arch)

all: x64 armv7l

# 32-bit x86
i386: ia32
i686: ia32
ia32: electron_arch = ia32
ia32: flash_arch = x86-32
ia32: package_arch = x86_32
ia32: dist = web-$(package_arch)
ia32: dest = build/$(dist)
ia32: build-x86_32

# 64-bit x86
x86_64: x64
x64: electron_arch = x64
x64: flash_arch = x86-64
x64: package_arch = x86_64
x64: dist = web-$(package_arch)
x64: dest = build/$(dist)
x64: build-x86_64

# armv7l
armv7h: armv7l
armv7: armv7l
armv7l: electron_arch = armv7l
armv7l: flash_arch =
armv7l: package_arch = armv7
armv7l: dist = web-$(package_arch)
armv7l: dest = build/$(dist)
armv7l: build-armv7l

build-%:
	@echo "Building $(dist)"
	rm -rf "$(dest)"
	@mkdir -pv "$(dest)"
	@cp -v scripts/launch.sh "$(dest)/"
	scripts/build.js $(electron_arch) $(electron_version) && mv -v "build/electron-linux-$(electron_arch)" "$(dest)/electron"

	@# check if flash_arch is set
	@if [ "$(flash_arch)" != "" ]; then\
		mkdir -pv "$(dest)/PepperFlash";\
		scripts/get-flash.sh "$(dest)/PepperFlash" $(flash_arch);\
		bspatch "$(dest)/PepperFlash/libpepflashplayer.so" "$(dest)/PepperFlash/libpepflashplayer.so" scripts/flash_untimebomb.patch;\
	fi

	@#cp -v "$(dest)/electron/resources/app.asar" "$(dest)/runner.asar"
	@echo $(app_version) > "$(dest)/version"
	@echo "Build finished $(dist)"

cleanbuild:
	rm -rf build

cleancache:
	rm -rf cache

clean: cleanbuild cleancache
