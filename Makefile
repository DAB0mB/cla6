build:
	browserify core/cla6.js --standalone Cla6 > lib/cla6.js
	uglifyjs lib/cla6.js > lib/cla6.min.js

test:
	mocha "test/index.js" --timeout 2000 --reporter nyan

.PHONY: test