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
