/***********************************************************************
 * variables for dynamic content
 **********************************************************************/
const recipeNames = [];
const mealPrepRecipes = [
    {
        recipeName: "headings",
        categories: "text, block",
        pageCount: 1,
        hasLocalProject: false,
    },
    {
        recipeName: "paragraphs",
        categories: "text, block",
        pageCount: 1,
        hasLocalProject: false,
    },
    {
        recipeName: "bolds",
        categories: "styling, inline",
        pageCount: 1,
        hasLocalProject: false,
    },
    {
        recipeName: "italics",
        categories: "styling, inline",
        pageCount: 1,
        hasLocalProject: false,
    },
    {
        recipeName: "superscripts",
        categories: "styling, inline",
        pageCount: 1,
        hasLocalProject: false,
    },
    {
        recipeName: "subscripts",
        categories: "styling, inline",
        pageCount: 1,
        hasLocalProject: false,
    },
    {
        recipeName: "br",
        categories: "miscellaneous, block",
        pageCount: 1,
        hasLocalProject: false,
    },
    {
        recipeName: "horizontalRules",
        categories: "miscellaneous, block",
        pageCount: 1,
        hasLocalProject: false,
    },
    {
        recipeName: "orderedLists",
        categories: "text, lists, containers, block",
        pageCount: 1,
        hasLocalProject: false,
    },
    {
        recipeName: "unorderedLists",
        categories: "text, lists, containers, block",
        pageCount: 1,
        hasLocalProject: false,
    },
    {
        recipeName: "images",
        categories: "media, inline",
        pageCount: 1,
        hasLocalProject: false,
    },
    {
        recipeName: "anchors",
        categories: "content, navigation, inline",
        pageCount: 1,
        hasLocalProject: false,
    },
    {
        recipeName: "anchors-external",
        categories: "content, navigation, inline",
        pageCount: 1,
        hasLocalProject: false,
    },
    {
        recipeName: "anchors-internal",
        categories: "content, navigation, inline",
        pageCount: 1,
        hasLocalProject: false,
    },
    {
        recipeName: "divs",
        categories: "containers, block",
        pageCount: 1,
        hasLocalProject: false,
    },
    {
        recipeName: "spans",
        categories: "containers, inline",
        pageCount: 1,
        hasLocalProject: false,
    },
    {
        recipeName: "icon-library",
        categories: "media, external-libraries, inline",
        pageCount: 1,
        hasLocalProject: false,
    },
    {
        recipeName: "audio",
        categories: "media, inline",
        pageCount: 1,
        hasLocalProject: false,
    },
    {
        recipeName: "video",
        categories: "media, inline",
        pageCount: 1,
        hasLocalProject: false,
    },
];
const categories = [
    {
        label: "Block",
        value: "block",
    },
    {
        label: "Inline",
        value: "inline",
    },
    {
        label: "Text",
        value: "text",
    },
    {
        label: "Media",
        value: "media",
    },
    {
        label: "Navigation",
        value: "navigation",
    },
    {
        label: "Containers",
        value: "containers",
    },
    {
        label: "Lists",
        value: "lists",
    },
    {
        label: "Styling",
        value: "styling",
    },
    {
        label: "External Libraries",
        value: "external-libraries",
    },
    {
        label: "Miscellaneous",
        value: "miscellaneous",
    },
];
const ROOT_RECIPE_FOLDER = "ingredients";
const IS_DYNAMIC_LOAD = true;

// load cookbook.js immediately after this file