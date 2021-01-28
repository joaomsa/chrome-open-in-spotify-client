.PHONY: clean build run dist

FILES = chrome.js spotify-link.js manifest.json chrome-background.html content.js open-in-client.svg

DIST_FILES = $(patsubst %,dist/chrome/%,$(FILES))


clean:
	@rm -rf dist/

build: dist
	cmd.exe /c web-ext build -s dist/chrome --overwrite-dest

run: dist
	cmd.exe /c web-ext run -s dist/chrome

dist: $(DIST_FILES)

dist/chrome/%: %
	@mkdir -p dist/chrome
	cp $* $@

fmt:
	npx standard --fix

develop:
	git config --local blame.ignoreRevsFile .ignored_revisions  # requires Git >= 2.23
	echo "#!/bin/bash\nnpx standard" > .git/hooks/pre-commit && chmod a+x .git/hooks/pre-commit
