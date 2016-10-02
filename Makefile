
electron_version = 1.4.1

PATH := node_modules/.bin:$(PATH)

app_version = $(shell node -p "require('./package.json').version")
arch = $(shell uname -m)

.PHONY: all build clean default

default: $(arch)

all: x64 ia32

# 32-bit x86
i386: ia32
i686: ia32
ia32: electron_arch = ia32
ia32: flash_arch = x86-32
ia32: package_arch = x86_32
ia32: dist = $(package_arch)
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

build-%:
	@echo "Building $(dist)"
	rm -rf "$(dest)"
	@mkdir -pv "$(dest)" "$(dest)/PepperFlash"
	@cp -v scripts/launch.sh "$(dest)/"
	(scripts/build.js $(electron_arch) $(electron_version) && mv -v "build/electron-linux-$(electron_arch)" "$(dest)/electron") & scripts/get-flash.sh "$(dest)/PepperFlash" $(flash_arch) & wait
	@#cp -v "$(dest)/electron/resources/app.asar" "$(dest)/runner.asar"
	@echo $(app_version) > "$(dest)/version"
	@echo "Build finished $(dist)"

cleanbuild:
	rm -rf build

cleancache:
	rm -rf cache

clean: cleanbuild cleancache
