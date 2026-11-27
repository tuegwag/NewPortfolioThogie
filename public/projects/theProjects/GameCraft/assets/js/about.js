const abouts = [
    {
        name: "Yannick",
        text: "Ik ben Yannick, 18 jaar, student software developer. Ik besteed mijn vrije tijd veel aan het ontwikkelen van Minecraft plugins en servers, webapplicaties en andere software gerelateerde development. Voor mijn project game met JavaScript heb ik schaken gemaakt zonder libraries (alleen voor backend zoals express, socket.io etc.). Deze heeft multiplayer support m.b.h. websockets en http requests via de nodejs backend."
    },
    {
        name: "Luke",
        text: "Mijn naam is Luke en ik ben eerstejaars student software developer bij ROC Midden Nederland. Ik ben erg geïnteresseerd in wat er mogelijk is met HTML, CSS en JavaScript. En ik hoop dat ik in de toekomst nog veel meer kan leren over webdevelopment!"
    },
    {
        name: "Stijn",
        text: "hoi, ik ben stijn een eerste jaars student en ik doe de opleiding software dev. Ik doe zelf veel aan game dev in mijn vrije tijd in unity, voor dit project doen we dit in javascript ( geen libaries ).  Zelf ben ik nu ook bezig met front-end, backend en databases in MySQL en node."
    },
    {
        name: "Jesse",
        text: "Ik ben Jesse klok, ben 16 jaar en woon in Leusden. Ik doe de opleiding software Developer. In mijn vrije tijd vind ik het leuk om te gamen, sporten en met vrienden af te spreken."
    },
    {
        name: "Thomas",
        text: "Ik ben Thomas Lammerse, Ik ben een 16 jarige student Software Developer op het ROC midden Nederland Amersfoort, In mijn vrije tijd hou ik mij graag bezig met mountainbiken en afspreken met vrienden."
    }
]

function clickName(name) {
    document.getElementById("name").innerHTML = getAbout(name).name
    document.getElementById("text").innerHTML = getAbout(name).text

    let names = document.getElementById("names")
    names.innerHTML = ""
    for(let i = 0; i<abouts.length;i++) {
        let person = document.createElement("div")
        person.setAttribute("onclick",`clickName('${abouts[i].name}')`)
        person.setAttribute("id",abouts[i].name.toLowerCase())
        person.classList.add("name")
        if(name.toLowerCase() === abouts[i].name.toLowerCase()) {
            person.innerHTML = ">" + abouts[i].name
        } else {
            person.innerHTML = abouts[i].name
        }
        names.appendChild(person)
    }
}



function getAbout(name) {
    return abouts.find(about => about.name === name)
}

clickName(abouts[0].name)