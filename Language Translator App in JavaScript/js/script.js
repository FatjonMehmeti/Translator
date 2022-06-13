const fromText = document.querySelector(".from-text"),                  //make a query for a from text, for the language we will be inputting
toText = document.querySelector(".to-text"),                            //make a query for a to text, for the language we will output
exchageIcon = document.querySelector(".exchange"),                      //makes a pretty icon for flipping the languages
selectTag = document.querySelectorAll("select"),                        //makes a sekector tag
icons = document.querySelectorAll(".row i");                            //makes use for icons necessary
translateBtn = document.querySelector("button"),                        //the translate button

selectTag.forEach((tag, id) => {
    for (let country_code in countries) {
        let selected = id == 0 ? country_code == "en-GB" ? "selected" : "" : country_code == "it-IT" ? "selected" : "";
        let option = `<option ${selected} value="${country_code}">${countries[country_code]}</option>`;
        tag.insertAdjacentHTML("beforeend", option);
    }
});                                                                     //this constantly checks for country codes. it is a type of pre-listener function that looks and confirms changes

exchageIcon.addEventListener("click", () => {
    let tempText = fromText.value,
    tempLang = selectTag[0].value;
    fromText.value = toText.value;
    toText.value = tempText;
    selectTag[0].value = selectTag[1].value;
    selectTag[1].value = tempLang;
});                                                                    //this is a listener. it listens for a click on the flip button, it flips the languages

fromText.addEventListener("keyup", () => {
    if(!fromText.value) {
        toText.value = "";
    }
});                                                                     //listens for empty values and then prints a response of an empty value

translateBtn.addEventListener("click", () => {
    let text = fromText.value.trim(),
    translateFrom = selectTag[0].value,
    translateTo = selectTag[1].value;
    if(!text) return;                                                                                                               //returns no value instantly if translate button clicked with no input
    toText.setAttribute("placeholder", "Translating...");                                                                           //placeholder as we wait for translation
    let apiUrl = `https://api.mymemory.translated.net/get?q=${text}&langpair=${translateFrom}|${translateTo}`;                      //translation API
    fetch(apiUrl).then(res => res.json()).then(data => {                                                                            //double checks the translation
        toText.value = data.responseData.translatedText;
        data.matches.forEach(data => {
            if(data.id === 0) {
                toText.value = data.translation;
            }
        });
        toText.setAttribute("placeholder", "Translation");                                                                          //placeholder
    });
});                                                                       //listens for clicks of the translate button and processes translation through the API

icons.forEach(icon => {
    icon.addEventListener("click", ({target}) => {
        if(!fromText.value || !toText.value) return;
        if(target.classList.contains("fa-copy")) {
            if(target.id == "from") {
                navigator.clipboard.writeText(fromText.value);
            } else {
                navigator.clipboard.writeText(toText.value);
            }                                                               //creates an instance of a copy of either the translation or the original text
        } else {
            let utterance;
            if(target.id == "from") {
                utterance = new SpeechSynthesisUtterance(fromText.value);
                utterance.lang = selectTag[0].value;
            } else {
                utterance = new SpeechSynthesisUtterance(toText.value);
                utterance.lang = selectTag[1].value;
            }
            speechSynthesis.speak(utterance);
        }                                                                   //allows us to create an utterance for the function, such that it reads our translation
    });
});                                                                         //enables functionality for both types of buttons