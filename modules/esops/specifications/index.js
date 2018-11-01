const test = require("tape");
const fs = require("fs-plus");
const path = require("path");
const rimraf = require("rimraf");
const R = require("ramda");
const esops = require("../source");

const MOCK_INFRASTRUCTURES = {
  basic: path.join(__dirname, "mocks/templates", "basic"),
  "pipe-me": path.join(__dirname, "mocks/templates", "pipe-me"),
  "target-web": path.join(__dirname, "mocks/templates", "target-web")
};

const MOCK_STACKS = {
  basic: path.join(__dirname, "mocks/stacks", "basic"),
  disallowed: path.join(__dirname, "mocks/stacks", "disallowed")
};

/**
 * Utilities
 */
const withTempFolder = callback => t => {
  const dirname = __dirname + "/.tmp/";
  if (!fs.existsSync(dirname)) fs.mkdirSync(dirname);
  callback({ t, dirname });
  rimraf.sync(dirname, fs);
};

const keyValueExists = (key, value, list) =>
  R.pipe(
    R.find(R.propEq(key, value)),
    R.isEmpty,
    R.not
  )(list);

/**
 * Specifications
 */

test("resolve stack manifest", t => {
  t.plan(1);
  const actual = esops.resolveStackCompose(MOCK_STACKS.basic);
  const expected = [
    "../../templates/basic",
    "../../templates/basic-with-package"
  ];
  t.deepEquals(actual, expected);
});

test("get list of paths from template directory", t => {
  t.plan(1);
  const templateDirectory = MOCK_INFRASTRUCTURES.basic;
  const actual = esops.getTemplatePaths(templateDirectory);
  const expected = [
    path.join(templateDirectory, ".vscode/settings.json"),
    path.join(templateDirectory, "src/stores/stores-architecture.md"),
    path.join(templateDirectory, "tsconfig.json")
  ];
  t.deepEqual(actual, expected);
});

test("create patch list from stack manifest", async t => {
  const expectedRelativePaths = [
    ".vscode/settings.json",
    "src/stores",
    "src/stores/stores-architecture.md",
    "tsconfig.json",
    ".eslintrc",
    ".vscode/settings.json",
    "package.json",
    "scripts/copy-files.js"
  ];
  t.plan(expectedRelativePaths.length);

  const stackConfig = esops.resolveStackCompose(MOCK_STACKS.basic);

  const actual = await esops.convertStackComposeToPatchList(
    stackConfig,
    MOCK_STACKS.basic
  );

  expectedRelativePaths.forEach(relativePath => {
    t.true(keyValueExists("relativePath", relativePath, actual));
  });
});

test("check for disallowed duplicate files", async t => {
  const tests = [[MOCK_STACKS.disallowed, false], [MOCK_STACKS.basic, true]];

  t.plan(tests.length);
  tests.forEach(async ([stack, expected], i) => {
    const stackConfig = esops.resolveStackCompose(stack);
    const patchList = await esops.convertStackComposeToPatchList(
      stackConfig,
      stack
    );
    const actual = esops.validatePatchList(patchList);
    t.equals(actual, expected, path.basename(stack));
  });
});

// test(
//   "test render",
//   withTempFolder(({ t, dirname }) => {
//     t.plan(1);
//     const infrastructureDirectory = MOCK_INFRASTRUCTURES.basic;
//     fs.copySync(infrastructureDirectory, dirname);
//     const props = {};
//     // const actual = esops.render(dirname, infrastructureDirectory, props);
//     t.equal(true, true);
//   })
// );
