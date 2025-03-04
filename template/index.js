import nunjucks from "nunjucks";

nunjucks.configure({ autoescape: true }); // ✅ Configure once globally

const activeSubscriptions = new Map(); // ✅ Track active state subscriptions

export let render_fragment = (fragmentWrapperId, stateBindings = {}, staticData = {}) => {
    const fragmentWrapper = document.getElementById(fragmentWrapperId);
    if (!fragmentWrapper) {
        console.warn(`reactive_fragment: No element found with ID "${fragmentWrapperId}"`);
        return;
    }

    const template = fragmentWrapper.innerHTML;


    refresh_fragment(fragmentWrapperId, template, stateBindings, staticData);
}

export let refresh_fragment = (fragmentWrapperId, template, stateBindings = {}, staticData = {}) => {

    function update(value = null, old = null) {
        const fragmentWrapper = document.getElementById(fragmentWrapperId);
        if (!fragmentWrapper) {
            console.warn(`render_template: No element found with ID "${fragmentWrapperId}"`);
            return;
        }
        
        const renderData = Object.assign({},
            Object.fromEntries(Object.entries(staticData).map((key, value) => [key, value]) ),
            Object.fromEntries(Object.entries(stateBindings).map(([key, store]) => [key, store.get()]) )
        );


        const renderedTemplate = nunjucks.renderString(template, renderData);

        fragmentWrapper.innerHTML = renderedTemplate;
        console.table("post subscribe",activeSubscriptions);
    }

    if (activeSubscriptions.has(fragmentWrapperId)) {
        Object.values(stateBindings).map((store) => console.log("found",store.lc));
        activeSubscriptions.get(fragmentWrapperId).forEach(removeListen => removeListen());
        Object.values(stateBindings).map((store) => console.log("found",store.lc));
    }

    const unlisFnArray = Object.values(stateBindings).map((store) => store.listen(update));
    activeSubscriptions.set(fragmentWrapperId, unlisFnArray);
    update(); // ✅ Initial render
}