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
          "/some/path"
        ]
      }
    }
  }
}
```

The following options are supported:

- *helperDirs*: Defines additional directories to be searched for helpers, if your templates reference helpers without relative paths.
