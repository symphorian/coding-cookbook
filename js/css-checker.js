const htmlInput = document.getElementById("css-input");
const submitButton = document.getElementById("submit");
const urlInput = document.getElementById("urlInput");
const urlSubmitButton = document.getElementById("urlSubmit");
const reportElement = document.getElementById("report");
const rawInputElement = document.getElementById("rawInput");
const cleanedInputElement = document.getElementById("cleanedInput");

submitButton.onclick = () => {
    reportElement.classList.add("hide");
    // add artificial delay, to make a change appear to occur on the page
    setTimeout(() => {
        if (htmlInput.value) {
            urlInput.value = "";
            generateReportOnCSS(htmlInput.value);
        } else if (urlInput.value) {
            const url = urlInput.value;
            if (url.endsWith(".css")) {
                fetchCSSFromURL(url);
            } else {
                fetchHTMLFromURL(url);
            }
        }
    }, 250);
}

function fetchHTMLFromURL(url) {
    fetch(url)
        .then(response => response.text())
        .then(html => {
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            const links = doc.querySelectorAll('head link[rel=stylesheet]');
            let firstLocalCSSPath = '';
            let preferredLocalCSSPath = '';
            debugger;
            for (let i = 0; i < links.length; i++) {
                const linkElement = links[i];
                if (linkElement.href.includes("/css/") || linkElement.href.includes("/CSS/")) {
                    if (!firstLocalCSSPath) {
                        if (linkElement.href.includes("/css/")) {
                            firstLocalCSSPath = linkElement.href.substring(linkElement.href.indexOf('css/'));
                        } else if (linkElement.href.includes("/CSS/")) {
                            firstLocalCSSPath = linkElement.href.substring(linkElement.href.indexOf('CSS/'));
                        }
                    }
                    if (
                        linkElement.href.includes("style.css")
                        || linkElement.href.includes("styles.css")
                        || linkElement.href.includes("drill.css") 
                        || linkElement.href.includes("index.css")
                    ) {
                        if (linkElement.href.includes("/css/")) {
                            preferredLocalCSSPath = linkElement.href.substring(linkElement.href.indexOf('css/'));
                        } else if (linkElement.href.includes("/CSS/")) {
                            preferredLocalCSSPath = linkElement.href.substring(linkElement.href.indexOf('CSS/'));
                        }
                    }
                }
            }

            const urlObject = new URL(url);
            const urlPartsArray = urlObject.pathname.split('/');
            if (urlPartsArray[urlPartsArray.length - 1].includes('.')) {
                urlPartsArray.pop();
            }
            const rootPath = 
                urlObject.origin + urlPartsArray.join('/') + '/';

            if (preferredLocalCSSPath) {
                fetchCSSFromURL(rootPath + preferredLocalCSSPath);
            } else {
                fetchCSSFromURL(rootPath + firstLocalCSSPath);
            }
        })
        .catch(error => {
            console.log("Error in fetching recipe: ", error);
        });
}

function fetchCSSFromURL(url) {
    //console.log("fetchCSSFromURL: " + url);
    fetch(url)
        .then(response => response.text())
        .then(css => {
            generateReportOnCSS(css);
        })
        .catch(error => {
            console.log("Error in fetching CSS: ", error);
        });
}

