IMVUJS
======
Next generation IMVU common JS library

## Pre-Commit Hooks

* JSHint must pass for all *.js files under src directory
* No tab allowed
* All tests must pass

The JSHint options live in `.jshintrc` at the root of this tree.

*Setup*: The `s/pull` script just copies `s/.githooks/pre-commit` to your `.git/hooks/` directory and assures it's executable.

If it's _absolutely urgent_ for you to bypass this hook, there are a couple of options: `git add --no-verify` is one, and `git commit -n` is the other. 

this is a test....