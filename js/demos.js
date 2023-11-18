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
        recipeName: "divs-spans-and-flow",
        categories: "demo, week2, css, html",
        pageCount: 9,
        hasLocalProject: true,
    },
    {
        recipeName: "box-model",
        categories: "demo, week2, css",
        pageCount: 11,
        hasLocalProject: true,
    },
    {
        recipeName: "combining-selectors",
        categories: "demo, week2, css",
        pageCount: 11,
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
        recipeName: "two-column-flex-layouts",
        categories: "demo, week3, css",
        pageCount: 7,
        hasLocalProject: true,
    },
    {
        recipeName: "two-column-grid-layouts",
        categories: "demo, week3, css",
        pageCount: 9,
        hasLocalProject: true,
    },
    {
        recipeName: "three-column-grid-layouts",
        categories: "demo, week3, css",
        pageCount: 9,
        hasLocalProject: true,
    },
    {
        recipeName: "two-column-mixed-layouts",
        categories: "demo, week3, css",
        pageCount: 10,
        hasLocalProject: true,
    },
    {
        recipeName: "cards-and-buttons",
        categories: "demo, week4, css",
        pageCount: 11,
        hasLocalProject: true,
    },
    {
        recipeName: "heroes",
        categories: "demo, week4, css",
        pageCount: 9,
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
    {
        recipeName: "media-queries",
        categories: "demo, week5, css",
        pageCount: 13,
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
        label: "Week 1",
        value: "week1",
    },
    {
        label: "Week 2",
        value: "week2",
    },
    {
        label: "Week 3",
        value: "week3",
    },
    {
        label: "Week 4",
        value: "week4",
    },
    {
        label: "Week 5",
        value: "week5",
    },
    {
        label: "Week 6",
        value: "week6",
    },
    {
        label: "Week 8",
        value: "week8",
    },
];
const ROOT_RECIPE_FOLDER = "meal-prep";
const IS_DYNAMIC_LOAD = true;

// load cookbook.js immediately after this file