var st = "ILoveCart263";
var allData = "";
var c = 0;
var stlength = st.length;

function naciFunction(event) {
    if (c >= stlength) {
        document.removeEventListener('keyup', naciFunction);
        return;
    }

    allData = allData + st[c];
    c++;

    document.getElementById("dataArea").innerHTML = allData;
}

document.addEventListener('keyup', naciFunction);