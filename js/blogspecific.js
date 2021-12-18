const modalBackground = document.querySelector(".modalBackground");
const messageBox = document.querySelector(".messageBox");
const blogspecificPostBlock = document.querySelector(".blogspecificPostBlock");

const postCommentSectionCreateComment = document.querySelector(".postCommentSectionCreateComment");
const postCommentForm = document.querySelector("#postCommentForm")
const commentInputName = document.querySelector("#commentName");
const commentInputEmail = document.querySelector("#commentEmail");
const commentInputContent = document.querySelector("#commentContent");

const commentNameError = document.querySelector(".commentNameError");
const commentEmailError = document.querySelector(".commentEmailError");
const commentContentError = document.querySelector(".commentMessageError");


const queryString = document.location.search;
const queryParam = new URLSearchParams(queryString);
const postId = queryParam.get("post_id");

const apiLinkSinglePost = `https://ehtoday.one/assignments/dand/wp-json/wp/v2/posts/${postId}?_embed`;
const apiLinkComments =`https://ehtoday.one/assignments/dand/wp-json/wp/v2/comments?post=${postId}`;
const apiLinkCommentsAll =`https://ehtoday.one/assignments/dand/wp-json/wp/v2/comments`;

///////////////////////////////////////////////////////
// Main Post Getting Function

async function singlePostFetcher(inputApiLinkPost, inputApiLinkComments, inputApiLinkCommentsAll) {

    try {
        const firstCall = await fetch(inputApiLinkPost);
        const firstResponse = await firstCall.json();
        
        const secondCall = await fetch(inputApiLinkComments);
        const secondResponse = await secondCall.json();

        const thirdCall = await fetch(inputApiLinkCommentsAll);
        const thirdResponse = await thirdCall.json();

        ///////////////////////////////////////////////////////

        document.title = `D&D | ${firstResponse.title.rendered}`;

        let date = firstResponse.date;
        date = date.split('T')[0];

        const readingTimeParaTags = firstResponse.excerpt.rendered;
        const readingTimeTrim1 = readingTimeParaTags.replace('<p>','');
        let readingTimeTrim2 = readingTimeTrim1.replace('</p>','');

        if (readingTimeTrim2.length > 20) {
            readingTimeTrim2 = "No estimate";
        }

        ///////////////////////////////////////////////////////

        postCommentSectionCreateComment.style.display = "flex";
        let commentBlockBuild = "";

        for (let i = 0; i < secondResponse.length; i++) {

            commentBlockBuild += `
                <div class="postCommentSectionCommentBlock">
                    <p class="postCommentDate">${secondResponse[i].date.split('T')[0]}</p>
                    <p class="postCommentName">${secondResponse[i].author_name} said:</p>
                    ${secondResponse[i].content.rendered}
                </div>
            `;
        }

        let noComments = "";

        if (secondResponse.length === 0) {
            noComments = "<p>Be the first one to leave a comment!</p>"
        } else {
            noComments = "";
        }

        blogspecificPostBlock.innerHTML = `
            <h1>${firstResponse.title.rendered}</h1>
            <section class="postInformationHolder">
                <div class="postInformationBlock">
                    <h2 class="postInformationTitle">Published</h2>
                    <h2>${date}</h2>
                </div>
                <div class="postInformationBlock">
                    <h2 class="postInformationTitle">Author</h2>
                    <h2>${firstResponse._embedded.author[0].name}</h2>
                </div>
                <div class="postInformationBlock">
                    <h2 class="postInformationTitle">Reading time</h2>
                    <h2>${readingTimeTrim2}</h2>
                </div>
            </section>
            <section class="postMainContentHolder">
                ${firstResponse.content.rendered}
            </section>
            <section class="postCommentSectionHolder">
                <h2>Comments</h2>
                ${noComments}
                ${commentBlockBuild}
            </section>
        `;

        const img = document.querySelectorAll("img");

        for (let i = 0; i < img.length; i++) {
            img[i].addEventListener("click", imageModalOn);
        }

    } catch(error) {
        blogspecificPostBlock.innerHTML = `<p>An error has occured when fetching the post, please try again or contact us!</p>`
        postCommentSectionCreateComment.style.display = "none";
    }

};

modalBackground.addEventListener("click", imageModalOff);

singlePostFetcher(apiLinkSinglePost, apiLinkComments, apiLinkCommentsAll);

///////////////////////////////////////////////////////
// Comment validators

commentInputName.addEventListener("focusout", commentNameValidate);
commentInputEmail.addEventListener("focusout", commentEmailValidate);
commentInputContent.addEventListener("focusout", commentContentValidate);

function commentNameValidate() {
    if (commentInputName.value.trim().length > 0) {
        commentNameError.style.display = "none";
    } else {
        commentNameError.style.display = "flex";
    }
}

function commentEmailValidate() {
    if (commentInputEmail.value.trim().length > 0) {
        commentEmailError.style.display = "none";
    } else {
        commentEmailError.style.display = "flex";
    }
}

function commentContentValidate() {
    if (commentInputContent.value.trim().length > 0) {
        commentContentError.style.display = "none";
    } else {
        commentContentError.style.display = "flex";
    }
}

///////////////////////////////////////////////////////
// Comment Posting Function

postCommentForm.addEventListener("submit", postComment);

async function postComment(Event) {

    Event.preventDefault();

    const commentData = JSON.stringify({
        post: postId,
        author_name: commentInputName.value.trim(),
        author_email: commentInputEmail.value.trim(),
        content: commentInputContent.value.trim()
    });
    
    const postRequest = await fetch(apiLinkCommentsAll, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: commentData
        });

    const postResponse = await postRequest.json();

    if (postResponse.status === "approved") {
        messageBox.style.display = "flex";
        messageBox.innerHTML = `<p>Your comment was posted succesfully!</p>`;
        setTimeout(function() {
            messageBox.style.display = "none";
        }, 1500);
        singlePostFetcher(apiLinkSinglePost, apiLinkComments, apiLinkCommentsAll);
    } else {
        messageBox.style.display = "flex";
        messageBox.innerHTML = `<p>${postResponse.message}</p>`;
        setTimeout(function() {
            messageBox.style.display = "none";
        }, 2500);
    }
}

///////////////////////////////////////////////////////
// Modal Functions

function imageModalOn(Event) {
    const clickedImageLink = Event.target.getAttribute("src");
    modalBackground.innerHTML = `<img src="${clickedImageLink}" style="width: 65%">`;
    modalBackground.style.display = "flex";
}

function imageModalOff(Event) {
    if (Event.target.classList.contains("modalBackground")) {
        modalBackground.style.display = "none";
    }
}