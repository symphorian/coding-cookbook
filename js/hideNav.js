if (location.search) {
    const params = new URLSearchParams(location.search);
    if (params.get('hideNav') !== null) {
        const nav = document.querySelector("#background + nav");
        if (nav) {
            nav.classList.add("hide");
        }

        const title = document.querySelector("#title");
        if (title) {
            title.classList.add("hide");
        }
    }
}