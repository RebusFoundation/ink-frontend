import createDOMPurify from "dompurify/dist/purify.es.js";
import { JSDOM } from "jsdom";
import { testProp } from "./allowed-css-props.js";

const purifyConfig = {
  KEEP_CONTENT: false,
  IN_PLACE: true,
  WHOLE_DOCUMENT: true,
  ALLOW_TAGS: ["reader-highlight"],
  FORBID_TAGS: ["meta", "form", "title", "link"],
  FORBID_ATTR: ["srcset", "action", "background", "poster"]
};

export async function cleanCSS(text, url) {
  const resourceURL = new URL(url);
  const dom = new JSDOM(
    `<html><head><style>${text}</style></head><body></body></html>`,
    {
      contentType: "text/html"
    }
  );
  const window = dom.window;
  const DOMPurify = createDOMPurify(window);
  // Based on sample from https://github.com/cure53/DOMPurify/tree/master/demos, same license as DOMPurify

  // const regex = /(url\("?)(?!data:)/gim;
  // function replacer(match, p1) {
  //   try {
  //     const url = new URL(p1, window.location);
  //     if (url.host === window.location.host) {
  //       return p1;
  //     } else {
  //       return "";
  //     }
  //   } catch (err) {
  //     console.error(err);
  //     return "";
  //   }
  // }
  function processURL(prop) {
    const href = /url\("?([^)|"]+)(?!data:)/gim.exec(prop)[1];
    const propURL = new URL(href, resourceURL);
    if (
      propURL.host === resourceURL.host &&
      propURL.protocol === resourceURL.protocol
    ) {
      return `url("${href}")`;
    } else {
      return null;
    }
  }

  function addStyles(output, styles) {
    for (var prop = styles.length - 1; prop >= 0; prop--) {
      // if (styles[styles[prop]]) {
      //   var url = styles[styles[prop]].replace(regex, replacer);
      //   styles[styles[prop]] = url;
      // }
      const regex = /url\("?([^)|"]+)(?!data:)/gim;
      if (styles[styles[prop]] && regex.test(styles[styles[prop]])) {
        var url = processURL(styles[styles[prop]]);
        styles[styles[prop]] = url;
      }
      if (
        styles[styles[prop]] &&
        typeof styles[styles[prop]] === "string" &&
        testProp(styles[prop], styles[styles[prop]])
      ) {
        output.push(styles[prop] + ":" + styles[styles[prop]] + ";");
      }
    }
  }

  function addCSSRules(output, cssRules) {
    for (var index = cssRules.length - 1; index >= 0; index--) {
      var rule = cssRules[index];
      // check for rules with selector
      if (rule.type === 1 && rule.selectorText) {
        output.push(rule.selectorText + "{");
        if (rule.style) {
          addStyles(output, rule.style);
        }
        output.push("}");
      }
    }
  }

  DOMPurify.addHook("uponSanitizeElement", function(node, data) {
    if (data.tagName === "style") {
      var output = [];
      addCSSRules(output, node.sheet.cssRules);
      node.textContent = output.join("\n");
    }
  });
  const clean = DOMPurify.sanitize(
    window.document.documentElement,
    purifyConfig
  );
  return clean.querySelector("style").textContent;
}
