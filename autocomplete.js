const createAutoComplete = ({
    root,
    renderOption,
    onOptionSelect,
    inputValue,
    fetchData
}) => {
    root.innerHTML = `
    <label><b>search for a movie</b></label>
    <input class='input' type="text">
    <div class="dropdown">
      <div class="dropdown-menu">
        <div class="dropdown-content results"></div>
      </div>
    </div>
    
    `;

    const input = root.querySelector("input");
    const dropdown = root.querySelector(".dropdown");
    const resultsWrapper = root.querySelector(".results");

    const onInput = async e => {
        const items = await fetchData(e.target.value);
        if (!items.length) {
            // dropdown.innerHTML = '';
            dropdown.classList.remove("is-active");
            return;
        }

        resultsWrapper.innerHTML = "";
        dropdown.classList.add("is-active");
        for (let item of items) {

            let option = document.createElement("a");
            option.innerHTML = renderOption(item);
            option.classList.add("dropdown-item");
            option.addEventListener("click", () => {
                dropdown.classList.remove("is-active");
                input.value = inputValue(item);
                onOptionSelect(item);
            });
            resultsWrapper.append(option);
        }
    };

    input.addEventListener("input", debounce(onInput));

    document.addEventListener("click", event => {
        if (!root.contains(event.target)) {
            dropdown.classList.remove("is-active");
        }
    });
}





// 1. we are going to fix things with the root
// 2. fixing the render each option in the dropdown menu
// 3. on option select
// we add fetch data function to the arg of the autocomplete because of being maintainable