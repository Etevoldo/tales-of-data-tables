import pluginTOC from "eleventy-plugin-toc";

export default function(eleventyConfig) {
    eleventyConfig.setInputDirectory("src");
    eleventyConfig.setOutputDirectory("docs");
    eleventyConfig.addPassthroughCopy("./src/style.css");
    eleventyConfig.addPlugin(pluginTOC);
};