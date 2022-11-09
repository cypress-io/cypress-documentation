// Original: Material Oceanic (by https://github.com/dutchenkoOleg)
// https://github.com/PrismJS/prism-themes/blob/master/themes/prism-material-oceanic.css

var theme = {
  plain: {
    color: "#c3cee3",
    backgroundColor: "#282A36"
  },
  styles: [{
    types: ["namespace"],
    style: {
      opacity: 0.7,
    }
  }, {
    types: ["atrule", "function", "boolean", "constant", "id", "symbol"],
    style: {
      color: "#c792ea"
    }
  }, {
    types: ["attr-name", "builtin", "class"],
    style: {
      color: "#ffcb6b"
    }
  }, {
    types: ["attr-value", "attribute", "pseudo-class", "pseudo-element", "string"],
    style: {
      color: "#c3e88d"
    }
  }, {
    types: ["cdata", "char", "inserted", "property"],
    style: {
      color: "#80cbc4"
    }
  }, {
    types: ["class-name", "color", "hexcode", "regex"],
    style: {
      color: "#f2ff00"
    }
  }, {
    types: ["comment", "doctype", "prolog"],
    style: {
      color: "#546e7a"
    }
  }, {
    types: ["deleted", "entity", "selector", "tag", "unit", "variable"],
    style: {
      color: "#f07178"
    }
  }, {
    types: ["important"],
    style: {
      color: "#c792ea",
      fontWeight: "bold"
    }
  }, {
    types: ["keyword"],
    style: {
      color: "#c792ea",
      fontStyle: "italic"
    }
  }, {
    types: ["number", "url"],
    style: {
      color: "#fd9170"
    }
  }, {
    types: ["operator", "punctuation"],
    style: {
      color: "#89ddff"
    }
  }]
};

export default theme;
