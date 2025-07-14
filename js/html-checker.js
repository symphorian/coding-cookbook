const htmlInput = document.getElementById("html-input");
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
            generateReportOnHTML(htmlInput.value);
        } else if (urlInput.value) {
            fetchHTMLFromURL(urlInput.value);
        }
    }, 250);
}

function fetchHTMLFromURL(url) {
    fetch(url)
        .then(response => response.text())
        .then(html => {
            generateReportOnHTML(html);
        })
        .catch(error => {
            console.log("Error in fetching recipe: ", error);
        });
}

function generateReportOnHTML(rawInput) {
    const rawInputLines = rawInput.split("\n");
    const TAB_LENGTH = 4;
    const LINE_CHAR_LIMIT = 80;
    const VOID_ELEMENTS = ["link", "meta", "img", "hr", "br", "input"];
    const VALID_ELEMENTS = [
        "html",
        "head",
        "body",
        "div",
        "h1",
        "h2",
        "h3",
        "h4",
        "h5",
        "h6",
        "p",
        "i",
        "b",
        "u",
        "sup",
        "sub",
        "hr",
        "br",
        "ul",
        "ol",
        "li",
        "img",
        "span",
        "nav",
        "header",
        "footer",
        "main",
        "section",
        "aside",
        "figure",
        "video",
        "audio",
        "link",
        "title",
        "meta",
        "a",
        "button",
        "script",
        "form",
        "input",
        "table",
        "th",
        "tr",
        "td",
    ];
    const lineObjects = [];
    const parentStack = [];
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

        const tagNameRegex = /^<\s*([a-zA-Z0-9-]+)\b[^>]*/;
        const matches = newLineObject.trimmedInput.match(tagNameRegex);
        if (matches) {
            newLineObject.tagName = matches[1].toLowerCase();
        } else {
            const firstOpeningTagRegex = /<\s*([a-zA-Z0-9-]+)\b[^>]*/;
            const firstOpeningTagMatches = 
                newLineObject.trimmedInput.match(firstOpeningTagRegex);
            if (firstOpeningTagMatches) {
                newLineObject.tagName = firstOpeningTagMatches[1];
            } else {
                newLineObject.tagName = null;
            }
        }

        const closingTagNameRegex = /<\/\s*([a-zA-Z0-9-]+)\s*>$/;
        const closingTagMatches = 
            newLineObject.trimmedInput.match(closingTagNameRegex);
        if (closingTagMatches) {
            newLineObject.closingTagName = closingTagMatches[1].toLowerCase();
        } else {
            // if the closing tag isn't at the end, there could be multiple
            // matches, so try to go through all of them
            const allClosingTagNameRegex = /<\/\s*([a-zA-Z0-9-]+)\s*>/g;
            const allClosingTagMatches = 
                newLineObject.trimmedInput.matchAll(allClosingTagNameRegex);
            for (const match of allClosingTagMatches) {
                if (match[1] == newLineObject.tagName) {
                    newLineObject.closingTagName = match[1];
                    break;
                }
            }
            if (!newLineObject.closingTagName) {
                newLineObject.closingTagName = null;
            }
        }

        newLineObject.isVoidElement = 
            VOID_ELEMENTS.includes(newLineObject.tagName)
            || (
                lastLineObject
                && lastLineObject.isVoidElement
                && !lastLineObject.trimmedInput.includes(">")
            );
        newLineObject.hasClosingVoidTag =
            newLineObject.isVoidElement && newLineObject.closingTagName;
        newLineObject.isValidOpeningTag = 
            (!newLineObject.tagName || VALID_ELEMENTS.includes(newLineObject.tagName));
        newLineObject.isValidClosingTag = 
            (!newLineObject.closingTagName || VALID_ELEMENTS.includes(newLineObject.closingTagName));
            

        if (newLineObject.tagName && !newLineObject.closingTagName && !newLineObject.isVoidElement) {
            parentStack.push(newLineObject);
        }

        const incompleteTagRegex = /<[^>]*$/;
        newLineObject.isTagIncomplete = 
            incompleteTagRegex.test(newLineObject.trimmedInput);
        
        const hasAttributeRegex = /\b[a-zA-Z0-9-]+="[^"]*"/;
        newLineObject.containsAttribute = hasAttributeRegex.test(newLineObject.trimmedInput);

        newLineObject.hasDirtyAttributes = newLineObject.isTagIncomplete && newLineObject.containsAttribute;

        const hasSingleAttributeRegex = /^\s*[a-zA-Z0-9-]+\s*=\s*"[^"]*"\s*$/;
        newLineObject.containsSingleAttribute = 
            hasSingleAttributeRegex.test(newLineObject.trimmedInput);


        const closeAfterAttributeRegex = /^(?!.*<).*[^<]\S.*>$/;
        newLineObject.isDirtyClosedSplitTag = 
            closeAfterAttributeRegex.test(newLineObject.trimmedInput);

        const isDirtySplitElementRegex = /<\s*([a-zA-Z0-9-]+)\b[^>]*>\s*[^<]+$/;
        newLineObject.isDirtySplitElement =
            isDirtySplitElementRegex.test(newLineObject.trimmedInput)
            && !newLineObject.isVoidElement;

        // const containsCapsRegex = /<\/?[a-zA-Z0-9-]*[A-Z][a-zA-Z0-9-]*[^>]*>/;
        const containsCapsRegex = /<\/?[a-zA-Z0-9-]*[A-Z][a-zA-Z0-9-]*[^>]*>?/;
        newLineObject.hasCaps = containsCapsRegex.test(newLineObject.trimmedInput);

        // TODO: need to track if opening/closing tags are matched up;
        //      accounted for missing closing divs...but what about extra ones?
        //      e.g. https://github.com/CarlaC2024/CarlaC2024.github.io/blob/main/projects/Portfolio/index.html

        
        let indentation = 0;
        let foundMatchedParent = false;
        let isStrayClosingTag = false;
        if (!newLineObject.tagName && newLineObject.closingTagName) {
            let parentsPoppedCount = 0;
            while(!foundMatchedParent && parentStack.length > 0) {
                const poppedParent = parentStack.pop();
                parentsPoppedCount++;
                if (poppedParent.tagName == newLineObject.closingTagName) {
                    indentation = poppedParent.idealIndentation;
                    foundMatchedParent = true;
                    poppedParent.matchingLineNumber = newLineObject.lineNumber;
                    newLineObject.matchingLineNumber = poppedParent.lineNumber;
                    if (parentsPoppedCount > 1) {
                        newLineObject.isNearMissingClosingTags = true;
                    }
                } else if (parentStack.length == 0) {
                    indentation = newLineObject.actualIndentation;
                    isStrayClosingTag = true;
                    newLineObject.isStrayClosingTag = true;
                }
            }
        }
        
        if (!foundMatchedParent && !isStrayClosingTag && lastLineObject) {
            // debugger;
            if (
                (
                    lastLineObject.isVoidElement 
                    && lastLineObject.isTagIncomplete
                    && !newLineObject.tagName
                    && newLineObject.containsAttribute
                ) 
                || (
                    lastLineObject.isVoidAttribute
                    && !(
                        lastLineObject.trimmedInput.startsWith('>')
                        || lastLineObject.trimmedInput.startsWith('/>')
                    )
                )
            ) {
                newLineObject.isVoidAttribute = true;
            }
            /*
                If the last line has an opening tag
                    and is not a void element (or is an incomplete opening tag)
                    and is not a line with an attribute and > on the same line
                    and does not have a closing tag
                    and (
                        the current line does not have a closing tag
                        or (it does but) it has its own opening tag
                        or it doesn't match the previous line's opening tag
                         
                    )
                OR
                    if the last line starts with a >
            */
            if (
                (
                    lastLineObject.tagName 
                    && (
                        !lastLineObject.isVoidElement
                        || lastLineObject.isTagIncomplete
                    )
                    && !lastLineObject.closingTagName 
                    && !lastLineObject.isDirtyClosedSplitTag
                    && (
                        newLineObject.closingTagName == null
                        || newLineObject.tagName
                        || newLineObject.closingTagName != lastLineObject.tagName
                    )
                    && !(
                        newLineObject.trimmedInput.startsWith('>')
                        || newLineObject.trimmedInput.startsWith('/>')
                    )
                )
                || (
                    (
                        lastLineObject.trimmedInput.startsWith('>')
                        || lastLineObject.trimmedInput.startsWith('/>')
                    )
                    && !lastLineObject.isVoidAttribute
                )
            ) {
                indentation = lastLineObject.idealIndentation + TAB_LENGTH;
            // should this check if the closing tag matches the previous parent?
            } else if (
                (!newLineObject.tagName && newLineObject.closingTagName)
                || (
                    (
                        newLineObject.trimmedInput.startsWith('>')
                        || newLineObject.trimmedInput.startsWith('/>')
                    )
                    && !lastLineObject.isTagIncomplete
                )
                || (
                    lastLineObject.isDirtyClosedSplitTag
                    && lastLineObject.isVoidElement
                )
            ) {
                indentation = lastLineObject.idealIndentation - TAB_LENGTH;
            } else {
                indentation = lastLineObject.idealIndentation;
                newLineObject.isExcessLineSpace = 
                    newLineObject.isEmpty && lastLineObject.isEmpty;
            }
        }
        newLineObject.idealIndentation = indentation;

        lineObjects.push(newLineObject);
        if (!isStrayClosingTag) {
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

        line.hasDirtyCode = 
            (indentationDiff != 0 && !line.isEmpty)
            || line.isStrayClosingTag
            || line.isNearMissingClosingTags
            || line.hasDirtyAttributes
            || line.isDirtyClosedSplitTag
            || line.isDirtySplitElement
            || line.hasCaps
            || line.isExcessLineSpace
            || (!line.containsSingleAttribute && line.exceedsCharLimit)
            || !line.isValidOpeningTag
            || !line.isValidClosingTag
            || line.hasClosingVoidTag;

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

            if (line.isStrayClosingTag) {
                errorMessage += 
                    `  - This line appears to contain a stray closing tag, ` 
                    + `which does not match to an opening tag.\n`
            }

            if (line.isNearMissingClosingTags) {
                errorMessage += 
                    `  - This line is near where a missing closing tag is expected.\n`;
            }

            if (line.hasDirtyAttributes) {
                errorMessage += 
                    `  - Since this opening tag is split across multiple lines, `
                    + `the attribute(s) here should be moved to their own lines `
                    + `and indented.\n` 
            }

            if (line.isDirtyClosedSplitTag) {
                errorMessage += 
                    `  - Since this opening tag is split across multiple lines, `
                    + `the closing triangle bracket (>) here should be moved to its own line `
                    + `and outdented to align with the opening triangle bracket (<) above.\n` 
            }

            if (line.isDirtySplitElement) {
                errorMessage += 
                    `  - Since this element is split across multiple lines, `
                    + `the content following the opening tag `
                    + `should be moved to its own line and indented.\n` 
            }

            if (line.hasCaps) {
                errorMessage += 
                    `  - This line uses uppercase letters for tag or attribute names; `
                    + `lowercase letters are preferred.\n`;
            }

            if (line.isExcessLineSpace) {
                errorMessage += 
                    `  - More than one consecutive line of empty space is excessive; `
                    + `this line of code can be removed.\n`;
            }

            if (!line.containsSingleAttribute && line.exceedsCharLimit) {
                errorMessage += 
                    `  - This line exceeds the ${LINE_CHAR_LIMIT} character limit.\n`;
            }

            if (!line.isValidOpeningTag) {
                errorMessage += 
                    `  - The opening tag name "${line.tagName}" is not a valid HTML tag name.\n`;
            }

            if (!line.isValidClosingTag) {
                errorMessage += 
                    `  - The closing tag name "${line.closingTagName}" is not a valid HTML tag name.\n`;
            }

            if (line.hasClosingVoidTag) {
                errorMessage += 
                    `  - The closing tag name "${line.closingTagName}" represents a void element. `
                    + ` Void elements should not have closing tags.\n`;
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