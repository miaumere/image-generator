let imagePath = "../img/"
let imgArrayPath = "./api/img-array.php"
let customImg = "./api/custom-img.php"

const defaultHeight = document.querySelector('input[name="height"]').value
const defaultWidth = document.querySelector('input[name="width"]').value
const defaultColor = document.querySelector('input[name="color"]').value
const iconStatus = document.querySelector("#status");
const iconStatusText = document.querySelector("#status-info");
let select = document.querySelector("#iconList")
let selectedIcon = document.querySelector("#selected-icon")
const imageURL = document.querySelector("#img-url")
let URLElement = document.querySelector("#img-link")
const previewImg = document.querySelector("#preview-img")


iconStatusText.textContent = "Nie wybrano pliku.";

function createSelect(optionValue, isDisabled, forWhat) {
    // Generowanie <option>
    let option = document.createElement("option")

    // Path ikonki
    let optionValueToAdd = "";

    switch(forWhat) {
        case 'usersImages': 
        optionValueToAdd = 'user-img';
        
        break; 
        case 'nativeImages': 
        optionValueToAdd = 'img';

        break;
        default:

    }

    const imgOutput = `./${optionValueToAdd}/${optionValue}`;
    option.setAttribute("value", imgOutput)

    option.textContent = optionValue;


    if(isDisabled === true){
        option.setAttribute("disabled", "true")
        option.setAttribute("selected", "true")
    }
    select.appendChild(option)
}


let previewValues = {
    fileName: './api/image-generator.php',
    height: defaultHeight,
    width: defaultWidth,
    text: '',
    color: defaultColor,
    icon: '',
}


let selectLoad = document.querySelector("#loading")
selectLoad.textContent = "Trwa ładowanie ikonek..."

function getIconList() {
    let xhr = new XMLHttpRequest();
    xhr.open("GET", imgArrayPath, true);

    xhr.addEventListener('load', (e) => {
        const responseObj = e.target;

        selectLoad.textContent = "Wybierz ikonkę:"
        if (responseObj.readyState === 4) {
            // Kiedy wszystko dziala poprawnie:
            let response;
            try {
                const parsedResponse = JSON.parse(responseObj.response)
                response = parsedResponse;
            } catch (error) {
                // Błąd na back endzie:
                console.error("Wystąpił błąd parsowania danych.");
            }

            if (response) {
                //Dodawanie <option> do <select>




                select.textContent = "";

                createSelect("-----", true)


                let usersImages = response['userImages'];
                let nativeImages = response['nativeImages'];

                console.log(usersImages)
                console.log(nativeImages)


                if(Array.isArray(usersImages) && Array.isArray(nativeImages)) {

           
    
                    for (let i = 0; i < nativeImages.length; i++) {
    
                        createSelect(nativeImages[i], false, "nativeImages")
    
                    }
    
                    for (let i = 0; i < usersImages.length; i++) {

                        createSelect(usersImages[i], false, "usersImages" )
    
                    }
                }



                // Dodawanie domyślnego obrazka przed utworzeniem preview:
                let preview = document.querySelector("#preview")
                let allInputs = document.querySelectorAll("input[name], textarea[name], select")

                for (const input of allInputs) {
                    input.addEventListener('input', (e) => {
                        // Update obiektu previewValues o wartości z inputów
                        switch (e.target.name) {
                            case "height":
                                previewValues.height = e.target.value
                                break;

                            case "width":
                                previewValues.width = e.target.value
                                break;

                            case "text":
                                previewValues.text = e.target.value
                                break;

                            case "color":
                                previewValues.color = e.target.value
                                break;

                            case "icon":
                                previewValues.icon = e.target.value
                                break;

                            case "image":
                                // Wysyłanie REST do back-endu:
                                let fileToSend = e.target.files[0];
                                let iconRequest = new XMLHttpRequest();

                                
                                iconRequest.open("POST", customImg, true);
                                iconRequest.onreadystatechange = () => {
                                    if (iconRequest.readyState == 4) {

                                        if (iconRequest.status >= 200 && iconRequest.status < 300) {                                            
                                            iconStatusText.classList.add("status__text--success")
                                            iconStatusText.textContent = "Udało się przesłać obrazek!"
                                            // Dodawanie ikonki do listy
                                            getIconList();

                                        }
                                    }  else {
                                        iconStatusText.classList.remove("status__text--success")
                                        iconStatusText.classList.add("status__text--error")
                                        iconStatusText.textContent = "Wybierz plik o odpowiednim rozszerzeniu!"
                                    }
                                }

                                let formData = new FormData();
                                formData.append("image", fileToSend);
                                iconRequest.send(formData);


                                iconStatus.appendChild(iconStatusText);
                                // Tworzenie BLOB:
                       
                                let iconBlob = new Blob([fileToSend], {type: "image/png"});
                                let blobURL = URL.createObjectURL(iconBlob);

                                previewImg.setAttribute('src', blobURL)

                                break;

                            default:
                                console.warn("Brak obslugi dla inputa ", e.target.name)
                                return;
                        }
                        let link = `${previewValues.fileName}?height=${previewValues.height}&width=${previewValues.width}&text=${previewValues.text}&color=${encodeURIComponent(previewValues.color)}&icon=${previewValues.icon}`

                        // Nowy src dodany do obrazka:
                        preview.setAttribute("src", link)
                        selectedIcon.setAttribute("src", previewValues.icon)

                    })
                }


            }
        }
    });

    xhr.send();
}
getIconList();                        




console.log = () => {}
