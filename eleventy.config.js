import pluginTOC from "eleventy-plugin-toc";
import { EleventyHtmlBasePlugin } from "@11ty/eleventy";

export default function (eleventyConfig) {
    eleventyConfig.setInputDirectory("src");
    eleventyConfig.setOutputDirectory("docs");
    eleventyConfig.addPassthroughCopy("./src/style.css");
    eleventyConfig.addPlugin(pluginTOC);
    eleventyConfig.addPlugin(EleventyHtmlBasePlugin);
    return {
        pathPrefix: "/tales-of-data-tables/"
    };
};