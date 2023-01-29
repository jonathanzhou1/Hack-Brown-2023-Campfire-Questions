var MAX_TOKENS = 300;
var GENRE_COL = 3;
var API_KEY = 'API KEY HERE';

function onCall(sheet) {
  var hitBlank = false;
  var i = 1;

  while (hitBlank == false) {
    genreRange = sheet.getRange(i, GENRE_COL);
    genreCell = genreRange.getValue();
    questionRange = sheet.getRange(i, GENRE_COL - 1);
    questionCell = questionRange.getValue();

    if ((questionCell != "") && (genreCell == "")) {
      result = pingAI(questionCell);
      genreRange.setValue(result);
    } else if ((questionCell == "") && (genreCell == "")) {
      hitBlank = true;
    }
    i += 1;
  }
  sortRange = sheet.getRange(2, GENRE_COL - 2, i, 3);
  sortRange.sort({column: 3, ascending: true});
}
 
function sortSheetsByName() {
  var aSheets = new Array();
  var ss = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Questions');
  for (var s in ss.getSheets())
  {
    aSheets.push(ss.getSheets()[s].getName());
  }
  if(aSheets.length)
  {
    aSheets.sort();
    for (var i = 0; i < aSheets.length; i++)
    {
      var theSheet = ss.getSheetByName(aSheets[i]);
      if(theSheet.getIndex() != i + 1)
      {
        ss.setActiveSheet(theSheet);
        ss.moveActiveSheet(i + 1);
      }
    }
  }
}

function pingAI(prompt) {
  prompt = 'The following is a question and the categories they fall into:\n\n' + prompt + '\nCategory: ';
  console.log(prompt)

  var url = 'https://api.openai.com/v1/completions';
  var payload = {
    "model": 'text-davinci-003',
    "prompt": prompt,
    "temperature": 0,
    "max_tokens": MAX_TOKENS,
    "top_p": 1,
    "frequency_penalty": 0,
    "presence_penalty": 0
    };
  var options = {
    'method': 'post',
    'payload': JSON.stringify(payload),
    'headers': {
      'Authorization': 'Bearer ' + API_KEY,
      'Content-Type': 'application/json'
    }
  };
  console.log("ouch my pocket")
  var response = UrlFetchApp.fetch(url, options);
  const data = JSON.parse(response.getContentText());
  return data.choices[0].text
}
