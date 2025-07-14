/***********************************************************************
 * variables for dynamic content
 **********************************************************************/
const recipeNames = [];
const mealPrepRecipes = [
    {
        recipeName: "headings",
        categories: "demo, week1, html",
        pageCount: 4,
        hasLocalProject: true,
    },
    {
        recipeName: "text-styling",
        categories: "demo, week1, html",
        pageCount: 8,
        hasLocalProject: true,
    },
    {
        recipeName: "basic-html-drills",
        categories: "drills, week1, html",
        pageCount: 8,
        hasLocalProject: true,
    },
    {
        recipeName: "lists",
        categories: "demo, week1, html",
        pageCount: 10,
        hasLocalProject: true,
    },
    {
        recipeName: "images",
        categories: "demo, week1, html",
        pageCount: 8,
        hasLocalProject: true,
    },
    {
        recipeName: "anchors",
        categories: "demo, week1, html",
        pageCount: 10,
        hasLocalProject: true,
    },
    {
        recipeName: "colors-and-text",
        categories: "demo, week2, css",
        pageCount: 11,
        hasLocalProject: true,
    },
    {
        recipeName: "basic-css-drills",
        categories: "drills, week2, css",
        pageCount: 15,
        hasLocalProject: true,
    },
    {
        recipeName: "divs-spans-and-flow",
        categories: "demo, week2, css, html",
        pageCount: 9,
        hasLocalProject: true,
    },
    {
        recipeName: "document-flow-drills",
        categories: "drills, week2, css",
        pageCount: 8,
        hasLocalProject: true,
    },
    {
        recipeName: "box-model",
        categories: "demo, week2, css",
        pageCount: 11,
        hasLocalProject: true,
    },
    {
        recipeName: "box-model-padding-drills",
        categories: "drills, week2, css",
        pageCount: 7,
        hasLocalProject: true,
    },
    {
        recipeName: "box-model-border-drills",
        categories: "drills, week2, css",
        pageCount: 9,
        hasLocalProject: true,
    },
    {
        recipeName: "box-model-margin-drills",
        categories: "drills, week2, css",
        pageCount: 9,
        hasLocalProject: true,
    },
    {
        recipeName: "combining-selectors",
        categories: "demo, week2, css",
        pageCount: 11,
        hasLocalProject: true,
    },
    {
        recipeName: "containers-selectors-drills",
        categories: "drills, week2, html, css",
        pageCount: 7,
        hasLocalProject: true,
    },
    {
        recipeName: "absolute-vs-relative-units",
        categories: "demo, week2, css",
        pageCount: 10,
        hasLocalProject: true,
    },
    {
        recipeName: "one-column-layouts",
        categories: "demo, week3, css",
        pageCount: 8,
        hasLocalProject: true,
    },
    {
        recipeName: "single-column-layouts-drills",
        categories: "drills, week3, css",
        pageCount: 7,
        hasLocalProject: true,
    },
    {
        recipeName: "two-column-flex-layouts",
        categories: "demo, week3, css",
        pageCount: 7,
        hasLocalProject: true,
    },
    {
        recipeName: "flexbox-drills",
        categories: "drills, week3, css",
        pageCount: 12,
        hasLocalProject: true,
    },
    {
        recipeName: "two-column-grid-layouts",
        categories: "demo, week3, css",
        pageCount: 9,
        hasLocalProject: true,
    },
    {
        recipeName: "grid-drills",
        categories: "drills, week3, css",
        pageCount: 8,
        hasLocalProject: true,
    },
    // {
    //     recipeName: "three-column-grid-layouts",
    //     categories: "demo, week3, css",
    //     pageCount: 9,
    //     hasLocalProject: true,
    // },
    {
        recipeName: "two-column-mixed-layouts",
        categories: "demo, week3, css",
        pageCount: 10,
        hasLocalProject: true,
    },
    {
        recipeName: "cards-and-buttons-v2",
        categories: "demo, week4, css",
        pageCount: 10,
        hasLocalProject: true,
    },
    {
        recipeName: "side-by-side",
        categories: "demo, week4, css",
        pageCount: 7,
        hasLocalProject: true,
    },
    {
        recipeName: "heroes-v2",
        categories: "demo, week4, css",
        pageCount: 10,
        hasLocalProject: true,
    },
    {
        recipeName: "galleries",
        categories: "demo, week4, css",
        pageCount: 8,
        hasLocalProject: true,
    },
    {
        recipeName: "navbars-basic",
        categories: "demo, week5, css",
        pageCount: 12,
        hasLocalProject: true,
    },
    {
        recipeName: "media-queries-v4",
        categories: "demo, week5, css",
        pageCount: 11,
        hasLocalProject: true,
    },
    {
        recipeName: "dropdown-prep",
        categories: "demo, week5, css",
        pageCount: 16,
        hasLocalProject: true,
    },
    {
        recipeName: "dropdown-nav",
        categories: "demo, week5, css",
        pageCount: 10,
        hasLocalProject: true,
    },
];
const categories = [
    {
        label: "HTML",
        value: "html",
    },
    {
        label: "CSS",
        value: "css",
    },
    {
        label: "Demos",
        value: "demo",
    },
    {
        label: "Drills",
        value: "drills",
    },
    {
        label: "Session 1",
        value: "week1",
    },
    {
        label: "Session 2",
        value: "week2",
    },
    {
        label: "Session 3",
        value: "week3",
    },
    {
        label: "Session 4",
        value: "week4",
    },
    {
        label: "Session 5",
        value: "week5",
    },
];
const ROOT_RECIPE_FOLDER = "meal-prep";
const IS_DYNAMIC_LOAD = true;

// load cookbook.js immediately after this file