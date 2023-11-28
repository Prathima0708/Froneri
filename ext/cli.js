#!/usr/bin/env node

//grab provided args
const [, , ...args] = process.argv;

var filePathInputMap = args[0];
var filePathOutput = args[2];

var styleMap = require(filePathInputMap);
var fs = require('fs');

const getTabs = function (noOfTabs = 1) {
  let tabs = '';
  for (let i = 0; i < noOfTabs; i++) {
    tabs = `${tabs}    `;
  }
  return tabs;
};

//print
console.log(`>>>> Initializing Styles...`);
//console.log(styleMap.TypographyItems);
//console.log(styleMap.WeightsMap);

let StyleKeysFileContents = '';

/** Prepare Typography Keys */
const typoKey = '';
const StyleKeysImports = `import {Platform, TextStyle} from 'react-native';`;
const TypoKeysStart = `export type TypographyKeys = Record<`;
const TypeKeysDynamicStr = `| '${typoKey}'`;
const TypoKeysEnd = `, TextStyle>;`;

var finalTypoKeys = '';
var finalTypoKeysCount = 0;

if (styleMap.TypographyItems) {
  for (let index in styleMap.TypographyItems) {
    finalTypoKeys = `${finalTypoKeys}
    ${getTabs(1)}| '${styleMap.TypographyItems[index]}'`;
    finalTypoKeysCount++;
  }
}
if (styleMap.TypographyItems && styleMap.WeightsMap) {
  for (const [weightKey, weightValue] of Object.entries(styleMap.WeightsMap)) {
    for (let index in styleMap.TypographyItems) {
      finalTypoKeys = `${finalTypoKeys}
      ${getTabs(1)}| '${styleMap.TypographyItems[index]}${weightValue}'`;
      finalTypoKeysCount++;
    }
  }
}

finalTypoKeys = `${TypoKeysStart}${finalTypoKeys}
${getTabs(1)}${TypoKeysEnd}`;
//console.log('>>> FinalTypoKeys = ', finalTypoKeys);
//console.log('>>> FinalTypoKeysCount = ', finalTypoKeysCount);

/** Prepare Typography Keys */

/** Prepare StyleKeys File */

var finalStyleKeysFile = '';
finalStyleKeysFile = `
${StyleKeysImports}    

${finalTypoKeys}
`;

//console.log('>>> FinalStyleKeysFile = ', finalStyleKeysFile);

//write
fs.writeFile(filePathOutput, finalStyleKeysFile, function (err) {
  if (err) throw err;
  console.log('>>>> Initialized Styles Successfully!');
});

/** Prepare StyleKeys File */
