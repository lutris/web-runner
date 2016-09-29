
arch = $(shell uname -m)

.PHONY: all build clean default

default: $(arch)

all:
	node build ia32,x64

# 32-bit x86
i386: ia32
i686: ia32
ia32:
	node build ia32

# 64-bit x86
x86_64: x64
x64:
	node build x64

clean:
	rm -rf build cache
