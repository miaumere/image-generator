let imagePath = "./img/"
const defaultHeight = document.querySelector('input[name="height"]').value
const defaultWidth = document.querySelector('input[name="width"]').value
const defaultColor = document.querySelector('input[name="color"]').value

let previewValues = {
    fileName: './image.png',
    height: defaultHeight,
    width: defaultWidth,
    text: '',
    color: defaultColor,
    icon: '',
}

let xhr = new XMLHttpRequest();
xhr.open("GET", "./img-array.php", true);

xhr.addEventListener('load', (e)=> {
    const responseObj = e.target;

    if (responseObj.status === 200) {
        // Kiedy wszystko dziala poprawnie:
        let response;
        try { 
            const parsedResponse = JSON.parse(responseObj.response)
            response = parsedResponse;
        } catch (error){
            // Błąd na back endzie:
            console.error("Wystąpił błąd parsowania danych.");
        }


        if (response && Array.isArray(response)) {
            //Dodawanie <option> do <select>
            let select = document.querySelector("#iconList")
            for(let i=0; i<response.length; i++){
                // Generowanie <option>
                let option = document.createElement("option")
                // Path ikonki
                let imgOutput = imagePath + response[i]
                option.setAttribute("value", imgOutput)
                option.innerHTML = response[i]
                select.appendChild(option)
            }
            // Dodawanie domyślnego obrazka przed utworzeniem preview:
            let preview = document.querySelector("#preview")
            let allInputs = document.querySelectorAll("input[name], textarea[name], select")

            for (const input of allInputs) {
                input.addEventListener('input', (e) => {
                    // Update obiektu previewValues o wartości z inputów
                    switch(e.target.name){
                        case "height":
                        previewValues.height = e.target.value
                        break;

                        case "width":
                        previewValues.width = e.target.value
                        break;

                        case "text":
                        previewValues.text= e.target.value
                        break;

                        case "color":
                        previewValues.color= e.target.value
                        break;

                        case "icon":
                        previewValues.icon= e.target.value
                        break;
                    }
                    // Nowy src dodany do obrazka:
                    let link = `${previewValues.fileName}?height=${previewValues.height}&width=${previewValues.width}&text=${previewValues.text}&color=${encodeURIComponent(previewValues.color)}&icon=${previewValues.icon}`
                    preview.setAttribute("src", link)

                    // Wysyłanie REST do back-endu:
                    let params = `height=${previewValues.height}&width=${previewValues.width}&text=${previewValues.text}&color=${encodeURIComponent(previewValues.color)}&icon=${previewValues.icon}`;
                    let iconRequest = new XMLHttpRequest();

                    iconRequest.open("POST", "./img-array.php", true);
                    iconRequest.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    
                    iconRequest.onreadystatechange = ()=> {
                        if(iconRequest.readyState == 4 && iconRequest.status == 200) {
                            console.log(iconRequest.responseText);
                        }
                    }
                    iconRequest.send(params);
                })
            }
            // const newIcon = document.querySelector("#newIcon");
            // newIcon.addEventListener("submit", (e) => {


            // })


        }
    }
});
 
xhr.send();
