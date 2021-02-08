# handlebars-jest

Jest Handlebars transformer

## Usage

```bash
npm install --save-dev handlebars-jest
```

## Setup

To define handlebars-jest as a transformer for your .hbs files, you need to map .hbs files to the handlebars-jest module.

```json
{
  "jest": {
    "transform": {
      "^.+\\.hbs$": "<rootDir>/node_modules/handlebars-jest"
    }
}
```

## Additional options

Configure the transformer in a `handlebars-jest` property in your Jest config's globals.


```json
{
  "jest": {
    "transform": {
      "^.+\\.hbs$": "handlebars-jest"
    },
    "globals": {
      "handlebars-jest": {
        "helperDirs": [
          "/some/absolute/path/to/helpers",
          "<rootDir>/another/helpers/path"
        ],
        "helperExtensions": [
          ".js",
          ".mjs"
        ],
        "partialDirs": [
          "/some/absolute/path/to/partials",
          "<rootDir>/another/partials/path"
        ],
        "partialExtensions": [
          ".hbs",
          ".html"
        ]
      }
    }
  }
}
```

The following options are supported:

- *helperDirs*: Defines directories to be searched for helpers.
- *helperExtensions*: Defines valid filename extensions for helpers. Default is `['.js']`.
- *partialDirs*: Defines directories to be searched for partials.
- *partialExtensions*: Defines valid filename extensions for partials. Default is `['.hbs', '.handlebars']`.
