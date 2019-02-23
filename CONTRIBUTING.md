# Contributing

## Creating your changes

1. Fork, then clone the repo:

        `git clone git@github.com:your-username/barrelsby.git`

2. Install dependencies:

        `npm install`

3. Make your changes.

4. Make sure the tests pass:

        `npm test`

5. Push to your fork and [submit a pull request][pullrequest].

[pullrequest]: https://github.com/bencoveney/barrelsby/compare/

If you are developing on windows you may need to convert line endings to unix-style. You can do
this in git bash by running `find . -type f -exec dos2unix {} \;`.

## Requirements

If you are interested in contributing to barrelsby there are plenty of tagged issues that can be
picked up, or feel free to suggest your own feature in an issue.

Most coding conventions are enforced by TSLint but in general:
- Use small functions instead of classes.
- Avoid abreviated identifiers.
- Write a unit test (`fileName.test.ts`) for code changes.
- Write an integration test (`test/feature/`) for option changes.
