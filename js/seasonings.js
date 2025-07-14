/***********************************************************************
 * variables for dynamic content
 **********************************************************************/
const recipeNames = [];
const mealPrepRecipes = [
    {
        recipeName: "color",
        categories: "basic, text",
        pageCount: 1,
        hasLocalProject: false,
    },
    {
        recipeName: "background-color",
        categories: "basic, background",
        pageCount: 1,
        hasLocalProject: false,
    },
    {
        recipeName: "font-weight",
        categories: "basic, text",
        pageCount: 1,
        hasLocalProject: false,
    },
    {
        recipeName: "font-style",
        categories: "basic, text",
        pageCount: 1,
        hasLocalProject: false,
    },
    {
        recipeName: "font-size",
        categories: "basic, text",
        pageCount: 1,
        hasLocalProject: false,
    },
    {
        recipeName: "font-family",
        categories: "basic, text",
        pageCount: 1,
        hasLocalProject: false,
    },
    {
        recipeName: "text-align",
        categories: "basic, text",
        pageCount: 1,
        hasLocalProject: false,
    },
    {
        recipeName: "text-decoration",
        categories: "basic, text",
        pageCount: 1,
        hasLocalProject: false,
    },
    {
        recipeName: "display",
        categories: "basic, document-flow",
        pageCount: 1,
        hasLocalProject: false,
    },
    {
        recipeName: "box-shadow",
        categories: "intermediate, box-model",
        pageCount: 1,
        hasLocalProject: false,
    },
    {
        recipeName: "vertical-align",
        categories: "intermediate",
        pageCount: 1,
        hasLocalProject: false,
    },
    {
        recipeName: "border",
        categories: "basic, box-model",
        pageCount: 1,
        hasLocalProject: false,
    },
    {
        recipeName: "border-radius",
        categories: "basic, box-model",
        pageCount: 1,
        hasLocalProject: false,
    },
    {
        recipeName: "padding",
        categories: "basic, box-model",
        pageCount: 1,
        hasLocalProject: false,
    },
    {
        recipeName: "margin",
        categories: "basic, box-model",
        pageCount: 1,
        hasLocalProject: false,
    },
    {
        recipeName: "width",
        categories: "basic, box-model",
        pageCount: 1,
        hasLocalProject: false,
    },
    {
        recipeName: "opacity",
        categories: "intermediate",
        pageCount: 1,
        hasLocalProject: false,
    },
    {
        recipeName: "transform",
        categories: "advanced",
        pageCount: 1,
        hasLocalProject: false,
    },
    {
        recipeName: "linear-gradient",
        categories: "intermediate, background",
        pageCount: 1,
        hasLocalProject: false,
    },
    {
        recipeName: "radial-gradient",
        categories: "intermediate, background",
        pageCount: 1,
        hasLocalProject: false,
    },
    {
        recipeName: "list-style-type",
        categories: "basic, lists",
        pageCount: 1,
        hasLocalProject: false,
    },
    {
        recipeName: "display-flex",
        categories: "advanced, document-flow, layout-module, flexbox, container-property",
        pageCount: 1,
        hasLocalProject: false,
    },
    {
        recipeName: "flex-direction",
        categories: "advanced, document-flow, layout-module, flexbox, container-property",
        pageCount: 1,
        hasLocalProject: false,
    },
    {
        recipeName: "justify-content",
        categories: "advanced, document-flow, layout-module, flexbox, container-property",
        pageCount: 1,
        hasLocalProject: false,
    },
    {
        recipeName: "align-items",
        categories: "advanced, document-flow, layout-module, flexbox, container-property",
        pageCount: 1,
        hasLocalProject: false,
    },
    {
        recipeName: "flex-wrap",
        categories: "advanced, document-flow, layout-module, flexbox, container-property",
        pageCount: 1,
        hasLocalProject: false,
    },
    {
        recipeName: "order",
        categories: "advanced, document-flow, layout-module, flexbox, item-property",
        pageCount: 1,
        hasLocalProject: false,
    },
    {
        recipeName: "flex",
        categories: "advanced, document-flow, layout-module, flexbox, item-property",
        pageCount: 1,
        hasLocalProject: false,
    },
    {
        recipeName: "display-grid",
        categories: "advanced, document-flow, layout-module, grid, container-property",
        pageCount: 1,
        hasLocalProject: false,
    },
    {
        recipeName: "grid-template-columns",
        categories: "advanced, document-flow, layout-module, grid, container-property",
        pageCount: 1,
        hasLocalProject: false,
    },
    {
        recipeName: "grid-template-areas",
        categories: "advanced, document-flow, layout-module, grid, container-property",
        pageCount: 1,
        hasLocalProject: false,
    },
    {
        recipeName: "grid-area",
        categories: "advanced, document-flow, layout-module, grid, item-property",
        pageCount: 1,
        hasLocalProject: false,
    },
    {
        recipeName: "background-image",
        categories: "intermediate, background",
        pageCount: 1,
        hasLocalProject: false,
    },
    {
        recipeName: "background-size",
        categories: "intermediate, background",
        pageCount: 1,
        hasLocalProject: false,
    },
    {
        recipeName: "background-position",
        categories: "intermediate, background",
        pageCount: 1,
        hasLocalProject: false,
    },
];
const categories = [
    {
        label: "Basic",
        value: "basic",
    },
    {
        label: "Intermediate",
        value: "intermediate",
    },
    {
        label: "Advanced",
        value: "advanced",
    },
    {
        label: "Box Model",
        value: "box-model",
    },
    {
        label: "Text Related",
        value: "text",
    },
    {
        label: "Background Related",
        value: "background",
    },
    {
        label: "List Related",
        value: "lists",
    },
    {
        label: "Document Flow",
        value: "document-flow",
    },
    {
        label: "Flexbox",
        value: "flexbox",
    },
    {
        label: "Grid",
        value: "grid",
    },
    {
        label: "Container Properties",
        value: "container-property",
    },
    {
        label: "Item Properties",
        value: "item-property",
    },
];
const ROOT_RECIPE_FOLDER = "seasonings";
const IS_DYNAMIC_LOAD = true;

// load cookbook.js immediately after this file