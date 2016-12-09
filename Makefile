git_version = $$(git branch 2>/dev/null | sed -e '/^[^*]/d'-e's/* \(.*\)/\1/')
npm_bin= $$(npm bin)

all: test
install:
	@npm install
test: install server
	$(npm_bin)/macaca run --verbose
server:
	$(npm_bin)/startserver -p 5678 -s &
.PHONY: test
