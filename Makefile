browserify:
	browserify client/index.js -o client/cla6.js
	uglifyjs client/cla6.js > client/cla6.min.js

test:
	mocha "test/index.js" --timeout 2000 --reporter nyan

.PHONY: test