function generateReportOnCSS(rawInput) {
    //console.log("generateReportOnCSS: " + rawInput);

    let allowNestedCSSRules = shouldAllowNestedCSSRules();

    const rawInputLines = rawInput.split("\n");
    const TAB_LENGTH = 4;
    const LINE_CHAR_LIMIT = 80;
    const lineObjects = [];
    const blockParentStack = [];
    const functionParentStack = [];
    const commentParentStack = [];
    let lastPropertyStart = null;
    let lastLineObject = null;
    for (let i = 0; i < rawInputLines.length; i++) {
        const rawInput = rawInputLines[i];
        const newLineObject = {};
        newLineObject.lineNumber = i+1;
        newLineObject.rawInput = rawInput.trimEnd();
        newLineObject.charCount = newLineObject.rawInput.length;
        newLineObject.exceedsCharLimit = newLineObject.rawInput.length > LINE_CHAR_LIMIT;
        newLineObject.trimmedInput = rawInput.trimStart().trimEnd();
        newLineObject.isEmpty = newLineObject.trimmedInput.length == 0;
        newLineObject.actualIndentation = 
            newLineObject.rawInput.length - newLineObject.trimmedInput.length;

        newLineObject.isBlockOpener = newLineObject.trimmedInput.endsWith('{');
        newLineObject.isBlockCloser = newLineObject.trimmedInput.endsWith('}');

        newLineObject.isDirtyOpeningBlock = 
            newLineObject.isBlockOpener
            && !newLineObject.trimmedInput.includes(' {');

        newLineObject.isDirtyClosingBlock = 
            newLineObject.isBlockCloser
            && !newLineObject.trimmedInput.startsWith('}');

        newLineObject.isDirtyCssRule = 
            (newLineObject.trimmedInput.includes('{') && !newLineObject.isBlockOpener)
            || (newLineObject.trimmedInput.includes('}') && !newLineObject.isBlockCloser);

        newLineObject.isFunctionOpener = newLineObject.trimmedInput.endsWith('(');
        newLineObject.isFunctionCloser = 
            newLineObject.trimmedInput.startsWith(');')
            || newLineObject.trimmedInput.startsWith(')');

        if (newLineObject.isFunctionCloser && newLineObject.trimmedInput.endsWith(')')) {
            newLineObject.isMissingSemiColon = true;
        }

        const openParenCount = newLineObject.trimmedInput.split('(').length - 1;
        const closedParenCount = newLineObject.trimmedInput.split(')').length - 1;

        if (
            openParenCount != closedParenCount 
        ) {
            if (openParenCount > 1 || closedParenCount > 1) {
                newLineObject.isDirtyFunction = true;
            }

            if (openParenCount > closedParenCount && !newLineObject.isFunctionOpener) {
                newLineObject.isDirtyFunction = true;
                newLineObject.isFunctionOpener = true;
            }
            if (closedParenCount > openParenCount && !newLineObject.isFunctionCloser) {
                newLineObject.isDirtyFunction = true;
                newLineObject.isFunctionCloser = true;
            }
        }

        newLineObject.isSingleLineComment = 
            newLineObject.trimmedInput.startsWith('/*')
            && newLineObject.trimmedInput.endsWith('*/');
        const isLineOnlyCommentCharacters = newLineObject.trimmedInput
            .split('')
            .every(char => char === '/' || char === '*');
        newLineObject.isCommentOpener = 
            newLineObject.trimmedInput.endsWith('/*')
            || (
                newLineObject.trimmedInput.startsWith('/*')
                && isLineOnlyCommentCharacters
            );
        newLineObject.isCommentCloser = 
            newLineObject.trimmedInput.startsWith('*/')
            || (
                newLineObject.trimmedInput.endsWith('*/')
                && isLineOnlyCommentCharacters
            );

        if (!newLineObject.isSingleLineComment) {
            if (
                newLineObject.trimmedInput.startsWith('/*') 
                && !newLineObject.isCommentOpener
            ) {
                newLineObject.isDirtyComment = true;
                newLineObject.isCommentOpener = true;
            }

            if (
                newLineObject.trimmedInput.endsWith('*/') 
                && !newLineObject.isCommentCloser
            ) {
                newLineObject.isDirtyComment = true;
                newLineObject.isCommentCloser = true;
            }
        }

        newLineObject.isImport = newLineObject.trimmedInput.startsWith('@import ');
        newLineObject.isMediaQuery = newLineObject.trimmedInput.startsWith('@media ');

        newLineObject.hasBrokenMediaFeatures =
            newLineObject.isMediaQuery
            && newLineObject.trimmedInput.includes(';');

        newLineObject.isIncompleteMediaQuery =
            newLineObject.isMediaQuery
            && !newLineObject.trimmedInput.includes('{');

        const multiplePropertiesRegex = 
            /[^:;]+\s*:\s*[^;]+;.*[^:;]+\s*:\s*[^;]+/;
        newLineObject.hasMultipleProperties =
            multiplePropertiesRegex.test(newLineObject.trimmedInput)
            && !newLineObject.isImport;

        if (newLineObject.isBlockOpener) {
            blockParentStack.push(newLineObject);
        }

        if (newLineObject.isFunctionOpener) {
            functionParentStack.push(newLineObject);
        }

        if (newLineObject.isCommentOpener) {
            commentParentStack.push(newLineObject);
        }

        
        let indentation = 0;
        let foundMatchedBlockParent = false;
        let foundMatchedFunctionParent = false;
        let foundMatchedCommentParent = false;
        let isStrayClosingBracket = false;
        let isStrayClosingParen = false;
        let isStrayClosingComment = false;

        newLineObject.isInMediaQuery = false;
        newLineObject.isInBlock = false;
        newLineObject.isInFunction = false;
        newLineObject.isInComment = false;

        if (newLineObject.isBlockCloser) {
            let parentsPoppedCount = 0;
            if (blockParentStack.length > 0) {
                const poppedParent = blockParentStack.pop();
                parentsPoppedCount++;

                if (newLineObject.isDirtyClosingBlock && lastLineObject) {
                    indentation = poppedParent.idealIndentation + TAB_LENGTH;
                } else {
                    indentation = poppedParent.idealIndentation;
                }
                foundMatchedBlockParent = true;
                poppedParent.matchingLineNumber = newLineObject.lineNumber;
                newLineObject.matchingLineNumber = poppedParent.lineNumber;
                // if (parentsPoppedCount > 1) {
                //     newLineObject.isNearMissingClosingTags = true;
                // }
            } else if (blockParentStack.length == 0) {
                indentation = newLineObject.actualIndentation;
                isStrayClosingBracket = true;
                newLineObject.isStrayClosingBracket = true;
            }
            
            if (lastPropertyStart && lastLineObject) {
                if (!lastLineObject.trimmedInput.endsWith(";")) {
                    lastLineObject.isMissingSemiColon = true;
                }
                lastPropertyStart = null;
            }

            if (
                newLineObject.isDirtyPropertyEnd
                && !newLineObject.trimmedInput.endsWith(';}')
            ) {
                if (!newLineObject.trimmedInput.endsWith(';')) {
                    newLineObject.isMissingSemiColon = true;
                }
                lastPropertyStart = null;
            }
        } 
        
        if (newLineObject.isFunctionCloser) {
            let parentsPoppedCount = 0;
            newLineObject.isInBlock = true;
            if (functionParentStack.length > 0) {
                const poppedParent = functionParentStack.pop();
                parentsPoppedCount++;

                indentation = poppedParent.idealIndentation;
                foundMatchedFunctionParent = true;
                poppedParent.matchingLineNumber = newLineObject.lineNumber;
                newLineObject.matchingLineNumber = poppedParent.lineNumber;
            } else if (functionParentStack.length == 0) {
                indentation = newLineObject.actualIndentation;
                isStrayClosingParen = true;
                newLineObject.isStrayClosingParen = true;
            }
        }

        if (newLineObject.isCommentCloser) {
            let parentsPoppedCount = 0;
            if (commentParentStack.length > 0) {
                const poppedParent = commentParentStack.pop();
                parentsPoppedCount++;

                indentation = poppedParent.idealIndentation;
                foundMatchedCommentParent = true;
                poppedParent.matchingLineNumber = newLineObject.lineNumber;
                newLineObject.matchingLineNumber = poppedParent.lineNumber;
            } else if (commentParentStack.length == 0) {
                indentation = newLineObject.actualIndentation;
                isStrayClosingComment = true;
                newLineObject.isStrayClosingComment = true;
            }
        }

        if (
            !foundMatchedBlockParent 
            && !foundMatchedFunctionParent 
            && !foundMatchedCommentParent
            && !isStrayClosingBracket 
            && !isStrayClosingParen 
            && !isStrayClosingComment
            && lastLineObject
        ) {
            if (
                lastLineObject.isBlockOpener 
                || lastLineObject.isFunctionOpener
                || lastLineObject.isCommentOpener
                || lastLineObject.isMediaQuery
            ) {
                indentation = lastLineObject.idealIndentation + TAB_LENGTH;
                if (lastLineObject.isBlockOpener && lastLineObject.isInBlock) {
                    lastLineObject.isNestedBlock = true;
                }
                if (lastLineObject.isBlockOpener && !lastLineObject.isMediaQuery) {
                    newLineObject.isInBlock = true;
                }
                if (lastLineObject.isFunctionOpener) {
                    newLineObject.isInFunction = true;
                    newLineObject.isInBlock = true;
                }
                if (lastLineObject.isCommentOpener) {
                    newLineObject.isInComment = true;
                }
            } else if (lastPropertyStart) {
                indentation = lastPropertyStart.idealIndentation + TAB_LENGTH;
                newLineObject.isInBlock = lastLineObject.isInBlock;
                newLineObject.isInFunction = lastLineObject.isInFunction;
                newLineObject.isInComment = lastLineObject.isInComment;
                newLineObject.lastPropertyStartLineNumber = lastPropertyStart.lineNumber;
            } else if (
                lastLineObject.lastPropertyStartLineNumber
                || lastLineObject.isDirtyClosingBlock
            ) {
                indentation = lastLineObject.idealIndentation - TAB_LENGTH;
                newLineObject.isInBlock = lastLineObject.isInBlock;
                newLineObject.isInFunction = lastLineObject.isInFunction;
                newLineObject.isInComment = lastLineObject.isInComment;
                newLineObject.isExcessLineSpace = 
                    newLineObject.isEmpty && lastLineObject.isEmpty;
            } else {
                indentation = lastLineObject.idealIndentation;
                newLineObject.isInBlock = lastLineObject.isInBlock;
                newLineObject.isInFunction = lastLineObject.isInFunction;
                newLineObject.isInComment = lastLineObject.isInComment;
                newLineObject.isExcessLineSpace = 
                    newLineObject.isEmpty && lastLineObject.isEmpty;
            }
        }

        if (newLineObject.isSingleLineComment) {
            newLineObject.isInComment = true;
        }


        newLineObject.isPropertyStart = 
            newLineObject.trimmedInput.includes(':') 
            && newLineObject.isInBlock
            && !newLineObject.isBlockOpener
            && !newLineObject.isMediaQuery
            && !newLineObject.isImport
            && !(
                newLineObject.trimmedInput.startsWith('/*') 
                && newLineObject.trimmedInput.endsWith('*/')
            );
        newLineObject.isBrokenPropertyStart = 
            newLineObject.trimmedInput.includes('=') 
            && newLineObject.isInBlock
            && !newLineObject.isBlockOpener
            && !newLineObject.isMediaQuery
            && !newLineObject.isImport
            && !(
                newLineObject.trimmedInput.startsWith('/*') 
                && newLineObject.trimmedInput.endsWith('*/')
            );
        newLineObject.isPropertyHalf = 
            newLineObject.trimmedInput.endsWith(':')
            && newLineObject.isInBlock;
        newLineObject.isPropertyEnd = 
            newLineObject.isInBlock
            && (
                newLineObject.trimmedInput.endsWith(';')
                || newLineObject.trimmedInput.endsWith(';}') // dirty closer
                || newLineObject.trimmedInput.endsWith('}') // dirty closer
            );
        
        newLineObject.isDirtyPropertyEnd =
            newLineObject.trimmedInput.length > 1
            && newLineObject.isInBlock
            && newLineObject.trimmedInput.endsWith('}'); // dirty closer

        newLineObject.hasDoubleSemiColons =
            newLineObject.trimmedInput.includes(';;');

        if (
            newLineObject.isPropertyStart 
            && !newLineObject.isPropertyHalf 
            && !newLineObject.isPropertyEnd
            && !newLineObject.isFunctionOpener
        ) {
            newLineObject.isIncompleteProperty = true;
        }

        newLineObject.isDirtyColon =
            newLineObject.isPropertyStart
            && newLineObject.isPropertyEnd
            && !newLineObject.trimmedInput.includes(': ');

        newLineObject.isDirtyComma =
            newLineObject.trimmedInput.includes(',')
            && !newLineObject.trimmedInput.endsWith(',')
            && !newLineObject.trimmedInput.includes(', ')
            && !newLineObject.isImport;



        newLineObject.needsCommaSplit = 
            newLineObject.trimmedInput.includes(',')
            && !newLineObject.trimmedInput.endsWith(',')
            && !newLineObject.isPropertyStart
            && !lastPropertyStart
            && !newLineObject.isInComment
            && !newLineObject.isImport;

        if (newLineObject.isPropertyStart && !newLineObject.isInComment) {
            if (lastPropertyStart && lastLineObject && !lastLineObject.trimmedInput.endsWith(";")) {
                lastLineObject.isMissingSemiColon = true;
            }
            lastPropertyStart = newLineObject;

        }

        if (newLineObject.isPropertyEnd) {
            lastPropertyStart = null;
        }
        
        newLineObject.idealIndentation = indentation;

        lineObjects.push(newLineObject);
        if (!isStrayClosingBracket) {
            lastLineObject = newLineObject;
        }
    }


    rawInputElement.innerHTML = "";
    cleanedInputElement.innerHTML = "";
    for (let i = 0; i < lineObjects.length; i++) {
        const line = lineObjects[i];

        let paddedRawTrimmedInput = line.trimmedInput.padEnd(
            LINE_CHAR_LIMIT - line.actualIndentation, 
            ' ',
        );
        let trimmedRawInputWithCharLimit = 
            paddedRawTrimmedInput.slice(0, LINE_CHAR_LIMIT - line.actualIndentation) 
            + '|' 
            + paddedRawTrimmedInput.slice(LINE_CHAR_LIMIT - line.actualIndentation);

        let indentationDiff = line.idealIndentation - line.actualIndentation;

        let giveImportWarning = line.isImport && line.lineNumber > 1;

        line.hasDirtyCode = 
            (indentationDiff != 0 && !line.isEmpty)
            || line.isDirtyCssRule
            || line.isStrayClosingBracket
            || line.isStrayClosingParen
            || line.isStrayClosingComment
            || line.isExcessLineSpace
            || (line.exceedsCharLimit && !line.isImport)
            || giveImportWarning
            || line.isDirtyFunction
            || line.isDirtyComment
            || (line.isNestedBlock && !allowNestedCSSRules)
            || line.isDirtyOpeningBlock
            || line.isDirtyClosingBlock
            || line.isDirtyComma
            || line.isDirtyColon
            || line.isMissingSemiColon
            || line.hasDoubleSemiColons
            || line.hasMultipleProperties
            || line.isBrokenPropertyStart
            || line.isIncompleteProperty
            || line.needsCommaSplit
            || line.hasBrokenMediaFeatures
            || line.isIncompleteMediaQuery;

        let errorMessage = ""
        if (line.hasDirtyCode) {
            errorMessage += `Line ${line.lineNumber} has the following clean code issues:\n`;
            if (indentationDiff != 0 && !line.isEmpty) {
                errorMessage += 
                    `  - This line should be ${indentationDiff > 0 ? "indented " : "outdented "}`
                    + `${Math.abs(indentationDiff)} spaces `;
                
                if (indentationDiff % TAB_LENGTH == 0) {
                    const tabs = Math.abs(indentationDiff) / TAB_LENGTH;
                    errorMessage += `(or ${tabs} ${tabs == 1 ? "tab" : "tabs"}) `;
                }
                    
                errorMessage += `to the ${indentationDiff > 0 ? "right." : "left."} \n`;
            }

            if (line.isDirtyCssRule) {
                errorMessage += 
                    `  - This line appears to contain opening and/or closing bracket(s) ` 
                    + `in the middle of other code. CSS Rules should have the Selectors and opening bracket ({) `
                    + `on one line, the CSS Properties on their own lines, and the closing bracket (}) `
                    + `on its own line as well.\n`
            }

            if (line.isStrayClosingBracket) {
                errorMessage += 
                    `  - This line appears to contain a stray closing bracket, ` 
                    + `which does not match to an opening bracket.\n`
            }

            if (line.isStrayClosingParen) {
                errorMessage += 
                    `  - This line appears to contain a stray closing parenthesis, ` 
                    + `which does not match to an opening parenthesis.\n`
            }

            if (line.isStrayClosingComment) {
                errorMessage += 
                    `  - This line appears to contain a stray closing */ ` 
                    + `which does not match to an opening /* (used for comments).\n`
            }

            if (line.isExcessLineSpace) {
                errorMessage += 
                    `  - More than one consecutive line of empty space is excessive; `
                    + `this line of code can be removed.\n`;
            }

            if (line.exceedsCharLimit && !line.isImport) {
                errorMessage += 
                    `  - This line exceeds the ${LINE_CHAR_LIMIT} character limit.\n`;
            }

            if (giveImportWarning) {
                errorMessage += 
                    `  - @import statements should be the very first thing in the file; they may not work properly otherwise.\n`;
            }

            if (line.isDirtyFunction) {
                errorMessage += 
                    `  - If the parentheses of a value function are not on the same line, those parentheses and each input in between them should all have their own lines.\n`;
            }

            if (line.isDirtyComment) {
                errorMessage += 
                    `  - If the /* and */ of a comment are not on the same line, those /* and */ and whatever is in between them should be on separate lines.\n`;
                errorMessage += 
                    `  - OR, if these are lines of code you commented out, they probably should not be left in your submission!\n`;
            }

            if (line.isNestedBlock && !allowNestedCSSRules) {
                errorMessage += 
                    `  - This new CSS Rule seems to be inside of another Declaration Block. `
                    + `Be sure to end the previous CSS Rule with a closing curly bracket ( } ) before starting a new one.\n`;
            }

            if (line.isMissingSemiColon) {
                errorMessage += 
                    `  - This line seems to be missing a semicolon ( ; ) at the end.\n`;
            }

            if (line.hasDoubleSemiColons) {
                errorMessage += 
                    `  - This line has two semicolons ( ;; ). CSS Properties only need one to terminate, so remove the spare.\n`;
            }

            if (line.hasMultipleProperties) {
                errorMessage += 
                    `  - This line seems to have multiple CSS Properties; `
                    + `split the line up so that each CSS Property has its own line.\n`;
            }

            if (line.isBrokenPropertyStart) {
                errorMessage += 
                    `  - This line seems to be using an equal sign ( = ) as the Assignment Operator. Replace it with a colon ( : ). `
                    + `Remember that in CSS, colons ( : ) are the Assignment Operators for CSS Properties.\n`;
            }

            if (line.isIncompleteProperty && !line.isMissingSemiColon && !line.isDirtyCssRule && !line.isDirtyClosingBlock) {
                errorMessage += 
                    `  - This CSS Property seems to be missing a semicolon ( ; ), or was split across multiple lines. If it was split, everything after the colon (:) should be moved to the next line as well.\n`;
            }

            if (line.isDirtyOpeningBlock) {
                errorMessage += 
                    `  - Include a space before the opening bracket ( { ) in a CSS Rule or Media Query to make it cleaner.\n`;
            }

            if (line.isDirtyClosingBlock) {
                errorMessage += 
                    `  - The closing bracket ( } ) of a Declaration Block should be on its own line.\n`;
            }

            if (line.isDirtyComma) {
                errorMessage += 
                    `  - Add a space after a comma ( , ) in a CSS Property to make it cleaner.\n`;
            }

            if (line.isDirtyColon) {
                errorMessage += 
                    `  - Add a space after the Assignment Operator ( : ) in a CSS Property to make it cleaner.\n`;
            }

            if (line.needsCommaSplit) {
                errorMessage += 
                    `  - When sharing styles across multiple selectors with commas ( , ), it is cleaner to have each group of selectors on their own line with the comma(s) at the end.\n`;
            }

            if (line.hasBrokenMediaFeatures) {
                errorMessage += 
                    `  - Media Features like max-width and min-width should not use semicolons ( ; ), since they are not CSS Properties.\n`;
            }

            if (line.isIncompleteMediaQuery) {
                errorMessage += 
                    `  - This Media Query is missing an opening bracket ( { ) at the end.\n`;
            }
        }
        line.errorMessage = errorMessage;

        let rawInputContent = "";
        rawInputContent += `<div class='line ${line.hasDirtyCode ? " dirty" : ""}' title='${errorMessage}' data-line-number='${line.lineNumber}' data-matching-line-number='${line.matchingLineNumber ? line.matchingLineNumber : 0}'>`;
        rawInputContent += "<div class='lineNumber'>" + line.lineNumber + "</div>";
        rawInputContent += "<div class='lineContent'>";
        for (let j = 0; j < line.actualIndentation; j++) {
            if (indentationDiff != 0 && !line.isEmpty) {
                if (j < line.idealIndentation) {
                    rawInputContent += "<span class='goodIndent'>&nbsp;</span>";
                } else {
                    rawInputContent += "<span class='badIndent'>&nbsp;</span>";
                }
            } else {
                rawInputContent += "&nbsp;";
            }
        }
        if (indentationDiff > 0 && !line.isEmpty) {
            let badIndentCode = trimmedRawInputWithCharLimit.slice(0, indentationDiff);
            let remainingCode = trimmedRawInputWithCharLimit.slice(indentationDiff);
            rawInputContent += "<span class='fixIndent'>" + convertStringToEscapedHTML(badIndentCode) + "</span>";
            rawInputContent += convertStringToEscapedHTML(remainingCode);
        } else {
            rawInputContent += convertStringToEscapedHTML(trimmedRawInputWithCharLimit) + "</div>";
        }
        rawInputContent += "</div>";
        
        rawInputElement.innerHTML += rawInputContent;


        let paddedTrimmedInput = line.trimmedInput.padEnd(
            LINE_CHAR_LIMIT - line.idealIndentation, 
            ' ',
        );
        let trimmedInputWithCharLimit = 
            paddedTrimmedInput.slice(0, LINE_CHAR_LIMIT - line.idealIndentation) 
            + '|' 
            + paddedTrimmedInput.slice(LINE_CHAR_LIMIT - line.idealIndentation);
        
        let cleanedInputContent = "";
        cleanedInputContent += `<div class='line ${line.hasDirtyCode ? " dirty" : ""}' title='${errorMessage}' data-line-number='${line.lineNumber}' data-matching-line-number='${line.matchingLineNumber ? line.matchingLineNumber : 0}'>`;
        cleanedInputContent += "<div class='lineNumber'>" + line.lineNumber + "</div>";
        cleanedInputContent += "<div class='lineContent'>";
        for (let j = 0; j < line.idealIndentation; j++) {
            if (indentationDiff != 0 && !line.isEmpty) {
                cleanedInputContent += "<span class='goodIndent'>&nbsp;</span>";
            } else {
                cleanedInputContent += "&nbsp;";
            }
        }
        cleanedInputContent += convertStringToEscapedHTML(trimmedInputWithCharLimit) + "</div>";
        cleanedInputContent += "</div>";

        cleanedInputElement.innerHTML += cleanedInputContent;
    }

    const dirtyCodeCountElement = document.getElementById("dirtyCodeCount");
    const badIndentationCountElement = document.getElementById("badIndentationCount");
    const dirtyPercentElement = document.getElementById("dirtyPercent");
    const issuesListElement = document.getElementById("issuesList");

    let dirtyLines = lineObjects.filter(line => line.hasDirtyCode);
    dirtyCodeCountElement.innerHTML = dirtyLines.length;
    badIndentationLines = dirtyLines.filter(line => line.indentationDiff != 0 && !line.isEmpty);
    badIndentationCountElement.innerHTML = badIndentationLines.length;
    dirtyPercentElement.innerHTML = (dirtyLines.length / lineObjects.length * 100).toFixed(2);

    let newIssuesListHTML = "";
    for (const line of dirtyLines) {
        newIssuesListHTML += 
            `<div class='issue'>${convertStringToEscapedHTML(line.errorMessage, false)}</div>`;
    }
    issuesListElement.innerHTML = newIssuesListHTML;


    let lineElements = document.getElementsByClassName("line");
    for (const lineElement of lineElements) {
        if (lineElement.dataset.matchingLineNumber != 0) {
            lineElement.onmouseover = (element) => {
                const twins = document.querySelectorAll(`[data-line-number="${lineElement.dataset.lineNumber}"]`);
                const spouses = document.querySelectorAll(`[data-line-number="${lineElement.dataset.matchingLineNumber}"]`);

                Array.from(lineElements).forEach(ln => ln.classList.remove("areMarried"));
                twins.forEach(twin => twin.classList.add("areMarried"));
                spouses.forEach(spouse => spouse.classList.add("areMarried"));
            };
            lineElement.onmouseout = (element) => {
                Array.from(lineElements).forEach(ln => ln.classList.remove("areMarried"));
            };
        }
    }

    reportElement.classList.remove("hide");
    reportElement.classList.add("fadeIn");

    //console.log(lineObjects);
}

function convertStringToEscapedHTML(stringWithNormalSpaces, shouldReplaceSpaces=true) {
    let result = stringWithNormalSpaces
        .replace(/&nbsp;/g, "&amp;nbsp;")
        .replace(/&copy;/g, "&amp;copy;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/\n/g, "<br>");
    if (shouldReplaceSpaces) {
        result = result.replace(/ /g, "&nbsp;");
    }
    return result;
}

function shouldAllowNestedCSSRules() {
    let params = null;
    
    if (location.hash.includes("?")) {
        let paramsWithoutHash = location.hash.substring(1).split("?")[1];
        params = new URLSearchParams(paramsWithoutHash);
    } else if (location.search) {
        params = new URLSearchParams(location.search);
    }

    if (params) {
        const pageParam = params.get('allowCSSNesting');
        if (pageParam !== null) {
            const report = document.getElementById("report");
            report.classList.add("nestedOverride");
            return true;
        }
    }

    return false;
}