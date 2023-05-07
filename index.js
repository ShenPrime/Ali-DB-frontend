const searchInput = document.getElementById("search");
const searchResults = document.getElementById("results");
const entries = document.getElementById("entries");
const swedishQ = document.getElementById("swedish-q");
const arabicT = document.getElementById("arabic-t");
const swedishA = document.getElementById("swedish-a");
const arabicA = document.getElementById("arabic-a");
const note = document.getElementById("note");

let value;
let checkedColumnVal;

searchInput.addEventListener("input", (e) => {
  value = e.target.value;
});

document.addEventListener("keyup", async (e) => {
  if (e.key === "Enter") {
    checkedColumnVal = getSearchOptionValue();
    clearResults(entries);
    const data = await fetchData(value, checkedColumnVal);
    parseDataArrayAndDisplayResults(data);
  }
});

async function fetchData(value, searchOption) {
  if (!value || value === "") {
    return;
  }

  try {
    const response = await fetch(
      `https://nodejs-production-ddec.up.railway.app/${searchOption}/${value}`
    );
    if (response.status === 200) {
      const data = await response.json();
      entries.innerText = `Found ${data.length} entries in DB`;
      return data;
    } else {
      entries.innerText = `No Results Found!`;
      return null;
    }
  } catch (e) {
    console.log("Something went wrong", e);
    return null;
  }
}

function parseDataArrayAndDisplayResults(data) {
  let counter = 0
  data.forEach((dataJsonItem) => {
    const content = validateJSON(dataJsonItem);
    const card = createItemCard(content, counter);
    searchResults.appendChild(card);
    counter++
  });
}

function createItemCard(jsonInfo, counter) {
  const card = generateCardHTML(jsonInfo, counter);
  return createTemplate(card);
}

function validateJSON(content) {
  if (content) {
    const swedishQuestion = content.swedish_question ?? "NULL";
    const arabicTranslate = content.arabic_translate ?? "NULL";
    const swedishAnswer = content.swedish_answer ?? "NULL"; const arabicAnswer = content.arabic_answer ?? "NULL";
    const note = content.note ?? "NULL";
    const pic = content.pic ? `<img src="./Pic/${content.pic}"` : "";

    return {
      swedishQuestion,
      arabicTranslate,
      swedishAnswer,
      arabicAnswer,
      note,
      pic,
    };
  }
  return null;
}


function generateCardHTML(content, counter) {
  if (!content) {
    return `<h4>Nothing found</h4>`
  }
  return `
<div class="cards-container">
<h4">Swedish Question</h4>
<pre id=SQ-${counter}>${content.swedishQuestion}</pre>
<button id="copy" onclick="copy('SQ-'+${counter})">Copy Text</button>
<h4>Arabic Translate</h4>
<pre lang="ar" id=AT-${counter}>${content.arabicTranslate}</pre>
<button id="copy" onclick="copy('AT-'+${counter})">Copy Text</button>
<h4>Swedish Answer</h4>
<pre id=SA-${counter}>${content.swedishAnswer}</pre>
<button id="copy" onclick="copy('SA-'+${counter})">Copy Text</button>
<h4>Arabic Answer</h4>
<pre lang=ar  id=AA-${counter}>${content.arabicAnswer}</pre>
<button id="copy" onclick="copy('AA-'+${counter})">Copy Text</button>
<h4>Note</h4>
<pre id=Note-${counter}>${content.note}</pre>
<button id="copy" onclick="copy('Note-'+${counter})">Copy Text</button>
<br>
${content.pic}
</div>
`;
}

function copy(id) {
  const text = document.getElementById(id);
  console.log(text.innerText);
  navigator.clipboard.writeText(text.innerText);
}

function createTemplate(html) {
  const template = document.createElement("template");
  template.innerHTML = html.trim();
  return template.content.firstElementChild;
}

function clearResults(entries) {
  while (searchResults.firstChild) {
    searchResults.removeChild(searchResults.lastChild);
  }
  entries.innerText = "";
}

function getSearchOptionValue() {
  let val;
  const possiblevalues = [swedishQ, arabicT, swedishA, arabicA, note];
  for (let i = 0; i < possiblevalues.length; i++) {
    if (possiblevalues[i].checked) {
      val = possiblevalues[i].value;
      break;
    }
  }
  return val;
}