import pluginTOC from "eleventy-plugin-toc";
import { EleventyHtmlBasePlugin } from "@11ty/eleventy";
import YAML from "yaml";
import { marked } from "marked";

export default function (eleventyConfig) {
    eleventyConfig.setInputDirectory("src");
    eleventyConfig.setOutputDirectory("docs");
    eleventyConfig.addPassthroughCopy("./src/style.css");
    eleventyConfig.addPlugin(pluginTOC);
    eleventyConfig.addDataExtension("yaml", (contents) => YAML.parse(contents));
    eleventyConfig.addFilter("markdown", (contents) => {
        if (!contents) return;
        return marked.parseInline(contents);
    });

    eleventyConfig.addPlugin(EleventyHtmlBasePlugin);
    return {
        pathPrefix: "/tales-of-data-tables/"
    };
};