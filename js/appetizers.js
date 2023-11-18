/***********************************************************************
 * variables for dynamic content
 **********************************************************************/
const recipeNames = [];
const mealPrepRecipes = [
    {
        recipeName: "web-dev-startup",
        categories: "setup",
        pageCount: 1,
        hasLocalProject: false,
    },
    {
        recipeName: "previewing-code-basic",
        categories: "vs-code",
        pageCount: 1,
        hasLocalProject: false,
    },
    {
        recipeName: "adding-a-code-ruler",
        categories: "vs-code",
        pageCount: 1,
        hasLocalProject: false,
    },
    {
        recipeName: "importing-template-to-repository",
        categories: "setup",
        pageCount: 1,
        hasLocalProject: false,
    },
    {
        recipeName: "rearranging-your-workspace",
        categories: "vs-code, video",
        pageCount: 1,
        hasLocalProject: false,
    },
    {
        recipeName: "linking-html-and-css",
        categories: "coding",
        pageCount: 1,
        hasLocalProject: false,
    },
    {
        recipeName: "identifying-boxes",
        categories: "design",
        pageCount: 1,
        hasLocalProject: false,
    },
    {
        recipeName: "utilizing-google-fonts",
        categories: "design, external-resource",
        pageCount: 1,
        hasLocalProject: false,
    },
    {
        recipeName: "pantheon-wordpress-setup",
        categories: "setup, wordpress",
        pageCount: 1,
        hasLocalProject: false,
    },
    {
        recipeName: "creating-a-post",
        categories: "wordpress",
        pageCount: 1,
        hasLocalProject: false,
    },
    {
        recipeName: "setting-a-featured-image",
        categories: "wordpress",
        pageCount: 1,
        hasLocalProject: false,
    },
    {
        recipeName: "adding-a-menu-wordpress",
        categories: "wordpress, video",
        pageCount: 1,
        hasLocalProject: false,
    },
    {
        recipeName: "adding-custom-css-wordpress",
        categories: "wordpress, design, video",
        pageCount: 1,
        hasLocalProject: false,
    },
    {
        recipeName: "backup-wordpress",
        categories: "wordpress",
        pageCount: 1,
        hasLocalProject: false,
    },
    {
        recipeName: "relabeling-default-home-link",
        categories: "wordpress, video",
        pageCount: 1,
        hasLocalProject: false,
    },
    {
        recipeName: "making-a-functional-form-getform-io",
        categories: "coding, external-resource",
        pageCount: 1,
        hasLocalProject: false,
    },
];
const categories = [
    {
        label: "Setup",
        value: "setup",
    },
    {
        label: "Visual Studio Code",
        value: "vs-code",
    },
    {
        label: "WordPress",
        value: "wordpress",
    },
    {
        label: "Coding",
        value: "coding",
    },
    {
        label: "Design",
        value: "design",
    },
    {
        label: "External Resources",
        value: "external-resource",
    },
    {
        label: "Video Tutorials",
        value: "video",
    },
];
const ROOT_RECIPE_FOLDER = "appetizers";
const IS_DYNAMIC_LOAD = false;

// load cookbook.js immediately after this file