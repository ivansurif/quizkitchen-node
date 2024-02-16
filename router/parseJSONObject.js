function extractQuestions(jsonObject) {
    const questions = jsonObject.contentResponseBody.return.questions;
    const extractedQuestions = [];

    questions.forEach(question => {
        if (question.question.type === 'mcq') {
            let questionValue = question.variant.definition.prompt.definition.value;
            let questionOptions = question.variant.definition.options.map(option => option.display.definition.value);

            // Remove HTML tags
            const htmlTagRegex = /<[^>]*>/g;
            questionValue = questionValue.replace(htmlTagRegex, '');
            questionOptions = questionOptions.map(option => option.replace(htmlTagRegex, ''));

            extractedQuestions.push({
                question_type: question.question.type,
                question_value: questionValue,
                question_options: questionOptions
            });
        }
    });

    return extractedQuestions;
}

function extractQuestionsManual(jsonObject) {
    
    console.log(jsonObject);
    const extractedQuestions = {};

    // let dropdownMenu = jsonObject.dropdownMenu;
    // let textInput1 = jsonObject.textInput1;
    // let textInput2 = jsonObject.textInput2;
    // let textInput3 = jsonObject.textInput3;
    
    for (let key in jsonObject) {
        if (jsonObject.hasOwnProperty(key)) {
            extractedQuestions.push(jsonObject[key]);
        }
    }
    
    console.log('****')
    console.log(extractedQuestions)

    return extractedQuestions;
}

export { extractQuestions, extractQuestionsManual };
