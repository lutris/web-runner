
electron_version = 1.4.1

PATH := node_modules/.bin:$(PATH)

app_version = $(shell node -p "require('./package.json').version")
arch = $(shell uname -m)
dest = build/electron-$(app_version)-$(arch)

.PHONY: all build clean default

default: $(arch)

all: x64 ia32

# 32-bit x86
i386: ia32
i686: ia32
ia32: electron_arch = ia32
ia32: dest = build/electron-$(app_version)-$(electron_arch)
ia32: build-ia32

# 64-bit x86
x86_64: x64
x64: electron_arch = x64
x64: dest = build/electron-$(app_version)-$(electron_arch)
x64: build-x64

build-%:
	@echo "Building electron-$(app_version)-$(electron_arch)"
	@rm -rf build/electron-$(app_version)-$(electron_arch)
	@node build $(electron_arch) $(electron_version)
	@mv build/electron-linux-$(electron_arch) build/electron-$(app_version)-$(electron_arch)
	@cp build/electron-$(app_version)-$(electron_arch)/resources/app.asar build/electron-$(app_version)-$(electron_arch).asar
	@echo "Built electron-$(app_version)-$(electron_arch)"

cleanbuild:
	rm -rf build

cleancache:
	rm -rf cache

clean: cleanbuild cleancache
